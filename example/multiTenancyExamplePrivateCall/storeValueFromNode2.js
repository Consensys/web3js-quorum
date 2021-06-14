const Web3 = require("web3");
const Web3Quorum = require("../../src");
const { createHttpProvider } = require("../helpers.js");
const EventEmitterAbi = require("../solidity/EventEmitter/EventEmitter.json")
  .output.abi;

const { orion, network } = require("../keys.js");

const storeValueFromNode2 = (address, value, privacyGroupId) => {
  const web3 = new Web3Quorum(
    new Web3(createHttpProvider(orion.node2.jwt, network.node2.url))
  );
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
    privateFrom: orion.node2.publicKey,
    privacyGroupId,
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

const getValue = (url, jwt, address, privacyGroupId) => {
  const web3 = new Web3Quorum(new Web3(createHttpProvider(jwt, url)));
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
  return getValue(network.node1.url, orion.node1.jwt, address, privacyGroupId);
};

const getValueFromNode2 = (address, privacyGroupId) => {
  return getValue(network.node2.url, orion.node2.jwt, address, privacyGroupId);
};

// in this example node3 is a second tenant on besu1 with orion key orion11
const getValueFromNode3 = (address, privacyGroupId) => {
  return getValue(network.node1.url, orion.node11.jwt, address, privacyGroupId);
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

  if (!process.env.PRIVACY_GROUP_ID) {
    throw Error(
      "You need to export the following variable in your shell environment: PRIVACY_GROUP_ID="
    );
  }

  const address = process.env.CONTRACT_ADDRESS;
  const privacyGroupId = process.env.PRIVACY_GROUP_ID;
  storeValueFromNode2(address, 1001, privacyGroupId)
    .then(() => {
      console.log("\n");
      return getValueFromNode1(address, privacyGroupId);
    })
    .then(() => {
      return getValueFromNode2(address, privacyGroupId);
    })
    .then(() => {
      console.log(
        "\nEXPECTING AN ERROR from node3 because they are not in the group\n"
      );
      return getValueFromNode3(address, privacyGroupId);
    })
    .catch(console.log);
}
