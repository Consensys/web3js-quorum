const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const Web3Quorum = require("../../src");

const { network, enclave } = require("../keys");
const { createHttpProvider } = require("../helpers.js");

const node = new Web3Quorum(
  new Web3(createHttpProvider(enclave.node1.jwt, network.node1.url))
);
const params = JSON.parse(fs.readFileSync(path.join(__dirname, "params.json")));

async function run() {
  const { privacyGroupId } = params;
  const addressesToAdd = [enclave.node11.publicKey];

  const addResult = await node.eth.flexiblePrivacyGroup.addTo({
    participants: addressesToAdd,
    enclaveKey: enclave.node1.publicKey,
    privateFrom: enclave.node1.publicKey,
    privacyGroupId,
    privateKey: network.node1.privateKey,
  });

  console.log(addResult);
  console.log(
    `Added new participant ${addressesToAdd} to privacy group ${privacyGroupId}`
  );
}

run();
