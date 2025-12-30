import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    amoy: {
        url: "https://rpc-amoy.polygon.technology",
        accounts: [PRIVATE_KEY]
    },
    polygon: {
        url: "https://polygon-rpc.com",
        accounts: [PRIVATE_KEY]
    }
  }
};

export default config;
