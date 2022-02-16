const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { enclave, network } = require("../keys.js");
const { logMatchingGroup, createHttpProvider } = require("../helpers.js");

const node1 = new Web3Quorum(
  new Web3(createHttpProvider(enclave.node1.jwt, network.node1.url))
);
const node2 = new Web3Quorum(
  new Web3(createHttpProvider(enclave.node2.jwt, network.node2.url))
);
// in this example node3 is a second tenant on besu/enclave node1 with enclave key enclave11
const node3 = new Web3Quorum(
  new Web3(createHttpProvider(enclave.node11.jwt, network.node1.url))
);

module.exports = async () => {
  const onChainPrivacyGroupCreationResult = await node1.eth.flexiblePrivacyGroup.create(
    {
      participants: [enclave.node1.publicKey, enclave.node2.publicKey],
      enclaveKey: enclave.node1.publicKey,
      privateFrom: enclave.node1.publicKey,
      privateKey: network.node1.privateKey,
    }
  );
  console.log("Created new on-chain privacy group:");
  console.log(onChainPrivacyGroupCreationResult);

  const findResult = await node2.eth.flexiblePrivacyGroup.find([
    enclave.node1.publicKey,
    enclave.node2.publicKey,
  ]);
  console.log("Found privacy group results:");
  logMatchingGroup(
    findResult,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );

  const addResult = await node1.eth.flexiblePrivacyGroup.addTo({
    participants: [enclave.node11.publicKey],
    enclaveKey: enclave.node1.publicKey,
    privateFrom: enclave.node1.publicKey,
    privacyGroupId: onChainPrivacyGroupCreationResult.privacyGroupId,
    privateKey: network.node1.privateKey,
  });
  console.log("Added new node to privacy group:");
  console.log(addResult);

  const receiptFromNode3 = await node3.priv.waitForTransactionReceipt(
    addResult.commitmentHash
  );
  console.log("Got transaction receipt from added node:");
  console.log(receiptFromNode3);

  const findResultWithAddedNode = await node2.eth.flexiblePrivacyGroup.find([
    enclave.node1.publicKey,
    enclave.node2.publicKey,
    enclave.node11.publicKey,
  ]);
  console.log("Found privacy groups with added node:");
  logMatchingGroup(
    findResultWithAddedNode,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );

  const removeResult = await node1.eth.flexiblePrivacyGroup.removeFrom({
    participant: enclave.node11.publicKey,
    enclaveKey: enclave.node1.publicKey,
    privateFrom: enclave.node1.publicKey,
    privacyGroupId: onChainPrivacyGroupCreationResult.privacyGroupId,
    privateKey: network.node1.privateKey,
  });
  console.log("Removed third participant from privacy group:");
  console.log(removeResult);

  const findResultRemovedNode = await node2.eth.flexiblePrivacyGroup.find([
    enclave.node1.publicKey,
    enclave.node2.publicKey,
  ]);
  logMatchingGroup(
    findResultRemovedNode,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );
};

if (require.main === module) {
  module.exports();
}
