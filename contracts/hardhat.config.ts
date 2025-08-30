import * as dotenv from "dotenv";
dotenv.config()

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 600,
      },
    viaIR: true
    },
  },

  networks: {
    sepolia: {
      url: `${process.env.SEPOLIA_RPC_URL}`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    },
     localhost: {
      url: "http://127.0.0.1:8545", 
    },

  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};

export default config;
