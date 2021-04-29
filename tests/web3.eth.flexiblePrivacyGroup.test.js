const Web3 = require("web3");
const Web3Quorum = require("../src/index");
const { mockHttpPost } = require("./tests-utils/httpMock");
const { URL, ORION_ADDRESS } = require("./tests-utils/constants");

describe("web3.eth.flexiblePrivacyGroup", () => {
  const web3 = new Web3Quorum(new Web3(URL));
  describe("web3.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup", () => {
    it("should call privx_findOnChainPrivacyGroup", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup([
        ORION_ADDRESS,
      ]);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("privx_findOnChainPrivacyGroup");
      expect(request.params).toEqual([[ORION_ADDRESS]]);
    });
  });
});
