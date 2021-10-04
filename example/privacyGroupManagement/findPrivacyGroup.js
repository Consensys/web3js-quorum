const Web3 = require("web3");
const Web3Quorum = require("../../src");
const { enclave, network } = require("../keys.js");

const web3 = new Web3Quorum(new Web3(network.node1.url));

const findPrivacyGroup = () => {
  return web3.priv
    .findPrivacyGroup([enclave.node1.publicKey, enclave.node2.publicKey])
    .then((result) => {
      console.log(`The privacy groups found are:`, result);
      return result;
    });
};

const findPrivacyGroupForNode123 = () => {
  return web3.priv
    .findPrivacyGroup([
      enclave.node1.publicKey,
      enclave.node2.publicKey,
      enclave.node3.publicKey,
    ])
    .then((result) => {
      console.log(`The privacy groups found are:`, result);
      return result;
    });
};

const findPrivacyGroupForNode23 = () => {
  return web3.priv
    .findPrivacyGroup([enclave.node2.publicKey, enclave.node3.publicKey])
    .then((result) => {
      console.log(`The privacy groups found are:`, result);
      return result;
    });
};

module.exports = {
  findPrivacyGroup,
  findPrivacyGroupForNode123,
  findPrivacyGroupForNode23,
};

if (require.main === module) {
  findPrivacyGroup();
}
