const Web3 = require("web3");

const Web3Quorum = require("../src");

const web3 = new Web3Quorum(
  new Web3("http://localhost:22000"),
  {
    privateUrl: "http://localhost:9081",
  },
  true
);

// Example of calling Quorum specific API
web3.raft.leader().then(console.log).catch(console.log);
