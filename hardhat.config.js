require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

const YOUR_PRIVATE_KEY = "ADMIN-1 PVT KEY";
// For testing purpose
// const YOUR_PRIVATE_KEY = "ADMIN-2 PVT KEY";

module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [`0x${YOUR_PRIVATE_KEY}`],
    },
  },
};
