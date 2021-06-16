const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const Web3Quorum = require("../src");
const contractMeta = require("../solidity/HumanStandardToken/HumanStandardToken.json")
  .contracts["HumanStandardToken.sol:HumanStandardToken"];

const HumanStandardTokenAbi = JSON.parse(contractMeta.interface);

const ethUtil = require("../src/util/custom-ethjs-util");
const { orion, network } = require("./keys.js");

const binary = fs.readFileSync(
  path.join(__dirname, "./solidity/EventEmitter/EventEmitter.bin")
);

const web3 = new Web3Quorum(new Web3(network.node1.url));

const contract = new web3.eth.Contract(HumanStandardTokenAbi);

// create HumanStandardToken constructor
const constructorAbi = contract._jsonInterface.find((e) => {
  return e.type === "constructor";
});
const constructorArgs = web3.eth.abi
  .encodeParameters(constructorAbi.inputs, [
    1000000,
    "PegaSys Token",
    10,
    "PegaSys",
  ])
  .slice(2);

const contractOptions = {
  data: `0x${binary}${constructorArgs}`,
  privateFrom: orion.node1.publicKey,
  privateFor: [orion.node1.publicKey],
  privateKey: network.node1.privateKey,
};

web3.priv
  .generateAndSendRawTransaction(contractOptions)
  .then((hash) => {
    console.log(`Transaction Hash ${hash}`);
    return web3.priv.waitForTransactionReceipt(hash);
  })
  .then((privateTransactionReceipt) => {
    console.log("Private Transaction Receipt");
    console.log(privateTransactionReceipt);
    return privateTransactionReceipt.contractAddress;
  })
  .then((contractAddress) => {
    // const contract = web3.eth.Contract(HumandStandartTokenAbi, contractAddress);
    // contract.methods.transfer(["to", "value"]).send(??)

    // already 0x prefixed
    const functionAbi = contract._jsonInterface.find((element) => {
      return element.name === "transfer";
    });
    const transferTo = `0x${ethUtil
      .privateToAddress(Buffer.from(network.node2.privateKey, "hex"))
      .toString("hex")}`;
    const functionArgs = web3.eth.abi
      .encodeParameters(functionAbi.inputs, [transferTo, 1])
      .slice(2);

    return web3.priv.generateAndSendRawTransaction({
      to: contractAddress,
      data: functionAbi.signature + functionArgs,
      privateFrom: orion.node1.publicKey,
      privateFor: [orion.node2.publicKey],
      privateKey: network.node1.privateKey,
    });
  })
  .then((transactionHash) => {
    console.log(`Transaction Hash ${transactionHash}`);
    return web3.priv.waitForTransactionReceipt(transactionHash);
  })
  .then((privateTransactionReceipt) => {
    console.log("Private Transaction Receipt");
    console.log(privateTransactionReceipt);
    if (privateTransactionReceipt.logs.length > 0) {
      console.log("Log 0");
      console.log(privateTransactionReceipt.logs[0]);
    }
    return privateTransactionReceipt;
  })
  .catch((e) => {
    console.log(e);
  });
