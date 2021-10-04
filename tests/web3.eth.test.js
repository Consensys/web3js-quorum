const Web3 = require("web3");
const Web3Quorum = require("../src/index");
const { mockHttpPost, resetMock } = require("./tests-utils/httpMock");
const {
  URL,
  TRANSACTION_OBJECT,
  ADDRESS,
  BLOCK_NUMBER,
  SIGNED_RLP,
  ENCLAVE_ADDRESS,
  TRANSACTION_HASH,
} = require("./tests-utils/constants");

describe("web3.eth", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  afterEach(() => {
    resetMock();
  });

  describe("web3.eth.sendRawPrivateTransaction", () => {
    it("should call eth_sendRawPrivateTransaction", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.sendRawPrivateTransaction(SIGNED_RLP, {
        privateFor: [ENCLAVE_ADDRESS],
      });

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_sendRawPrivateTransaction");
      expect(request.params).toEqual([
        SIGNED_RLP,
        {
          privateFor: [ENCLAVE_ADDRESS],
        },
      ]);
    });

    it("throw error when call eth_sendRawPrivateTransaction with no param", async () => {
      await expect(() => {
        return web3.eth.sendRawPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.eth.fillTransaction", () => {
    it("should call eth_fillTransaction", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.fillTransaction(TRANSACTION_OBJECT);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_fillTransaction");
      expect(request.params).toEqual([TRANSACTION_OBJECT]);
    });

    it("throw error when call eth_fillTransaction with no param", async () => {
      await expect(() => {
        return web3.eth.fillTransaction();
      }).toThrow("Cannot read property 'to' of undefined");
    });
  });

  describe("web3.eth.storageRoot", () => {
    it("should call eth_storageRoot", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.storageRoot(ADDRESS, 11);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_storageRoot");
      expect(request.params).toEqual([ADDRESS, BLOCK_NUMBER]);
    });

    it("should call eth_storageRoot with latest block", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.storageRoot(ADDRESS);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_storageRoot");
      expect(request.params).toEqual([ADDRESS, "latest"]);
    });

    it("throw error when call eth_storageRoot with no param", async () => {
      await expect(() => {
        return web3.eth.storageRoot();
      }).toThrow(
        "Provided address undefined is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted."
      );
    });
  });

  describe("web3.eth.getQuorumPayload", () => {
    it("should call eth_getQuorumPayload", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.getQuorumPayload(ADDRESS);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_getQuorumPayload");
      expect(request.params).toEqual([ADDRESS]);
    });

    it("throw error when call eth_getQuorumPayload with no param", async () => {
      await expect(() => {
        return web3.eth.getQuorumPayload();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.eth.sendTransactionAsync", () => {
    it("should call eth_sendTransactionAsync", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.sendTransactionAsync(TRANSACTION_OBJECT);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_sendTransactionAsync");
      expect(request.params).toEqual([TRANSACTION_OBJECT]);
    });

    it("throw error when call eth_sendTransactionAsync with no param", async () => {
      await expect(() => {
        return web3.eth.sendTransactionAsync();
      }).toThrow("Cannot read property 'to' of undefined");
    });
  });

  describe("web3.eth.getContractPrivacyMetadata", () => {
    it("should call eth_getContractPrivacyMetadata", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.getContractPrivacyMetadata(ADDRESS);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_getContractPrivacyMetadata");
      expect(request.params).toEqual([ADDRESS]);
    });

    it("throw error when call eth_getContractPrivacyMetadata with no param", async () => {
      await expect(() => {
        return web3.eth.getContractPrivacyMetadata();
      }).toThrow(
        "Provided address undefined is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted."
      );
    });
  });

  describe("web3.eth.distributePrivateTransaction", () => {
    it("should call eth_distributePrivateTransaction", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.distributePrivateTransaction(SIGNED_RLP, {
        privateFor: [ENCLAVE_ADDRESS],
      });

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_distributePrivateTransaction");
      expect(request.params).toEqual([
        SIGNED_RLP,
        {
          privateFor: [ENCLAVE_ADDRESS],
        },
      ]);
    });

    it("throw error when call eth_distributePrivateTransaction with no param", async () => {
      await expect(() => {
        return web3.eth.distributePrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.eth.getPrivacyPrecompileAddress", () => {
    it("should call eth_getPrivacyPrecompileAddress", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.getPrivacyPrecompileAddress();

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_getPrivacyPrecompileAddress");
      expect(request.params).toEqual([]);
    });
  });

  describe("web3.eth.getPrivateTransactionByHash", () => {
    it("should call eth_getPrivateTransactionByHash", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.getPrivateTransactionByHash(TRANSACTION_HASH);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_getPrivateTransactionByHash");
      expect(request.params).toEqual([TRANSACTION_HASH]);
    });

    it("throw error when call eth_getPrivateTransactionByHash with no param", async () => {
      await expect(() => {
        return web3.eth.getPrivateTransactionByHash();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.eth.getPrivateTransactionReceipt", () => {
    it("should call eth_getPrivateTransactionReceipt", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.eth.getPrivateTransactionReceipt(TRANSACTION_HASH);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eth_getPrivateTransactionReceipt");
      expect(request.params).toEqual([TRANSACTION_HASH]);
    });

    it("throw error when call eth_getPrivateTransactionReceipt with no param", async () => {
      await expect(() => {
        return web3.eth.getPrivateTransactionReceipt();
      }).toThrow("Invalid number of parameters");
    });
  });
});
