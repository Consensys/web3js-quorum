const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const Web3Quorum = require("../src");
const EventEmitterAbi = require("./solidity/EventEmitter/EventEmitter.json")
  .output.abi;

const { enclave, network } = require("./keys.js");

const binary = fs.readFileSync(
  path.join(__dirname, "./solidity/EventEmitter/EventEmitter.bin")
);

const web3 = new Web3Quorum(new Web3(network.node1.url));
// eslint-disable-next-line no-new
new web3.eth.Contract(EventEmitterAbi);

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
      return privateTransactionReceipt.contractAddress;
    });
};

const storeValue = (contractAddress, value) => {
  const functionAbi = EventEmitterAbi.find((e) => {
    return e.name === "store";
  });
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateFrom: enclave.node1.publicKey,
    privateFor: [enclave.node2.publicKey],
    privateKey: network.node1.privateKey,
  };
  return web3.priv.generateAndSendRawTransaction(functionCall);
};

const getValue = (contractAddress) => {
  const functionAbi = EventEmitterAbi.find((e) => {
    return e.name === "value";
  });

  const functionCall = {
    to: contractAddress,
    data: functionAbi.signature,
    privateFrom: enclave.node1.publicKey,
    privateFor: [enclave.node2.publicKey],
    privateKey: network.node1.privateKey,
  };

  return web3.priv
    .generateAndSendRawTransaction(functionCall)
    .then((transactionHash) => {
      return web3.priv.waitForTransactionReceipt(transactionHash);
    })
    .then((result) => {
      console.log("Get Value:", result.output);
      return result.output;
    });
};

const getPrivateTransactionReceipt = (transactionHash) => {
  return web3.priv.waitForTransactionReceipt(transactionHash).then((result) => {
    console.log("Transaction Hash:", transactionHash);
    console.log("Event Emitted:", result.logs[0].data);
    return result;
  });
};

createPrivateEmitterContract()
  .then(getPrivateContractAddress)
  .then((contractAddress) => {
    // eslint-disable-next-line promise/no-nesting
    return storeValue(contractAddress, 1000)
      .then((transactionHash) => {
        return getPrivateTransactionReceipt(transactionHash);
      })
      .then(() => {
        return getValue(contractAddress);
      })
      .then(() => {
        return storeValue(contractAddress, 42);
      })
      .then((transactionHash) => {
        return getPrivateTransactionReceipt(transactionHash);
      })
      .then(() => {
        return getValue(contractAddress);
      });
  })
  .catch(console.log);
