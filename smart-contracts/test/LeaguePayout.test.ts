
import { expect } from "chai";
import { ethers } from "hardhat";
import { LeaguePayout } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LeaguePayout", function () {
  let leaguePayout: LeaguePayout;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let user3: HardhatEthersSigner;

  const leagueId = "league_123";
  const userId1 = "user_1";
  const userId2 = "user_2";
  const userId3 = "user_3";

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    const LeaguePayoutFactory = await ethers.getContractFactory("LeaguePayout");
    leaguePayout = await LeaguePayoutFactory.deploy();
  });

  describe("League Creation", function () {
    it("given a league is created without a fee: it should emit LeagueCreated and mark creator as staker", async function () {
        const commissionResult = 500; // 5%
        await expect(leaguePayout.connect(user1).createLeague(leagueId, userId1, commissionResult, { value: 0 }))
            .to.emit(leaguePayout, "LeagueCreated")
            .withArgs(leagueId, userId1, commissionResult, user1.address, 0);
        
        expect(await leaguePayout.leagueFeePaid(leagueId)).to.be.false;
        expect(await leaguePayout.hasStaked(leagueId, user1.address)).to.be.true; 
    });

    it("given a league is created with a fee: it should transfer fee to owner and set feePaid to true", async function () {
        const fee = ethers.parseEther("1.0");
        const commissionResult = 500;
        
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

        await expect(leaguePayout.connect(user1).createLeague(leagueId, userId1, commissionResult, { value: fee }))
            .to.emit(leaguePayout, "LeagueCreated")
            .withArgs(leagueId, userId1, commissionResult, user1.address, fee);
        
        expect(await leaguePayout.leagueFeePaid(leagueId)).to.be.true;
        
        expect(await ethers.provider.getBalance(owner.address)).to.equal(initialOwnerBalance + fee);
    });
  });

  describe("Staking", function () {
    it("given a user stakes: it should update balance and emit Stake event", async function () {
      const stakeAmount = ethers.parseEther("1.0");

      await expect(leaguePayout.connect(user1).stake(leagueId, userId1, { value: stakeAmount }))
        .to.emit(leaguePayout, "Stake")
        .withArgs(user1.address, stakeAmount, userId1, leagueId);

      expect(await leaguePayout.leagueBalances(leagueId)).to.equal(stakeAmount);
      expect(await leaguePayout.hasStaked(leagueId, user1.address)).to.be.true;
    });

    it("given stakes are made in different leagues: it should track balances separately", async function () {
        const league2 = "league_456";
        const amount1 = ethers.parseEther("1.0");
        const amount2 = ethers.parseEther("2.0");

        await leaguePayout.connect(user1).stake(leagueId, userId1, { value: amount1 });
        await leaguePayout.connect(user2).stake(league2, userId2, { value: amount2 });

        expect(await leaguePayout.leagueBalances(leagueId)).to.equal(amount1);
        expect(await leaguePayout.leagueBalances(league2)).to.equal(amount2);
    });
  });

  describe("Payouts", function () {
    beforeEach(async function () {
       // Setup: user1 creates league (no fee), user2 stakes.
       await leaguePayout.connect(user1).createLeague(leagueId, userId1, 500, { value: 0 });
       await leaguePayout.connect(user2).stake(leagueId, userId2, { value: ethers.parseEther("10.0") });
    });

    it("given a payout includes a winner who did not stake: it should revert", async function () {
        const winners = [user3.address]; // User3 never staked or created
        const percentages = [10000];

        await expect(
            leaguePayout.payoutWinners(leagueId, winners, percentages, 0)
        ).to.be.revertedWith("Winner did not stake");
    });

    it("given payout args have mismatched array lengths: it should revert", async function () {
        const winners = [user1.address, user2.address];
        const percentages = [5000]; // Missing one percentage

        await expect(
            leaguePayout.payoutWinners(leagueId, winners, percentages, 0)
        ).to.be.revertedWith("Arrays length mismatch");
    });

    it("given a payout is attempted twice: it should revert due to empty balance (Reentrancy Prevention)", async function () {
        const winners = [user2.address];
        const percentages = [10000];

        // First payout succeeds
        await leaguePayout.payoutWinners(leagueId, winners, percentages, 0);

        // Second payout fails because balance is 0
        await expect(
             leaguePayout.payoutWinners(leagueId, winners, percentages, 0)
        ).to.be.revertedWith("No funds in league");
    });

    it("given a league fee was NOT paid: it should allow platform commission", async function () {
        const commissionPercentage = 1000; // 10%
        const winners = [user2.address];
        const percentages = [10000]; // 100% of distributable

        // Total: 10.0. Commission: 1.0. Distributable: 9.0.
        // Winner gets 100% of 9.0 = 9.0.
        
        const tx = await leaguePayout.payoutWinners(leagueId, winners, percentages, commissionPercentage);
        
        await expect(tx)
            .to.emit(leaguePayout, "PayoutCompleted")
            .withArgs(leagueId, ethers.parseEther("9.0"), ethers.parseEther("1.0"));
        
        await expect(tx)
            .to.emit(leaguePayout, "Payout")
            .withArgs(leagueId, user2.address, ethers.parseEther("9.0"));
    });

    it("given a league fee WAS paid and commission is requested: it should revert", async function () {
        const leagueWithFee = "league_fee";
        await leaguePayout.connect(user1).createLeague(leagueWithFee, userId1, 500, { value: ethers.parseEther("1.0") });
        await leaguePayout.connect(user2).stake(leagueWithFee, userId2, { value: ethers.parseEther("10.0") });

        const commissionPercentage = 1000; // 10% - Should fail
        const winners = [user2.address];
        const percentages = [10000];

        await expect(
            leaguePayout.payoutWinners(leagueWithFee, winners, percentages, commissionPercentage)
        ).to.be.revertedWith("Fee paid, no commission allowed");
    });

    it("given a league fee WAS paid and 0 commission is requested: it should succeed", async function () {
        const leagueWithFee = "league_fee_ok";
        await leaguePayout.connect(user1).createLeague(leagueWithFee, userId1, 500, { value: ethers.parseEther("1.0") });
        await leaguePayout.connect(user2).stake(leagueWithFee, userId2, { value: ethers.parseEther("10.0") });

        const commissionPercentage = 0; // 0% - Should pass
        const winners = [user2.address];
        const percentages = [10000];

        await expect(
             leaguePayout.payoutWinners(leagueWithFee, winners, percentages, commissionPercentage)
        ).to.not.be.reverted;
    });

    it("given a creator is a winner: it should allow them to receive payout", async function () {
        const winners = [user1.address]; // Creator
        const percentages = [10000]; 
        
        await expect(
            leaguePayout.payoutWinners(leagueId, winners, percentages, 0)
        ).to.emit(leaguePayout, "Payout").withArgs(leagueId, user1.address, ethers.parseEther("10.0"));
    });
  });
  
  describe("Withdrawal", function () {
      it("given funds are sent directly: it should allow owner to withdraw", async function () {
          // Send direct funds to contract (via receive)
          await user1.sendTransaction({
              to: await leaguePayout.getAddress(),
              value: ethers.parseEther("1.0")
          });
          
          const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
          
          await leaguePayout.withdraw(ethers.parseEther("1.0"));
          
          // Owner balance should increase (minus gas)
           expect(await ethers.provider.getBalance(owner.address)).to.be.gt(initialOwnerBalance);
      });
      
      it("given a non-owner tries to withdraw: it should revert", async function () {
          await expect(
              leaguePayout.connect(user1).withdraw(ethers.parseEther("1.0"))
          ).to.be.revertedWith("Only owner can withdraw");
      });
  });
});
