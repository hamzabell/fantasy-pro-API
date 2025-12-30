import { expect } from "chai";
import { ethers } from "hardhat";
import { LeaguePayout } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LeaguePayout", function () {
  let leaguePayout: LeaguePayout;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const LeaguePayout = await ethers.getContractFactory("LeaguePayout");
    leaguePayout = await LeaguePayout.deploy();
    await leaguePayout.waitForDeployment(); // Updated for newer ethers/hardhat syntax
  });

  it("Should accept deposits", async function () {
    const depositAmount = ethers.parseEther("1.0");
    await owner.sendTransaction({
      to: await leaguePayout.getAddress(),
      value: depositAmount,
    });
    
    expect(await ethers.provider.getBalance(await leaguePayout.getAddress())).to.equal(depositAmount);
  });

  it("Should payout winners", async function () {
    const depositAmount = ethers.parseEther("1.0");
    await owner.sendTransaction({
        to: await leaguePayout.getAddress(),
        value: depositAmount,
      });

    const winners = [addr1.address, addr2.address];
    const amounts = [ethers.parseEther("0.5"), ethers.parseEther("0.5")];

    await expect(leaguePayout.payoutWinners("league1", winners, amounts))
      .to.emit(leaguePayout, "Payout")
      .withArgs("league1", addr1.address, ethers.parseEther("0.5"));

    expect(await ethers.provider.getBalance(addr1.address)).to.changeEther(ethers.parseEther("0.5")); // Pseudocode matcher
  });

  it("Should fail if caller is not owner", async function () {
    const winners = [addr1.address];
    const amounts = [ethers.parseEther("0.1")];
    await expect(
      leaguePayout.connect(addr1).payoutWinners("league1", winners, amounts)
    ).to.be.revertedWith("Only owner can payout");
  });
});
