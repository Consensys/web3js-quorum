const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const Web3Quorum = require("../../src");

const createGroup = require("../privacyGroupManagement/createPrivacyGroup");

const { enclave, network } = require("../keys.js");

const binary = fs.readFileSync(
  path.join(__dirname, "../solidity/EventEmitter/EventEmitter.bin")
);

const web3 = new Web3Quorum(new Web3(network.node1.url));

const createGroupId = () => {
  return createGroup.createPrivacyGroup();
};

const createPrivateEmitterContract = (privacyGroupId) => {
  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: enclave.node1.publicKey,
    privacyGroupId,
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

module.exports = async () => {
  const privacyGroupId = await createGroupId();
  const contractAddress = await createPrivateEmitterContract(
    privacyGroupId
  ).then(getPrivateContractAddress);
  console.log(
    `now you have to run:\n export CONTRACT_ADDRESS=${contractAddress}`
  );
  console.log(` export PRIVACY_GROUP_ID=${privacyGroupId}`);
  return { contractAddress, privacyGroupId };
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.log(error);
    console.log(
      "\nThis example requires ONCHAIN privacy to be DISABLED. \nCheck config for ONCHAIN privacy groups."
    );
  });
}
