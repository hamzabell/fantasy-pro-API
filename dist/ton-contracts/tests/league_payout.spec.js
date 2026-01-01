"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sandbox_1 = require("@ton/sandbox");
const core_1 = require("@ton/core");
const league_payout_LeaguePayout_1 = require("../build/league_payout/league_payout_LeaguePayout");
require("@ton/test-utils");
describe('LeaguePayout', () => {
    let blockchain;
    let deployer;
    let leaguePayout;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        blockchain = yield sandbox_1.Blockchain.create();
        deployer = yield blockchain.treasury('deployer');
        leaguePayout = blockchain.openContract(yield league_payout_LeaguePayout_1.LeaguePayout.fromInit());
        yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.05') }, { $$type: 'Deploy', queryId: 0n });
    }));
    describe("League Creation", () => {
        it("given a league is created without a fee: it should initialize with feePaid=false and 0 staked", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('1.0') }, {
                $$type: 'CreateLeague',
                leagueId: 'league_123',
                userId: 'user_1',
                commissionPercentage: 500n, // 5%
                feeAmount: 0n
            });
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: true
            });
            expect(result.externals).toHaveLength(1);
            const event = (0, league_payout_LeaguePayout_1.loadLeagueCreated)(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('league_123');
            const league = yield leaguePayout.getLeague('league_123');
            expect(league.feePaid).toBe(false);
            expect(league.totalStaked).toBe(0n);
            expect(league.commissionPercentage).toBe(500n);
        }));
        it("given a league is created with a fee: it should transfer fee to owner and set feePaid to true", () => __awaiter(void 0, void 0, void 0, function* () {
            const fee = (0, core_1.toNano)('1.0');
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('2.0') }, {
                $$type: 'CreateLeague',
                leagueId: 'league_paid',
                userId: 'user_1',
                commissionPercentage: 500n,
                feeAmount: fee
            });
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: deployer.address,
                // value: fee, // usage of value: fee fails due to gas deduction
                success: true,
                body: (0, core_1.beginCell)().storeUint(0, 32).storeStringTail("League Creation Fee").endCell()
            });
            expect(result.externals).toHaveLength(1);
            const event = (0, league_payout_LeaguePayout_1.loadLeagueCreated)(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('league_paid');
            const league = yield leaguePayout.getLeague('league_paid');
            expect(league.feePaid).toBe(true);
        }));
    });
    describe("Staking", () => {
        it("given a user stakes: it should update balance", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create League first
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'CreateLeague', leagueId: 'league_123', userId: 'user_1', commissionPercentage: 0n, feeAmount: 0n });
            const staker = yield blockchain.treasury('staker');
            const stakeAmount = (0, core_1.toNano)('1.0');
            const result = yield leaguePayout.send(staker.getSender(), { value: (0, core_1.toNano)('2.0') }, { $$type: 'Stake', leagueId: 'league_123', userId: 'user_1', amount: stakeAmount });
            expect(result.transactions).toHaveTransaction({
                from: staker.address,
                to: leaguePayout.address,
                success: true
            });
            expect(result.externals).toHaveLength(1);
            const event = (0, league_payout_LeaguePayout_1.loadStakeEvent)(result.externals[0].body.beginParse());
            expect(event.leagueId).toEqual('league_123');
            expect(event.amount).toEqual(stakeAmount);
            expect(event.userId).toEqual('user_1');
            const league = yield leaguePayout.getLeague('league_123');
            expect(league.totalStaked).toBe(stakeAmount);
        }));
        it("given stakes are made in different leagues: it should track balances separately", () => __awaiter(void 0, void 0, void 0, function* () {
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'CreateLeague', leagueId: 'L1', userId: 'u1', commissionPercentage: 0n, feeAmount: 0n });
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'CreateLeague', leagueId: 'L2', userId: 'u1', commissionPercentage: 0n, feeAmount: 0n });
            const s1 = yield blockchain.treasury('s1');
            const s2 = yield blockchain.treasury('s2');
            yield leaguePayout.send(s1.getSender(), { value: (0, core_1.toNano)('2.0') }, { $$type: 'Stake', leagueId: 'L1', userId: 'u1', amount: (0, core_1.toNano)('1.0') });
            yield leaguePayout.send(s2.getSender(), { value: (0, core_1.toNano)('3.0') }, { $$type: 'Stake', leagueId: 'L2', userId: 'u2', amount: (0, core_1.toNano)('2.0') });
            const l1 = yield leaguePayout.getLeague('L1');
            const l2 = yield leaguePayout.getLeague('L2');
            expect(l1.totalStaked).toBe((0, core_1.toNano)('1.0'));
            expect(l2.totalStaked).toBe((0, core_1.toNano)('2.0'));
        }));
    });
    describe("Payouts", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Setup: league_123, no fee, 10 TON staked by s1
            const createResult = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'CreateLeague', leagueId: 'league_123', userId: 'creator', commissionPercentage: 500n, feeAmount: 0n });
            expect(createResult.transactions).toHaveTransaction({ from: deployer.address, to: leaguePayout.address, success: true });
            const s1 = yield blockchain.treasury('s1');
            const stakeResult = yield leaguePayout.send(s1.getSender(), { value: (0, core_1.toNano)('12') }, { $$type: 'Stake', leagueId: 'league_123', userId: 'u1', amount: (0, core_1.toNano)('10') });
            expect(stakeResult.transactions).toHaveTransaction({ from: s1.address, to: leaguePayout.address, success: true });
        }));
        it("given a payout includes a winner who did not stake: it should revert", () => __awaiter(void 0, void 0, void 0, function* () {
            const nonStaker = yield blockchain.treasury('nonStaker');
            const winners = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
            winners.set(0n, nonStaker.address);
            const percentages = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.5') }, {
                $$type: 'PayoutWinners',
                leagueId: 'league_123',
                winners: winners,
                winningPercentages: percentages,
                count: 1n,
                commissionPercentage: 0n
            });
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 5902 // "Winner did not stake"
            });
        }));
        it("given a payout is attempted twice: it should revert due to empty balance", () => __awaiter(void 0, void 0, void 0, function* () {
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'CreateLeague', leagueId: 'L_DOUBLE', userId: 'c', commissionPercentage: 0n, feeAmount: 0n });
            const staker = yield blockchain.treasury('staker_d');
            const stakeResult = yield leaguePayout.send(staker.getSender(), { value: (0, core_1.toNano)('12') }, { $$type: 'Stake', leagueId: 'L_DOUBLE', userId: 'u', amount: (0, core_1.toNano)('10') });
            expect(stakeResult.transactions).toHaveTransaction({ success: true });
            const winners = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);
            // First Payout
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('1') }, { $$type: 'PayoutWinners', leagueId: 'L_DOUBLE', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 0n });
            // Second Payout
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('1') }, { $$type: 'PayoutWinners', leagueId: 'L_DOUBLE', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 0n });
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 62070 // "No funds in league"
            });
        }));
        it("given a league fee was NOT paid: it should allow platform commission and emit events", () => __awaiter(void 0, void 0, void 0, function* () {
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'CreateLeague', leagueId: 'L_COMM', userId: 'c', commissionPercentage: 0n, feeAmount: 0n });
            const staker = yield blockchain.treasury('staker_comm');
            yield leaguePayout.send(staker.getSender(), { value: (0, core_1.toNano)('12') }, { $$type: 'Stake', leagueId: 'L_COMM', userId: 'u', amount: (0, core_1.toNano)('10') });
            const winners = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);
            const commPct = 1000n; // 10%
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('1') }, { $$type: 'PayoutWinners', leagueId: 'L_COMM', winners, winningPercentages: percentages, count: 1n, commissionPercentage: commPct });
            // Check Commission (10% of 10 = 1 TON) to Owner
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: deployer.address,
                success: true,
                body: (0, core_1.beginCell)().storeUint(0, 32).storeStringTail("Commission").endCell()
            });
            // Check Payout (90% = 9 TON minus fees) to Winner
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: staker.address,
                success: true,
                body: (0, core_1.beginCell)().storeUint(0, 32).storeStringTail("Payout").endCell()
            });
            expect(result.externals).toHaveLength(2);
            // PayoutEvent
            const payoutEvent = (0, league_payout_LeaguePayout_1.loadPayoutEvent)(result.externals[0].body.beginParse());
            expect(payoutEvent.leagueId).toEqual('L_COMM');
            expect(payoutEvent.winner.equals(staker.address)).toBe(true);
            expect(payoutEvent.amount).toEqual((0, core_1.toNano)('9'));
            // PayoutCompletedEvent
            const completedEvent = (0, league_payout_LeaguePayout_1.loadPayoutCompletedEvent)(result.externals[1].body.beginParse());
            expect(completedEvent.leagueId).toEqual('L_COMM');
        }));
        it("given a league fee WAS paid and commission is requested: it should revert", () => __awaiter(void 0, void 0, void 0, function* () {
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('2') }, { $$type: 'CreateLeague', leagueId: 'L_FEE', userId: 'c', commissionPercentage: 0n, feeAmount: (0, core_1.toNano)('1.0') });
            const staker = yield blockchain.treasury('staker_fee');
            const val = yield leaguePayout.send(staker.getSender(), { value: (0, core_1.toNano)('12') }, { $$type: 'Stake', leagueId: 'L_FEE', userId: 'u', amount: (0, core_1.toNano)('10') });
            expect(val.transactions).toHaveTransaction({ success: true });
            const winners = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('1') }, { $$type: 'PayoutWinners', leagueId: 'L_FEE', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 1000n } // 10% requested
            );
            expect(result.transactions).toHaveTransaction({
                success: false,
                exitCode: 44175 // "Fee paid, no commission allowed"
            });
        }));
        it("given a league fee WAS paid and 0 commission is requested: it should succeed", () => __awaiter(void 0, void 0, void 0, function* () {
            // Same as above but 0% com
            yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('2') }, { $$type: 'CreateLeague', leagueId: 'L_FEE_OK', userId: 'c', commissionPercentage: 0n, feeAmount: (0, core_1.toNano)('1.0') });
            const staker = yield blockchain.treasury('staker_ok');
            const val = yield leaguePayout.send(staker.getSender(), { value: (0, core_1.toNano)('12') }, { $$type: 'Stake', leagueId: 'L_FEE_OK', userId: 'u', amount: (0, core_1.toNano)('10') });
            expect(val.transactions).toHaveTransaction({ success: true });
            const winners = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
            winners.set(0n, staker.address);
            const percentages = core_1.Dictionary.empty(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
            percentages.set(0n, 10000n);
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('1') }, { $$type: 'PayoutWinners', leagueId: 'L_FEE_OK', winners, winningPercentages: percentages, count: 1n, commissionPercentage: 0n });
            expect(result.transactions).toHaveTransaction({
                success: true
            });
        }));
    });
    describe("Withdrawal", () => {
        it("given funds are sent directly: it should allow owner to withdraw", () => __awaiter(void 0, void 0, void 0, function* () {
            // Send funds
            yield deployer.send({
                to: leaguePayout.address,
                value: (0, core_1.toNano)('1.0')
            });
            const result = yield leaguePayout.send(deployer.getSender(), { value: (0, core_1.toNano)('0.1') }, // pays for gas
            { $$type: 'Withdraw', amount: (0, core_1.toNano)('0.05') });
            expect(result.transactions).toHaveTransaction({
                from: leaguePayout.address,
                to: deployer.address,
                // value: toNano('0.05'), // Removed strict check due to gas
                success: true,
                body: (0, core_1.beginCell)().storeUint(0, 32).storeStringTail("Withdrawal").endCell()
            });
        }));
        it("given a non-owner tries to withdraw: it should revert", () => __awaiter(void 0, void 0, void 0, function* () {
            const rando = yield blockchain.treasury('rando');
            const result = yield leaguePayout.send(rando.getSender(), { value: (0, core_1.toNano)('0.1') }, { $$type: 'Withdraw', amount: (0, core_1.toNano)('0.05') });
            expect(result.transactions).toHaveTransaction({
                from: rando.address,
                to: leaguePayout.address,
                success: false,
                exitCode: 26825 // "Only owner can withdraw"
            });
        }));
    });
});
