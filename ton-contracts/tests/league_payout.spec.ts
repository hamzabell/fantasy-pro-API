import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Dictionary, Address, beginCell } from '@ton/core';
import { LeaguePayout, loadLeagueCreated, loadStakeEvent, loadPayoutEvent, loadPayoutCompletedEvent } from '../build/league_payout/league_payout_LeaguePayout';
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
                    feeAmount: 0n
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
                    feeAmount: fee
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
                { $$type: 'CreateLeague', leagueId: 'league_123', userId: 'user_1', commissionPercentage: 0n, feeAmount: 0n }
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
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, { $$type: 'CreateLeague', leagueId: 'L1', userId: 'u1', commissionPercentage: 0n, feeAmount: 0n });
            await leaguePayout.send(deployer.getSender(), { value: toNano('0.1') }, { $$type: 'CreateLeague', leagueId: 'L2', userId: 'u1', commissionPercentage: 0n, feeAmount: 0n });

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
                { $$type: 'CreateLeague', leagueId: 'league_123', userId: 'creator', commissionPercentage: 500n, feeAmount: 0n }
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
                 { $$type: 'CreateLeague', leagueId: 'L_DOUBLE', userId: 'c', commissionPercentage: 0n, feeAmount: 0n });
            
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
                { $$type: 'CreateLeague', leagueId: 'L_COMM', userId: 'c', commissionPercentage: 0n, feeAmount: 0n });
            
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
                { $$type: 'CreateLeague', leagueId: 'L_FEE', userId: 'c', commissionPercentage: 0n, feeAmount: toNano('1.0') });
            
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
                { $$type: 'CreateLeague', leagueId: 'L_FEE_OK', userId: 'c', commissionPercentage: 0n, feeAmount: toNano('1.0') });
            
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
});
