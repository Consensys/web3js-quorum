const Web3 = require("web3");
const Web3Quorum = require("../../src");
const EventEmitterAbi = require("../solidity/EventEmitter/EventEmitter.json")
  .output.abi;

const { enclave, network } = require("../keys.js");

const storeValueFromNode1 = (address, value, privacyGroupId) => {
  const web3 = new Web3Quorum(new Web3(network.node1.url));
  const contract = new web3.eth.Contract(EventEmitterAbi);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "store";
  });
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);

  const functionCall = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateFrom: enclave.node1.publicKey,
    privacyGroupId,
    privateKey: network.node1.privateKey,
  };
  return web3.priv
    .generateAndSendRawTransaction(functionCall)
    .then((transactionHash) => {
      console.log("Transaction Hash:", transactionHash);
      return web3.priv.waitForTransactionReceipt(transactionHash);
    })
    .then((result) => {
      console.log("Event Emitted:", result.logs[0].data);
      return result;
    });
};

const getValue = (url, address, privacyGroupId) => {
  const web3 = new Web3Quorum(new Web3(url));
  const contract = new web3.eth.Contract(EventEmitterAbi);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "value";
  });

  return web3.priv
    .call(privacyGroupId, { to: address, data: functionAbi.signature })
    .then((result) => {
      console.log(`Get Value from ${url}:`, result);
      return result;
    });
};

const getValueFromNode1 = (address, privacyGroupId) => {
  return getValue(network.node1.url, address, privacyGroupId);
};

const getValueFromNode2 = (address, privacyGroupId) => {
  return getValue(network.node2.url, address, privacyGroupId);
};

const getValueFromNode3 = (address, privacyGroupId) => {
  return getValue(network.node3.url, address, privacyGroupId);
};

module.exports = {
  storeValueFromNode1,
  getValueFromNode1,
  getValueFromNode2,
  getValueFromNode3,
};

if (require.main === module) {
  if (!process.env.CONTRACT_ADDRESS) {
    throw Error(
      "You need to export the following variable in your shell environment: CONTRACT_ADDRESS="
    );
  }

  if (!process.env.PRIVACY_GROUP_ID) {
    throw Error(
      "You need to export the following variable in your shell environment: PRIVACY_GROUP_ID="
    );
  }

  const address = process.env.CONTRACT_ADDRESS;
  const privacyGroupId = process.env.PRIVACY_GROUP_ID;
  storeValueFromNode1(address, 1000, privacyGroupId)
    .then(() => {
      return getValueFromNode1(address, privacyGroupId);
    })
    .then(() => {
      return getValueFromNode2(address, privacyGroupId);
    })
    .then(() => {
      return getValueFromNode3(address, privacyGroupId);
    })
    .catch(console.log);
}
