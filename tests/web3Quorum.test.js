const Web3 = require("web3");
const Web3Quorum = require("../src");
const { URL } = require("./tests-utils/constants");

describe("web3Quorum", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  it("should match the web3Quorum priv namespace snapshot", () => {
    expect(web3.priv).toMatchSnapshot();
  });

  it("should match the web3Quorum eth.flexiblePrivacyGroup namespace snapshot", () => {
    expect(web3.eth.flexiblePrivacyGroup).toMatchSnapshot();
    expect(
      typeof web3.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup
    ).toEqual("function");
  });

  it("should match the web3Quorum utils namespace snapshot", () => {
    expect(web3.utils).toMatchSnapshot();
    expect(typeof web3.utils.generatePrivacyGroup).toEqual("function");
  });
});
