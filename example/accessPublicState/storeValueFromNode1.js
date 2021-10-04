const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const Web3Quorum = require("../../src");
const EventEmitter = require("../solidity/EventEmitter/EventEmitter.json")
  .output.abi;
const CrossContractReader = require("../solidity/CrossContractReader/CrossContractReader.json")
  .output.abi;

const { enclave, network } = require("../keys.js");

const storeValueFromNode1 = (address, value) => {
  const web3 = new Web3Quorum(new Web3(network.node1.url));
  const contract = new web3.eth.Contract(EventEmitter);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "store";
  });
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);

  const besuAccount = web3.eth.accounts.privateKeyToAccount(
    `0x${network.node1.privateKey}`
  );
  return web3.eth
    .getTransactionCount(besuAccount.address, "pending")
    .then((count) => {
      const rawTx = {
        nonce: web3.utils.numberToHex(count),
        from: besuAccount.address,
        value: 0,
        to: address,
        data: `${functionAbi.signature + functionArgs}`,
        gasPrice: "0xFFFFFF",
        gasLimit: "0xFFFFFFF",
      };
      const tx = new Tx(rawTx, {
        chain: "mainnet",
        hardfork: "homestead",
      });
      tx.sign(Buffer.from(network.node1.privateKey, "hex"));
      const serializedTx = tx.serialize();
      return web3.eth.sendSignedTransaction(
        `0x${serializedTx.toString("hex")}`
      );
    })
    .then((transactionReceipt) => {
      console.log("Public Transaction Receipt\n", transactionReceipt);
      return transactionReceipt.transactionHash;
    });
};

const getValue = (
  url,
  publicAddress,
  privateAddress,
  privateFrom,
  privateFor,
  privateKey
) => {
  const web3 = new Web3Quorum(new Web3(url));

  const contract = new web3.eth.Contract(CrossContractReader);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "read";
  });

  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [publicAddress])
    .slice(2);

  const functionCall = {
    to: privateAddress,
    data: functionAbi.signature + functionArgs,
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

const getValueFromNode1 = (publicAddress, privateAddress) => {
  return getValue(
    network.node1.url,
    publicAddress,
    privateAddress,
    enclave.node1.publicKey,
    [enclave.node2.publicKey],
    network.node1.privateKey
  );
};

module.exports = {
  storeValueFromNode1,
  getValueFromNode1,
};

if (require.main === module) {
  if (!process.env.PUBLIC_CONTRACT_ADDRESS) {
    throw Error(
      "You need to export the following variable in your shell environment: PUBLIC_CONTRACT_ADDRESS="
    );
  }

  if (!process.env.PRIVATE_CONTRACT_ADDRESS) {
    throw Error(
      "You need to export the following variable in your shell environment: PRIVATE_CONTRACT_ADDRESS="
    );
  }

  const publicAddress = process.env.PUBLIC_CONTRACT_ADDRESS;
  const privateAddress = process.env.PRIVATE_CONTRACT_ADDRESS;
  storeValueFromNode1(publicAddress, 1000)
    .then(() => {
      return getValueFromNode1(publicAddress, privateAddress);
    })
    .catch(console.log);
}
