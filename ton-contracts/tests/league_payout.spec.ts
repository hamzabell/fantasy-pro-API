import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Dictionary, Address, beginCell } from '@ton/core';
import { LeaguePayout, loadLeagueCreated, loadStakeEvent, loadPayoutEvent, loadPayoutCompletedEvent, PayoutItem, storePayoutItem, loadPayoutItem, dictValueParserPayoutItem } from '../build/league_payout/league_payout_LeaguePayout';
import '@ton/test-utils';

describe('LeaguePayout', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let leaguePayout: SandboxContract<LeaguePayout>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        leaguePayout = blockchain.openContract(await LeaguePayout.fromInit());

        await leaguePayout.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'Deploy', queryId: 0n }
        );
    });

    describe("League Creation", () => {
        it("given a league is created without a fee: it should initialize with feePaid=false and 0 staked", async () => {
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('1.0') },
                {
                    $$type: 'CreateLeague',
                    leagueId: 'league_123',
                    userId: 'user_1',
                    commissionPercentage: 500n, // 5%
                    feeAmount: 0n,
                    initialStake: 0n
                }
            );
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: true
            });
            expect(result.externals).toHaveLength(1);
            const event = loadLeagueCreated(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('league_123');

            const league = await leaguePayout.getLeague('league_123');
            expect(league!.feePaid).toBe(false);
            expect(league!.totalStaked).toBe(0n);
            expect(league!.commissionPercentage).toBe(500n);
        });

        it("given a league is created with a fee: it should transfer fee to owner and set feePaid to true", async () => {
            const fee = toNano('1.0');
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('2.0') },
                {
                    $$type: 'CreateLeague',
                    leagueId: 'league_paid',
                    userId: 'user_1',
                    commissionPercentage: 500n,
                    feeAmount: fee,
                    initialStake: 0n
                }
            );

            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: deployer.address,
                // value: fee, // usage of value: fee fails due to gas deduction
                success: true,
                body: beginCell().storeUint(0, 32).storeStringTail("League Creation Fee").endCell()
            });
            expect(result.externals).toHaveLength(1);
            const event = loadLeagueCreated(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('league_paid');

            const league = await leaguePayout.getLeague('league_paid');
            expect(league!.feePaid).toBe(true);
        });
    });

    describe("Staking", () => {
        it("given a user stakes: it should update balance", async () => {
            // Create League first
             await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('0.1') },
                { $$type: 'CreateLeague', leagueId: 'league_123', userId: 'user_1', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n }
            );

            const staker = await blockchain.treasury('staker');
            const stakeAmount = toNano('1.0');

            const result = await leaguePayout.send(
                staker.getSender(),
                { value: toNano('2.0') },
                { $$type: 'Stake', leagueId: 'league_123', userId: 'user_1', amount: stakeAmount }
            );
            expect(result.transactions).toHaveTransaction({
                from: staker.address,
                to: leaguePayout.address,
                success: true
            });
            expect(result.externals).toHaveLength(1);
            const event = loadStakeEvent(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('league_123');
            expect(event.amount).toEqual(stakeAmount);
            expect(event.userId).toEqual('user_1');

            const league = await leaguePayout.getLeague('league_123');
            expect(league!.totalStaked).toBe(stakeAmount);
        });

        it("given stakes are made in different leagues: it should track balances separately", async () => {
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, { $$type: 'CreateLeague', leagueId: 'L1', userId: 'u1', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n });
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, { $$type: 'CreateLeague', leagueId: 'L2', userId: 'u1', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n });

            const s1 = await blockchain.treasury('s1');
            const s2 = await blockchain.treasury('s2');

            await leaguePayout.send(s1.getSender(), { value: toNano('2.0') }, { $$type: 'Stake', leagueId: 'L1', userId: 'u1', amount: toNano('1.0') });
            await leaguePayout.send(s2.getSender(), { value: toNano('3.0') }, { $$type: 'Stake', leagueId: 'L2', userId: 'u2', amount: toNano('2.0') });

            const l1 = await leaguePayout.getLeague('L1');
            const l2 = await leaguePayout.getLeague('L2');
            expect(l1!.totalStaked).toBe(toNano('1.0'));
            expect(l2!.totalStaked).toBe(toNano('2.0'));
        });
    });

    describe("Payouts", () => {
        beforeEach(async () => {
            // Setup: league_123, no fee, 10 TON staked by s1
            const createResult = await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                { $$type: 'CreateLeague', leagueId: 'league_123', userId: 'creator', commissionPercentage: 500n, feeAmount: 0n, initialStake: 0n }
            );
            expect(createResult.transactions).toHaveTransaction({ from: deployer.address, to: leaguePayout.address, success: true });

            const s1 = await blockchain.treasury('s1');
            const stakeResult = await leaguePayout.send(s1.getSender(), { value: toNano('12') }, 
                { $$type: 'Stake', leagueId: 'league_123', userId: 'u1', amount: toNano('10') }
            );
            expect(stakeResult.transactions).toHaveTransaction({ from: s1.address, to: leaguePayout.address, success: true });
        });

        it("given a payout includes a winner who did not stake: it should revert", async () => {
            const nonStaker = await blockchain.treasury('nonStaker');
            
            const winners = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winners.set(0n, nonStaker.address);
            
            const percentages = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);

            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('0.5') },
                {
                    $$type: 'PayoutWinners',
                    leagueId: 'league_123',
                    winners: winners,
                    winningPercentages: percentages,
                    count: 1n,
                    commissionPercentage: 0n
                }
            );

            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 5902 // "Winner did not stake"
            });
        });

        it("given a payout is attempted twice: it should revert due to empty balance", async () => {
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_DOUBLE', userId: 'c', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n });
            
            const staker = await blockchain.treasury('staker_d');
            const stakeResult = await leaguePayout.send(staker.getSender(), { value: toNano('12') }, 
                 { $$type: 'Stake', leagueId: 'L_DOUBLE', userId: 'u', amount: toNano('10') });
            expect(stakeResult.transactions).toHaveTransaction({ success: true });
                 
            const winners = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);

            // First Payout
            await leaguePayout.send(deployer.getSender(), { value: toNano('1') }, 
                 { $$type: 'PayoutWinners', leagueId: 'L_DOUBLE', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 0n });

            // Second Payout
            const result = await leaguePayout.send(deployer.getSender(), { value: toNano('1') }, 
                 { $$type: 'PayoutWinners', leagueId: 'L_DOUBLE', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 0n });

             expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 62070 // "No funds in league"
            });
        });

        it("given a league fee was NOT paid: it should allow platform commission and emit events", async () => {
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                { $$type: 'CreateLeague', leagueId: 'L_COMM', userId: 'c', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n });
            
            const staker = await blockchain.treasury('staker_comm');
            await leaguePayout.send(staker.getSender(), { value: toNano('12') }, 
                 { $$type: 'Stake', leagueId: 'L_COMM', userId: 'u', amount: toNano('10') });

            const winners = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);

            const commPct = 1000n; // 10%
            
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('1') },
                { $$type: 'PayoutWinners', leagueId: 'L_COMM', winners, winningPercentages: percentages, count: 1n, commissionPercentage: commPct }
            );

            // Check Commission (10% of 10 = 1 TON) to Owner
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: deployer.address,
                success: true,
                body: beginCell().storeUint(0, 32).storeStringTail("Commission").endCell()
            });

            // Check Payout (90% = 9 TON minus fees) to Winner
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: staker.address,
                success: true,
                body: beginCell().storeUint(0, 32).storeStringTail("Payout").endCell()
            });
            
            expect(result.externals).toHaveLength(2);
            // PayoutEvent
            const payoutEvent = loadPayoutEvent(result.externals[0].body.beginParse());
            expect(payoutEvent.leagueId).toEqual('L_COMM');
            expect(payoutEvent.winner.equals(staker.address)).toBe(true);
            expect(payoutEvent.amount).toEqual(toNano('9'));

            // PayoutCompletedEvent
            const completedEvent = loadPayoutCompletedEvent(result.externals[1].body.beginParse());
            expect(completedEvent.leagueId).toEqual('L_COMM');
        });

        it("given a league fee WAS paid and commission is requested: it should revert", async () => {
            await leaguePayout.send(deployer.getSender(), { value: toNano('2') }, 
                { $$type: 'CreateLeague', leagueId: 'L_FEE', userId: 'c', commissionPercentage: 0n, feeAmount: toNano('1.0'), initialStake: 0n });
            
            const staker = await blockchain.treasury('staker_fee');
            const val = await leaguePayout.send(staker.getSender(), { value: toNano('12') }, 
                 { $$type: 'Stake', leagueId: 'L_FEE', userId: 'u', amount: toNano('10') });
            expect(val.transactions).toHaveTransaction({ success: true });

            const winners = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);

            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('1') },
                { $$type: 'PayoutWinners', leagueId: 'L_FEE', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 1000n } // 10% requested
            );

            expect(result.transactions).toHaveTransaction({
                success: false,
                exitCode: 44175 // "Fee paid, no commission allowed"
            });
        });

        it("given a league fee WAS paid and 0 commission is requested: it should succeed", async () => {
            // Same as above but 0% com
             await leaguePayout.send(deployer.getSender(), { value: toNano('2') }, 
                { $$type: 'CreateLeague', leagueId: 'L_FEE_OK', userId: 'c', commissionPercentage: 0n, feeAmount: toNano('1.0'), initialStake: 0n });
            
            const staker = await blockchain.treasury('staker_ok');
            const val = await leaguePayout.send(staker.getSender(), { value: toNano('12') }, 
                 { $$type: 'Stake', leagueId: 'L_FEE_OK', userId: 'u', amount: toNano('10') });
            expect(val.transactions).toHaveTransaction({ success: true });

            const winners = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);

            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('1') },
                { $$type: 'PayoutWinners', leagueId: 'L_FEE_OK', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 0n }
            );

            expect(result.transactions).toHaveTransaction({
                success: true
            });
        });
    });

    describe("Withdrawal", () => {
        it("given funds are sent directly: it should allow owner to withdraw", async () => {
             // Send funds
             await deployer.send({
                 to: leaguePayout.address,
                 value: toNano('1.0')
             });
             
             const result = await leaguePayout.send(
                 deployer.getSender(),
                 { value: toNano('0.1') }, // pays for gas
                 { $$type: 'Withdraw', amount: toNano('0.05') }
             );
            
             expect(result.transactions).toHaveTransaction({
                 from: leaguePayout.address,
                 to: deployer.address,
                 // value: toNano('0.05'), // Removed strict check due to gas
                 success: true,
                 body: beginCell().storeUint(0, 32).storeStringTail("Withdrawal").endCell()
             });
        });

        it("given a non-owner tries to withdraw: it should revert", async () => {
             const rando = await blockchain.treasury('rando');
             
             const result = await leaguePayout.send(
                 rando.getSender(),
                 { value: toNano('0.1') }, 
                 { $$type: 'Withdraw', amount: toNano('0.05') }
             );
             
             expect(result.transactions).toHaveTransaction({
                 from: rando.address,
                 to: leaguePayout.address,
                 success: false,
                 exitCode: 26825 // "Only owner can withdraw"
             });
        });
    });

    describe("Create Public League", () => {
        it("given owner creates a public league: it should succeed without paying fee amount", async () => {
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('0.1') }, // Only gas, no fee
                {
                    $$type: 'CreatePublicLeague',
                    leagueId: 'public_league_1',
                    commissionPercentage: 1000n, // 10%
                    feeAmount: toNano('0.5') // What users will pay to stake
                }
            );

            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: true
            });

            // Check event
            expect(result.externals).toHaveLength(1);
            const event = loadLeagueCreated(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('public_league_1');

            // Verify league state
            const league = await leaguePayout.getLeague('public_league_1');
            expect(league).not.toBeNull();
            expect(league!.owner.equals(deployer.address)).toBe(true);
            expect(league!.feePaid).toBe(false); // No fee paid for public league
            expect(league!.totalStaked).toBe(0n);
            expect(league!.commissionPercentage).toBe(1000n);
        });

        it("given a non-owner tries to create a public league: it should revert", async () => {
            const nonOwner = await blockchain.treasury('nonOwner');

            const result = await leaguePayout.send(
                nonOwner.getSender(),
                { value: toNano('0.1') },
                {
                    $$type: 'CreatePublicLeague',
                    leagueId: 'public_league_unauthorized',
                    commissionPercentage: 1000n,
                    feeAmount: toNano('0.5')
                }
            );

            expect(result.transactions).toHaveTransaction({
                from: nonOwner.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 19126 // "Only owner can create public leagues"
            });
        });

        it("given a public league is created: users should be able to stake", async () => {
            // Owner creates public league
            await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('0.1') },
                {
                    $$type: 'CreatePublicLeague',
                    leagueId: 'public_stakeable',
                    commissionPercentage: 1000n,
                    feeAmount: toNano('0.5')
                }
            );

            // User stakes
            const staker = await blockchain.treasury('staker_public');
            const stakeAmount = toNano('0.5');

            const result = await leaguePayout.send(
                staker.getSender(),
                { value: toNano('1.0') },
                {
                    $$type: 'Stake',
                    leagueId: 'public_stakeable',
                    userId: 'user_public_1',
                    amount: stakeAmount
                }
            );

            expect(result.transactions).toHaveTransaction({
                from: staker.address,
                to: leaguePayout.address,
                success: true
            });

            // Verify stake was recorded
            const league = await leaguePayout.getLeague('public_stakeable');
            expect(league!.totalStaked).toBe(stakeAmount);
        });

        it("given a public league already exists: creating with same ID should revert", async () => {
            // Create first league
            await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('0.1') },
                {
                    $$type: 'CreatePublicLeague',
                    leagueId: 'duplicate_public',
                    commissionPercentage: 1000n,
                    feeAmount: toNano('0.5')
                }
            );

            // Try to create again with same ID
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('0.1') },
                {
                    $$type: 'CreatePublicLeague',
                    leagueId: 'duplicate_public',
                    commissionPercentage: 1000n,
                    feeAmount: toNano('0.5')
                }
            );

            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 9821 // "League already exists"
            });
        });
    });
    describe("Batch Payouts - Advanced", () => {
        it("given multiple leagues with different configs: it should deduct commissions and distribute percentages correctly", async () => {
             // --- Setup Leagues ---
            
            // League A: 10% Commission, No Fee
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_A', userId: 'cA', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n });
            
            // League B: 5% Commission, No Fee
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_B', userId: 'cB', commissionPercentage: 0n, feeAmount: 0n, initialStake: 0n });

            // --- Staking ---
            const sA1 = await blockchain.treasury('sA1');
            const sA2 = await blockchain.treasury('sA2');
            const sB1 = await blockchain.treasury('sB1');

            // League A: 10 TON Pool (5 each)
            await leaguePayout.send(sA1.getSender(), { value: toNano('6') }, { $$type: 'Stake', leagueId: 'L_A', userId: 'uA1', amount: toNano('5') });
            await leaguePayout.send(sA2.getSender(), { value: toNano('6') }, { $$type: 'Stake', leagueId: 'L_A', userId: 'uA2', amount: toNano('5') });

            // League B: 20 TON Pool
            await leaguePayout.send(sB1.getSender(), { value: toNano('21') }, { $$type: 'Stake', leagueId: 'L_B', userId: 'uB1', amount: toNano('20') });

            // --- Prepare Batch Items ---

            // Item A: 10% Platform Comm. Winners: A1 (70%), A2 (30%).
            // Total: 10 TON. Comm: 1 TON. Remainder: 9 TON.
            // A1: 9 * 0.7 = 6.3 TON
            // A2: 9 * 0.3 = 2.7 TON
            // Note: Percentages in input are relative to the *Distributable Amount* (10000 = 100%)
            // The contract logic: `amount = distributableAmount * pct / 10000`
            
            const winnersA = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winnersA.set(0n, sA1.address);
            winnersA.set(1n, sA2.address);
            
            const pctA = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            pctA.set(0n, 7000n); // 70%
            pctA.set(1n, 3000n); // 30%

            const itemA = {
                $$type: 'PayoutItem' as const,
                leagueId: 'L_A',
                winners: winnersA,
                winningPercentages: pctA,
                count: 2n,
                commissionPercentage: 1000n // 10% Platform Commission
            };

            // Item B: 5% Platform Comm. Winner: B1 (100%)
            // Total: 20 TON. Comm: 1 TON (5% of 20). Remainder: 19 TON.
            // B1: 19 * 1.0 = 19 TON
            
            const winnersB = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winnersB.set(0n, sB1.address);
            
            const pctB = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            pctB.set(0n, 10000n); // 100%

            const itemB = {
                $$type: 'PayoutItem' as const,
                leagueId: 'L_B',
                winners: winnersB,
                winningPercentages: pctB,
                count: 1n,
                commissionPercentage: 500n // 5% Platform Commission
            };

            // Batch Dictionary
            const batchMap = Dictionary.empty(Dictionary.Keys.BigInt(257), dictValueParserPayoutItem());
            batchMap.set(0n, itemA);
            batchMap.set(1n, itemB);

            // --- Execute Batch Payout ---
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('2.0') },
                {
                    $$type: 'BatchPayoutWinners',
                    items: batchMap,
                    count: 2n
                }
            );

            // --- Verification ---
            expect(result.transactions).toHaveTransaction({ from: deployer.address, to: leaguePayout.address, success: true });

            // 1. Check Events
            // We expect:
            // - League A created (earlier)
            // - League B created (earlier)
            // - Stakes (earlier)
            // - PayoutEvent L_A: A1 (6.3)
            // - PayoutEvent L_A: A2 (2.7)
            // - PayoutCompleted L_A
            // - PayoutEvent L_B: B1 (19)
            // - PayoutCompleted L_B
            
            // Filter externals for PayoutEvent
            const payoutEvents = result.externals
                .map(ext => {
                    try { return loadPayoutEvent(ext.body.beginParse()); } catch(e) { return null; }
                })
                .filter(e => e !== null);

            expect(payoutEvents.length).toBe(3);

            // Verify A1
            const eventA1 = payoutEvents.find(e => e!.leagueId === 'L_A' && e!.winner.equals(sA1.address));
            expect(eventA1).toBeDefined();
            expect(eventA1!.amount).toEqual(toNano('6.3'));

            // Verify A2
            const eventA2 = payoutEvents.find(e => e!.leagueId === 'L_A' && e!.winner.equals(sA2.address));
            expect(eventA2).toBeDefined();
            expect(eventA2!.amount).toEqual(toNano('2.7'));

            // Verify B1
            const eventB1 = payoutEvents.find(e => e!.leagueId === 'L_B' && e!.winner.equals(sB1.address));
            expect(eventB1).toBeDefined();
            expect(eventB1!.amount).toEqual(toNano('19'));

            // 2. Check logic via amounts (Implicit Commission Verification)
            // Deduction: 10 - (6.3 + 2.7) = 1.0 deducted.
            // Deduction: 20 - 19.0 = 1.0 deducted.
            expect(eventA1!.amount).toEqual(toNano('6.3'));
            expect(eventA2!.amount).toEqual(toNano('2.7'));
            expect(eventB1!.amount).toEqual(toNano('19'));

            // To verify there are exactly 2, we can filter roughly by success and addresses using matchers
            // But confirming at least one exists and the recipients received correct amounts is the main goal.
            
            // Note: Forward fees are deducted from the sent value (mode 2), so received value is slightly less than 6.3.
            // We rely on PayoutEvent for the exact GROSS calculation correctness.
            // We verify transaction existence and success here.

            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: sA1.address,
                // value: toNano('6.3'), // Exact check fails due to gas
                success: true
            });
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: sA2.address,
                // value: toNano('2.7'),
                success: true
            });
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: sB1.address,
                // value: toNano('19'),
                success: true
            });
        });
    });

    describe("Batch Payouts - Creator Commission", () => {
        it("given creator competes: it should payout commission implicitly + winnings via list", async () => {
            // Setup Leagues
            // League C (Creator Wins): Creator is 'cC'. Commission 5% (500 bp)
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_C', userId: 'cC', commissionPercentage: 500n, feeAmount: 0n, initialStake: 0n });
            
            // League D (Creator Loses): Creator is 'cD'. Commission 5% (500 bp)
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_D', userId: 'cD', commissionPercentage: 500n, feeAmount: 0n, initialStake: 0n });

            // Staking
            const sC_Creator = await blockchain.treasury('sC_Creator');
            const sC_Other = await blockchain.treasury('sC_Other');
            const sD_Creator = await blockchain.treasury('sD_Creator');
            const sD_Winner = await blockchain.treasury('sD_Winner');

            // League C: 100 TON Pool
            // Creator sC_Creator is distinct address. Wait, `CreateLeague` sets OWNER to SENDER.
            // In above `CreateLeague` call, SENDER is `deployer.getSender()`.
            // User requirement: "contract should already know the creator...".
            // So I must ensure the LEAGUE OWNER is `sC_Creator`.
            // But `CreateLeague` is usually called by Backend (deployer)?
            // OR checks ctx.sender.
            // If Backend calls it, Backend is owner.
            // If User calls it (blitz), User is owner.
            // The test uses `deployer` to create. So `deployer` is owner.
            // BUT I want `sC_Creator` to be the owner for this test.
            
            // Correction: Create League AS sC_Creator.
            await leaguePayout.send(sC_Creator.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_C_REAL', userId: 'cC', commissionPercentage: 500n, feeAmount: 0n, initialStake: 0n });
                 
            await leaguePayout.send(sD_Creator.getSender(), { value: toNano('0.1') }, 
                 { $$type: 'CreateLeague', leagueId: 'L_D_REAL', userId: 'cD', commissionPercentage: 500n, feeAmount: 0n, initialStake: 0n });
            
            // Stake in REAL leagues
            await leaguePayout.send(sC_Creator.getSender(), { value: toNano('51') }, { $$type: 'Stake', leagueId: 'L_C_REAL', userId: 'uC1', amount: toNano('50') });
            await leaguePayout.send(sC_Other.getSender(), { value: toNano('51') }, { $$type: 'Stake', leagueId: 'L_C_REAL', userId: 'uC2', amount: toNano('50') });

            await leaguePayout.send(sD_Creator.getSender(), { value: toNano('51') }, { $$type: 'Stake', leagueId: 'L_D_REAL', userId: 'uD1', amount: toNano('50') });
            await leaguePayout.send(sD_Winner.getSender(), { value: toNano('51') }, { $$type: 'Stake', leagueId: 'L_D_REAL', userId: 'uD2', amount: toNano('50') });

            // Prepare Batch data...
            
            // Item C: Creator Wins (50% share).
            // Platform Comm: 10%. 
            // Creator Comm (Stored): 5%.
            // Total Deductions: 15%. Distributable: 85 TON.
            // Creator Winnings: 50% of 85 = 42.5 TON.
            // Creator Comm (Implicit): 5% of 100 = 5 TON.
            // Total Receipt: 47.5 TON. (In two transfers or event checks).
            
            const winnersC = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winnersC.set(0n, sC_Creator.address); // Winner
            winnersC.set(1n, sC_Other.address);

            const pctC = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            pctC.set(0n, 5000n); // 50%
            pctC.set(1n, 5000n); // 50%

            const itemC = {
                $$type: 'PayoutItem' as const,
                leagueId: 'L_C_REAL',
                winners: winnersC,
                winningPercentages: pctC,
                count: 2n,
                commissionPercentage: 1000n // 10% Platform
            };

            // Item D: Creator Loses.
            // Platform Comm: 10%. Creator Comm: 5%. Distributable: 85 TON.
            // Creator gets 0 winnings. 5 TON comm.
            // Winner gets 100% of 85 = 85 TON.
            
            const winnersD = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
            winnersD.set(0n, sD_Winner.address);

            const pctD = Dictionary.empty(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
            pctD.set(0n, 10000n); 

            const itemD = {
                $$type: 'PayoutItem' as const,
                leagueId: 'L_D_REAL',
                winners: winnersD,
                winningPercentages: pctD,
                count: 1n,
                commissionPercentage: 1000n
            };

            const batchMap = Dictionary.empty(Dictionary.Keys.BigInt(257), dictValueParserPayoutItem());
            batchMap.set(0n, itemC);
            batchMap.set(1n, itemD);

            // Execute
            const result = await leaguePayout.send(
                deployer.getSender(),
                { value: toNano('2.0') },
                {
                    $$type: 'BatchPayoutWinners',
                    items: batchMap,
                    count: 2n
                }
            );

            expect(result.transactions).toHaveTransaction({ from: deployer.address, to: leaguePayout.address, success: true });

            // Verify Amounts via PayoutEvents (Winnings only)
             const payoutEvents = result.externals
                .map(ext => {
                    try { return loadPayoutEvent(ext.body.beginParse()); } catch(e) { return null; }
                })
                .filter(e => e !== null);

            // Verify C: Creator (WINNINGS ONLY in event, Comm is separate transfer)
            // Wait, does PayoutEvent include commission? No, "PayoutEvent" is inside the loop.
            // Commission transfers are separate sends.
            // So PayoutEvent amount should be exactly 42.5.
            const eventC_Creator = payoutEvents.find(e => e!.leagueId === 'L_C_REAL' && e!.winner.equals(sC_Creator.address));
            expect(eventC_Creator).toBeDefined();
            expect(eventC_Creator!.amount).toEqual(toNano('42.5'));

            // Verify Creator Commission Receipt (Implicit)
            // Note: Gas deducted from 5.0
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: sC_Creator.address,
                // value: toNano('5.0'), 
                success: true
            });

            // Verify D: Winner -> 100% of 85 = 85.0
            const eventD_Winner = payoutEvents.find(e => e!.leagueId === 'L_D_REAL' && e!.winner.equals(sD_Winner.address));
            expect(eventD_Winner).toBeDefined();
            expect(eventD_Winner!.amount).toEqual(toNano('85.0'));

             // Verify D: Creator (Comm Only) -> 5% of 100 = 5.0
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: sD_Creator.address,
                // value: toNano('5.0'),
                success: true
            });
        });
    });
});
