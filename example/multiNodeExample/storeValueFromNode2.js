const Web3 = require("web3");
const Web3Quorum = require("../../src");
const EventEmitterAbi = require("../solidity/EventEmitter/EventEmitter.json")
  .output.abi;

const { enclave, network } = require("../keys.js");

const storeValueFromNode2 = (address, value) => {
  const web3 = new Web3Quorum(new Web3(network.node2.url));
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
    privateFrom: enclave.node2.publicKey,
    privateFor: [enclave.node1.publicKey],
    privateKey: network.node2.privateKey,
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

const getValue = (url, address, privateFrom, privateFor, privateKey) => {
  const web3 = new Web3Quorum(new Web3(url));
  const contract = new web3.eth.Contract(EventEmitterAbi);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "value";
  });

  const functionCall = {
    to: address,
    data: functionAbi.signature,
    privateFrom,
    privateFor,
    privateKey,
  };

  return web3.priv
    .generateAndSendRawTransaction(functionCall)
    .then((transactionHash) => {
      return web3.priv.waitForTransactionReceipt(transactionHash);
    })
    .then((result) => {
      console.log(`Get Value from ${url}:`, result.output);
      return result;
    });
};

const getValueFromNode1 = (address) => {
  return getValue(
    network.node1.url,
    address,
    enclave.node1.publicKey,
    [enclave.node2.publicKey],
    network.node1.privateKey
  );
};

const getValueFromNode2 = (address) => {
  return getValue(
    network.node2.url,
    address,
    enclave.node2.publicKey,
    [enclave.node1.publicKey],
    network.node2.privateKey
  );
};

const getValueFromNode3 = (address) => {
  return getValue(
    network.node3.url,
    address,
    enclave.node3.publicKey,
    [enclave.node1.publicKey],
    network.node3.privateKey
  );
};

module.exports = {
  storeValueFromNode2,
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

  const address = process.env.CONTRACT_ADDRESS;
  storeValueFromNode2(address, 42)
    .then(() => {
      return getValueFromNode1(address);
    })
    .then(() => {
      return getValueFromNode2(address);
    })
    .then(() => {
      return getValueFromNode3(address);
    })
    .catch(console.log);
}
