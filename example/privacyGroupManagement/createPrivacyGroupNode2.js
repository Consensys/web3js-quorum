const Web3 = require("web3");
const Web3Quorum = require("../../src");
const { enclave, network } = require("../keys.js");

const web3 = new Web3Quorum(new Web3(network.node2.url));

const createPrivacyGroupForNode23 = () => {
  const contractOptions = {
    addresses: [enclave.node2.publicKey, enclave.node3.publicKey],
    name: "web3js-quorum",
    description: "test",
  };
  return web3.priv.createPrivacyGroup(contractOptions).then((result) => {
    console.log(`The privacy group created is:`, result);
    return result;
  });
};

module.exports = {
  createPrivacyGroupForNode23,
};

if (require.main === module) {
  createPrivacyGroupForNode23();
}
