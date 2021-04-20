const Web3 = require("web3");
const Web3Quorum = require("../../src");
const { network } = require("../keys.js");

const web3 = new Web3Quorum(new Web3(network.node1.url));

const deletePrivacyGroup = (givenPrivacyGroupId) => {
  return web3.priv.deletePrivacyGroup(givenPrivacyGroupId).then((result) => {
    console.log(`The privacy group deleted is:`, result);
    return result;
  });
};

module.exports = {
  deletePrivacyGroup,
};

if (require.main === module) {
  if (!process.env.PRIVACY_GROUP_TO_DELETE) {
    throw Error(
      "You need to export the following variable in your shell environment: PRIVACY_GROUP_TO_DELETE="
    );
  }

  const privacyGroupId = process.env.PRIVACY_GROUP_TO_DELETE;
  deletePrivacyGroup(privacyGroupId).catch((error) => {
    console.log(error);
    console.log(
      `\nAttempted to delete PRIVACY_GROUP_TO_DELETE=${privacyGroupId}`
    );
    console.log("You may need to update PRIVACY_GROUP_TO_DELETE");
  });
}
