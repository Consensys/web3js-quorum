const Web3 = require("web3");
const Web3Quorum = require("../../../src");
const { address } = require("./quorumConfig");

const fromPublicKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
const toPublicKey = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";

const ipcPath = process.env.IPC_PATH;
const web3 = new Web3Quorum(
  new Web3(address),
  {
    ipcPath,
    privateUrl: "http://localhost:9081",
  },
  true
);

module.exports = {
  web3,
  fromPublicKey,
  toPublicKey,
};
