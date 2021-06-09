const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { orion, network } = require("../keys.js");
const { createHttpProvider } = require("../helpers.js");

const binary = fs.readFileSync(
  path.join(__dirname, "../solidity/EventEmitter/EventEmitter.bin")
);

const node1 = new Web3Quorum(
  new Web3(createHttpProvider(orion.node1.jwt, network.node1.url))
);

const createEventEmitterContract = (privacyGroupId) => {
  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: orion.node1.publicKey,
    privacyGroupId,
    privateKey: network.node1.privateKey,
  };
  return node1.priv.generateAndSendRawTransaction(contractOptions);
};

const getPrivateContractAddress = (transactionHash) => {
  return node1.priv
    .waitForTransactionReceipt(transactionHash)
    .then((privateTransactionReceipt) => {
      return privateTransactionReceipt.contractAddress;
    });
};

module.exports = async () => {
  const privacyGroupCreationResult = await node1.eth.flexiblePrivacyGroup.create(
    {
      participants: [orion.node1.publicKey, orion.node2.publicKey],
      enclaveKey: orion.node1.publicKey,
      privateFrom: orion.node1.publicKey,
      privateKey: network.node1.privateKey,
    }
  );

  console.log("Created privacy group");
  console.log(privacyGroupCreationResult);

  const contractAddress = await createEventEmitterContract(
    privacyGroupCreationResult.privacyGroupId
  ).then((res) => {
    return getPrivateContractAddress(res);
  });
  console.log(
    `now you have to run:\n export CONTRACT_ADDRESS=${contractAddress}`
  );
  console.log(
    ` export PRIVACY_GROUP_ID=${privacyGroupCreationResult.privacyGroupId}`
  );
};

if (require.main === module) {
  module.exports();
}
