const Web3 = require("web3");
const Web3Quorum = require("../../src");
const { enclave, network } = require("../keys.js");

const web3 = new Web3Quorum(new Web3(network.node2.url));

const findPrivacyGroupForNode23 = () => {
  return web3.priv
    .findPrivacyGroup([enclave.node2.publicKey, enclave.node3.publicKey])
    .then((result) => {
      console.log(`The privacy groups found are:`, result);
      return result;
    });
};

module.exports = {
  findPrivacyGroupForNode23,
};

if (require.main === module) {
  findPrivacyGroupForNode23();
}
