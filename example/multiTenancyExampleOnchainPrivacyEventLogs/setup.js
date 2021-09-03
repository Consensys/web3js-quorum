const Web3 = require("web3");
const fs = require("fs");
const path = require("path");
const Web3Quorum = require("../../src");

const { network, enclave } = require("../keys");
const { createHttpProvider } = require("../helpers.js");

const bytecode = fs.readFileSync(
  path.join(__dirname, "../solidity/EventEmitter/EventEmitter.bin")
);

const node = new Web3Quorum(
  new Web3(createHttpProvider(enclave.node1.jwt, network.node1.url))
);

async function run() {
  const enclaveKey = enclave.node1.publicKey;
  const addresses = [
    enclave.node1.publicKey,
    enclave.node11.publicKey,
    enclave.node2.publicKey,
  ];

  // create privacy group
  const onChainPrivacyGroupCreationResult = await node.eth.flexiblePrivacyGroup.create(
    {
      participants: addresses,
      enclaveKey: enclave.node1.publicKey,
      privateFrom: enclave.node1.publicKey,
      privateKey: network.node1.privateKey,
    }
  );
  console.log("Creation result");
  console.log(onChainPrivacyGroupCreationResult);

  await node.priv.waitForTransactionReceipt(
    onChainPrivacyGroupCreationResult.commitmentHash
  );

  const { privacyGroupId } = onChainPrivacyGroupCreationResult;

  console.log("Created privacy group", privacyGroupId);
  console.log(`with members ${addresses}`);

  // deploy contract
  const deployReceipt = await node.priv
    .generateAndSendRawTransaction({
      data: `0x${bytecode}`,
      privateFrom: enclaveKey,
      privacyGroupId,
      privateKey: network.node1.privateKey,
    })
    .then((hash) => {
      return node.priv.waitForTransactionReceipt(hash);
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
