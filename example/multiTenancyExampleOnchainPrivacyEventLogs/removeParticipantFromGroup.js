const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { network, enclave } = require("../keys");
const { logMatchingGroup, createHttpProvider } = require("../helpers.js");

const node = new Web3Quorum(
  new Web3(createHttpProvider(enclave.node1.jwt, network.node1.url))
);
const params = JSON.parse(fs.readFileSync(path.join(__dirname, "params.json")));

async function run() {
  const { privacyGroupId } = params;
  const addressToRemove = enclave.node11.publicKey;

  const findResultWithAddedNode = await node.eth.flexiblePrivacyGroup.find([
    enclave.node1.publicKey,
    enclave.node2.publicKey,
    enclave.node11.publicKey,
  ]);
  console.log("Found privacy groups with added node:");
  logMatchingGroup(findResultWithAddedNode, privacyGroupId);

  const removeResult = await node.eth.flexiblePrivacyGroup.removeFrom({
    participant: addressToRemove,
    enclaveKey: enclave.node1.publicKey,
    privateFrom: enclave.node1.publicKey,
    privacyGroupId,
    privateKey: network.node1.privateKey,
  });
  console.log(removeResult);
  console.log(
    `Removed third participant ${addressToRemove} from privacy group ${privacyGroupId}`
  );

  const findResultWithRemovedNode = await node.eth.flexiblePrivacyGroup.find([
    enclave.node1.publicKey,
    enclave.node2.publicKey,
  ]);
  console.log("Found privacy groups with removed node:");
  logMatchingGroup(findResultWithRemovedNode, privacyGroupId);
}

run();
