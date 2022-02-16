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
    expect(typeof web3.eth.flexiblePrivacyGroup.find).toEqual("function");
  });

  it("should match the web3Quorum utils namespace snapshot", () => {
    expect(web3.utils).toMatchSnapshot();
    expect(typeof web3.utils.generatePrivacyGroup).toEqual("function");
  });

  it("should match the web3Quorum eth namespace snapshot", () => {
    const {
      fillTransaction,
      storageRoot,
      getQuorumPayload,
      sendTransactionAsync,
      getContractPrivacyMetadata,
    } = web3.eth;
    expect({
      fillTransaction,
      storageRoot,
      getQuorumPayload,
      sendTransactionAsync,
      getContractPrivacyMetadata,
    }).toMatchSnapshot();
    expect(typeof fillTransaction).toEqual("function");
    expect(typeof storageRoot).toEqual("function");
    expect(typeof getQuorumPayload).toEqual("function");
    expect(typeof sendTransactionAsync).toEqual("function");
    expect(typeof getContractPrivacyMetadata).toEqual("function");
  });

  it("should match the web3Quorum raft namespace snapshot", () => {
    expect(web3.raft).toMatchSnapshot();
  });

  it("should match the web3Quorum Istanbul namespace snapshot", () => {
    expect(web3.istanbul).toMatchSnapshot();
  });

  it("should match the web3Quorum Permission namespace snapshot", () => {
    expect(web3.permission).toMatchSnapshot();
  });
});
