const Web3 = require("web3");
const Web3Quorum = require("../src/index");
const { mockHttpPost, resetMock } = require("./tests-utils/httpMock");
const {
  URL,
  ENCLAVE_ADDRESS,
  CHAIN_ID,
  PRIVATE_KEY,
  PRIVACY_GROUP_ID,
  TRANSACTION_COUNT,
  TRANSACTION_HASH,
  TRANSACTION_RECEIPT,
} = require("./tests-utils/constants");

describe("web3.eth.flexiblePrivacyGroup", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  afterEach(() => {
    resetMock();
  });

  describe("web3.eth.flexiblePrivacyGroup.find", () => {
    it("should call privx_findFlexiblePrivacyGroup", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.flexiblePrivacyGroup.find([ENCLAVE_ADDRESS]);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("privx_findFlexiblePrivacyGroup");
      expect(request.params).toEqual([[ENCLAVE_ADDRESS]]);
    });

    it("throw error when call privx_findFlexiblePrivacyGroup with no param", async () => {
      await expect(() => {
        return web3.eth.flexiblePrivacyGroup.find();
      }).toThrow("Invalid number of parameters");
    });
  });

  const expectSendPrivateTX = (data, shift = 0) => {
    expect(data[1 + shift].method).toEqual("priv_getTransactionCount");
    expect(data[2 + shift].method).toEqual("eea_sendRawTransaction");
    expect(data[3 + shift].method).toEqual("eth_getTransactionReceipt");
    expect(data[4 + shift].method).toEqual("priv_getTransactionReceipt");
    expect(data[1 + shift].params).toEqual(
      expect.arrayContaining([PRIVACY_GROUP_ID])
    );
    expect(data[2 + shift].params).toEqual([expect.any(String)]);
    expect(data[3 + shift].params).toEqual([TRANSACTION_HASH]);
    expect(data[4 + shift].params).toEqual([TRANSACTION_HASH]);
  };

  describe("web3.eth.flexiblePrivacyGroup.addTo", () => {
    it("should add to flexible privacy group", async () => {
      const requests = [];
      mockHttpPost(
        (data) => {
          requests.push(data);
        },
        [
          CHAIN_ID,
          TRANSACTION_COUNT,
          TRANSACTION_HASH,
          TRANSACTION_RECEIPT,
          TRANSACTION_RECEIPT,
          TRANSACTION_COUNT,
          TRANSACTION_HASH,
          TRANSACTION_RECEIPT,
          TRANSACTION_RECEIPT,
        ],
        9
      );

      await web3.eth.flexiblePrivacyGroup.addTo({
        privacyGroupId: PRIVACY_GROUP_ID,
        privateKey: PRIVATE_KEY,
        enclaveKey: ENCLAVE_ADDRESS,
        participants: [ENCLAVE_ADDRESS],
      });
      expect(requests[0].method).toEqual("eth_chainId");
      expectSendPrivateTX(requests);
      expectSendPrivateTX(requests, 4);
    });
  });

  describe.each(["create", "removeFrom", "setLockState"])(
    "flexiblePrivacyGroup",
    (method) => {
      it(`should call web3.eth.flexiblePrivacyGroup.${method}`, async () => {
        const requests = [];
        mockHttpPost(
          (data) => {
            requests.push(data);
          },
          [
            TRANSACTION_COUNT,
            TRANSACTION_HASH,
            TRANSACTION_RECEIPT,
            TRANSACTION_RECEIPT,
          ],
          4
        );

        await web3.eth.flexiblePrivacyGroup[method]({
          privacyGroupId: PRIVACY_GROUP_ID,
          privateKey: PRIVATE_KEY,
          enclaveKey: ENCLAVE_ADDRESS,
          participants: [ENCLAVE_ADDRESS],
          participant: ENCLAVE_ADDRESS,
          lock: true,
        });
        expectSendPrivateTX(requests, -1);
        expect(requests).toHaveLength(4);
      });
    }
  );
});
