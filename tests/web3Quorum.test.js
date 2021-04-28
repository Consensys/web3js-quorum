const Web3 = require("web3");
const Web3Quorum = require("../src");
const { URL } = require("./tests-utils/constants");

describe("web3Quorum", () => {
  it("should match the web3Quorum priv namespace snapshot", () => {
    expect(Web3Quorum(new Web3(URL)).priv).toMatchSnapshot();
  });
  it("should match the web3Quorum eth.flexiblePrivacyGroup namespace snapshot", () => {
    expect(
      Web3Quorum(new Web3(URL)).eth.flexiblePrivacyGroup
    ).toMatchSnapshot();
  });
});
