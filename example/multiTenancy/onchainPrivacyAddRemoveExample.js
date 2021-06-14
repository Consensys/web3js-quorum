const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { orion, network } = require("../keys.js");
const { logMatchingGroup, createHttpProvider } = require("../helpers.js");

const node1 = new Web3Quorum(
  new Web3(createHttpProvider(orion.node1.jwt, network.node1.url))
);
const node2 = new Web3Quorum(
  new Web3(createHttpProvider(orion.node2.jwt, network.node2.url))
);
// in this example node3 is a second tenant on besu/orion node1 with orion key orion11
const node3 = new Web3Quorum(
  new Web3(createHttpProvider(orion.node11.jwt, network.node1.url))
);

module.exports = async () => {
  const onChainPrivacyGroupCreationResult = await node1.eth.flexiblePrivacyGroup.create(
    {
      participants: [orion.node1.publicKey, orion.node2.publicKey],
      enclaveKey: orion.node1.publicKey,
      privateFrom: orion.node1.publicKey,
      privateKey: network.node1.privateKey,
    }
  );
  console.log("Created new on-chain privacy group:");
  console.log(onChainPrivacyGroupCreationResult);

  const findResult = await node2.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup(
    [orion.node1.publicKey, orion.node2.publicKey]
  );
  console.log("Found privacy group results:");
  logMatchingGroup(
    findResult,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );

  const addResult = await node1.eth.flexiblePrivacyGroup.addTo({
    participants: [orion.node11.publicKey],
    enclaveKey: orion.node1.publicKey,
    privateFrom: orion.node1.publicKey,
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

  const findResultWithAddedNode = await node2.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup(
    [orion.node1.publicKey, orion.node2.publicKey, orion.node11.publicKey]
  );
  console.log("Found privacy groups with added node:");
  logMatchingGroup(
    findResultWithAddedNode,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );

  const removeResult = await node1.eth.flexiblePrivacyGroup.removeFrom({
    participant: orion.node11.publicKey,
    enclaveKey: orion.node1.publicKey,
    privateFrom: orion.node1.publicKey,
    privacyGroupId: onChainPrivacyGroupCreationResult.privacyGroupId,
    privateKey: network.node1.privateKey,
  });
  console.log("Removed third participant from privacy group:");
  console.log(removeResult);

  const findResultRemovedNode = await node2.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup(
    [orion.node1.publicKey, orion.node2.publicKey]
  );
  logMatchingGroup(
    findResultRemovedNode,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );
};

if (require.main === module) {
  module.exports();
}
