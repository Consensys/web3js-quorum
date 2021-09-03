const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { enclave, network } = require("../keys.js");

const binary = fs.readFileSync(
  path.join(__dirname, "../solidity/EventEmitter/EventEmitter.bin")
);

const web3 = new Web3Quorum(new Web3(network.node1.url));

const createPrivateEmitterContract = () => {
  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: enclave.node1.publicKey,
    privateFor: [enclave.node2.publicKey],
    privateKey: network.node1.privateKey,
  };
  return web3.priv.generateAndSendRawTransaction(contractOptions);
};

const getPrivateContractAddress = (transactionHash) => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv
    .waitForTransactionReceipt(transactionHash)
    .then((privateTransactionReceipt) => {
      console.log("Private Transaction Receipt\n", privateTransactionReceipt);
      console.log(
        `now you have to run:\n export CONTRACT_ADDRESS=${privateTransactionReceipt.contractAddress}\n`
      );
      return privateTransactionReceipt.contractAddress;
    });
};

module.exports = () => {
  return createPrivateEmitterContract()
    .then(getPrivateContractAddress)
    .catch((error) => {
      console.log(error);
      console.log(
        "\nThis example requires ONCHAIN privacy to be DISABLED. \nCheck config for ONCHAIN privacy groups."
      );
    });
};

if (require.main === module) {
  module.exports();
}
