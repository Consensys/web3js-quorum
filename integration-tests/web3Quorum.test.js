const Web3 = require("web3");
const Web3Quorum = require("../src");

const { network } = require("./support/keys");

describe("web3Quorum", () => {
  it("should match the web3Quorum priv namespace snapshot", () => {
    expect(Web3Quorum(new Web3(network.node1.url)).priv).toMatchSnapshot();
  });
  it("should match the web3Quorum eth.flexiblePrivacyGroup namespace snapshot", () => {
    expect(
      Web3Quorum(new Web3(network.node1.url)).eth.flexiblePrivacyGroup
    ).toMatchSnapshot();
  });
});
