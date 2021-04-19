const Web3 = require("web3");
const fs = require("fs");
const path = require("path");
const Web3Quorum = require("../../src");

const { network, orion } = require("../keys");
const { createHttpProvider } = require("../helpers.js");

const bytecode = fs.readFileSync(
  path.join(__dirname, "../solidity/EventEmitter/EventEmitter.bin")
);

const node = new Web3Quorum(
  new Web3(createHttpProvider(orion.node1.jwt, network.node1.url))
);

async function run() {
  const enclaveKey = orion.node1.publicKey;
  const addresses = [
    orion.node1.publicKey,
    orion.node11.publicKey,
    orion.node2.publicKey,
  ];

  // create privacy group
  const onChainPrivacyGroupCreationResult = await node.privx.createPrivacyGroup(
    {
      participants: addresses,
      enclaveKey: orion.node1.publicKey,
      privateFrom: orion.node1.publicKey,
      privateKey: network.node1.privateKey,
    }
  );
  console.log("Creation result");
  console.log(onChainPrivacyGroupCreationResult);

  await node.priv.getTransactionReceipt(
    onChainPrivacyGroupCreationResult.commitmentHash,
    orion.node1.publicKey
  );

  const { privacyGroupId } = onChainPrivacyGroupCreationResult;

  console.log("Created privacy group", privacyGroupId);
  console.log(`with members ${addresses}`);

  // deploy contract
  const deployReceipt = await node.eea
    .sendRawTransaction({
      data: `0x${bytecode}`,
      privateFrom: enclaveKey,
      privacyGroupId,
      privateKey: network.node1.privateKey,
    })
    .then((hash) => {
      return node.priv.getTransactionReceipt(hash, enclaveKey);
    });

  const { contractAddress, blockNumber } = deployReceipt;
  console.log("Deployed contract at address ", contractAddress);

  // save to file
  const params = {
    privacyGroupId,
    contractAddress,
    blockNumber,
  };

  fs.writeFileSync(path.join(__dirname, "params.json"), JSON.stringify(params));

  console.log(params);
}

run();
