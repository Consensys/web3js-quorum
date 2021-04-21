const Web3 = require("web3");
const Web3Quorum = require("../../src");
const { orion, network } = require("../keys.js");
const { createHttpProvider } = require("../helpers.js");

const web3 = new Web3Quorum(
  new Web3(createHttpProvider(orion.node1.jwt, network.node1.url))
);

const createPrivacyGroup = () => {
  const contractOptions = {
    addresses: [orion.node1.publicKey, orion.node12.publicKey],
    name: "web3js-quorum",
    description: "test",
  };
  return web3.priv.createPrivacyGroup(contractOptions).then((result) => {
    console.log(`The privacy group created is:`, result);
    return result;
  });
};

const createPrivacyGroupForNode123 = () => {
  const contractOptions = {
    addresses: [
      orion.node1.publicKey,
      orion.node11.publicKey,
      orion.node12.publicKey,
    ],
    name: "web3js-quorum",
    description: "test",
  };
  return web3.priv.createPrivacyGroup(contractOptions).then((result) => {
    console.log(`The privacy group created is:`, result);
    return result;
  });
};

module.exports = {
  createPrivacyGroup,
  createPrivacyGroupForNode123,
};

if (require.main === module) {
  createPrivacyGroup();
}
