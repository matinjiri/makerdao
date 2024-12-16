import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomiclabs/hardhat-web3";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.12",
      },
      {
        version: "0.6.12",
      },
    ],
  },
};

export default config;
