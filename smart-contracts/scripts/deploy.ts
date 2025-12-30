import { ethers } from "hardhat";

async function main() {
  const LeaguePayout = await ethers.getContractFactory("LeaguePayout");
  console.log("Deploying LeaguePayout...");
  
  const leaguePayout = await LeaguePayout.deploy();
  await leaguePayout.waitForDeployment();

  console.log(`LeaguePayout deployed to: ${await leaguePayout.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
