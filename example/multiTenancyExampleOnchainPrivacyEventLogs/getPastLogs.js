const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { network, orion } = require("../keys");
const { createHttpProvider } = require("../helpers.js");

// use an orion key that is not a member of the group (eg orion.node11.jwt)
// to demonstrate that they can't get the logs
const node = new Web3Quorum(
  new Web3(createHttpProvider(orion.node1.jwt, network.node1.url))
);
const params = JSON.parse(fs.readFileSync(path.join(__dirname, "params.json")));

function run() {
  const { privacyGroupId, contractAddress: address } = params;

  const filter = {
    address,
  };

  return node.priv.getLogs(privacyGroupId, filter).then((logs) => {
    console.log("Received logs\n", logs);
    return logs;
  });
}

run();
