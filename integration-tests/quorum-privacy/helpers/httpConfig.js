const Web3 = require("web3");
const Web3Quorum = require("../../../src");
const RawTransactionManager = require("../../../lib/rawTransactionManager");
const { address } = require("./quorumConfig");

const fromPublicKey = "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
const toPublicKey = "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";

const enclaveOptions = {
  ipcPath: null,
  privateUrl: "http://localhost:9081",
};
const web3 = new Web3Quorum(new Web3(address), enclaveOptions);
const rawTransactionManager = RawTransactionManager(web3, enclaveOptions);

module.exports = {
  web3,
  fromPublicKey,
  toPublicKey,
  rawTransactionManager,
};
