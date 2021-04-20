const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { network } = require("../keys");

const node = new Web3Quorum(new Web3(network.node1.url));
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
