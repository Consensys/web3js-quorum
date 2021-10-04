const Web3 = require("web3");
const waitForExpect = require("wait-for-expect");
const Web3Quorum = require("../src/index");
const {
  URL,
  TRANSACTION_OBJECT,
  PRIVACY_GROUP_ID,
  ADDRESS,
  SIGNED_RLP,
  ENCLAVE_ADDRESS,
  LOG_OBJECT,
  TRANSACTION_HASH,
  CREATE_PRIVACY_GROUP_OBJECT,
  TRANSACTION_COUNT,
  FILTER_ID,
  PRIVATE_KEY,
  CHAIN_ID,
  TRANSACTION_RECEIPT,
  BLOCK_NUMBER,
} = require("./tests-utils/constants");
const { mockHttpPost } = require("./tests-utils/httpMock");

describe("web3.priv", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  describe("web3.priv.call", () => {
    it("should call priv_call with latest as block number", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.priv.call(PRIVACY_GROUP_ID, TRANSACTION_OBJECT);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_call");
      expect(request.params).toEqual([
        PRIVACY_GROUP_ID,
        TRANSACTION_OBJECT,
        "latest",
      ]);
    });

    it("should call priv_call with formatting of the block number", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.priv.call(PRIVACY_GROUP_ID, TRANSACTION_OBJECT, 11);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_call");
      expect(request.params).toEqual([
        PRIVACY_GROUP_ID,
        TRANSACTION_OBJECT,
        BLOCK_NUMBER,
      ]);
    });

    it("should call priv_call with null param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.priv.call();

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_call");
      expect(request.params).toEqual([null, null, "latest"]);
    });
  });

  describe("web3.priv.debugGetStateRoot", () => {
    it("should call priv_debugGetStateRoot", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.debugGetStateRoot(PRIVACY_GROUP_ID, "latest");

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_debugGetStateRoot");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, "latest"]);
    });

    it("throw error when call priv_debugGetStateRoot with no param", async () => {
      await expect(() => {
        return web3.priv.debugGetStateRoot();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.distributeRawTransaction", () => {
    it("should call priv_distributeRawTransaction", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.distributeRawTransaction(SIGNED_RLP);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_distributeRawTransaction");
      expect(request.params).toEqual([SIGNED_RLP]);
    });

    it("throw error when call priv_distributeRawTransaction with no param", async () => {
      await expect(() => {
        return web3.priv.distributeRawTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getEeaTransactionCount", () => {
    it("should call priv_getEeaTransactionCount with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.getEeaTransactionCount(ADDRESS, ENCLAVE_ADDRESS, [
        ENCLAVE_ADDRESS,
      ]);

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getEeaTransactionCount");
      expect(request.params).toEqual([
        ADDRESS,
        ENCLAVE_ADDRESS,
        [ENCLAVE_ADDRESS],
      ]);
    });

    it("throw error when call priv_getEeaTransactionCount with no param", async () => {
      await expect(() => {
        return web3.priv.getEeaTransactionCount();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getFilterChanges", () => {
    it("should call priv_getFilterChanges with param and format the result", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      }, LOG_OBJECT);
      const data = await web3.priv.getFilterChanges(PRIVACY_GROUP_ID, ADDRESS);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getFilterChanges");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, ADDRESS]);
      expect(data.logIndex).toEqual(11);
      expect(data.blockNumber).toEqual(11);
      expect(data.transactionIndex).toEqual(0);
      expect(data.id).toEqual("log_51b0572c");
    });

    it("throw error when call priv_getFilterChanges with no param", async () => {
      await expect(() => {
        return web3.priv.getFilterChanges();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getFilterLogs", () => {
    it("should call priv_getFilterLogs with param and format the result", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      }, LOG_OBJECT);
      const data = await web3.priv.getFilterLogs(PRIVACY_GROUP_ID, ADDRESS);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getFilterLogs");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, ADDRESS]);
      expect(data.logIndex).toEqual(11);
      expect(data.blockNumber).toEqual(11);
      expect(data.transactionIndex).toEqual(0);
      expect(data.id).toEqual("log_51b0572c");
    });

    it("throw error when call priv_getFilterLogs with no param", async () => {
      await expect(() => {
        return web3.priv.getFilterLogs();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getLogs", () => {
    it("should call priv_getLogs with param and format the result", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      }, LOG_OBJECT);
      const data = await web3.priv.getLogs(PRIVACY_GROUP_ID, {});
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getLogs");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, {}]);
      expect(data.logIndex).toEqual(11);
      expect(data.blockNumber).toEqual(11);
      expect(data.transactionIndex).toEqual(0);
      expect(data.id).toEqual("log_51b0572c");
    });

    it("throw error when call priv_getLogs with no param", async () => {
      await expect(() => {
        return web3.priv.getLogs();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getPrivacyPrecompileAddress", () => {
    it("should call priv_getPrivacyPrecompileAddress", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.getPrivacyPrecompileAddress();
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getPrivacyPrecompileAddress");
      expect(request.params).toEqual([]);
    });
  });

  describe("web3.priv.getPrivateTransaction", () => {
    it("should call priv_getPrivateTransaction with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.getPrivateTransaction(TRANSACTION_HASH);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getPrivateTransaction");
      expect(request.params).toEqual([TRANSACTION_HASH]);
    });

    it("throw error when call priv_getPrivateTransaction with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.createPrivacyGroup", () => {
    it("should call priv_createPrivacyGroup with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.createPrivacyGroup(CREATE_PRIVACY_GROUP_OBJECT);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_createPrivacyGroup");
      expect(request.params).toEqual([CREATE_PRIVACY_GROUP_OBJECT]);
    });

    it("throw error when call priv_createPrivacyGroup with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.deletePrivacyGroup", () => {
    it("should call priv_deletePrivacyGroup with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.deletePrivacyGroup(PRIVACY_GROUP_ID);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_deletePrivacyGroup");
      expect(request.params).toEqual([PRIVACY_GROUP_ID]);
    });

    it("throw error when call priv_deletePrivacyGroup with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.findPrivacyGroup", () => {
    it("should call priv_findPrivacyGroup with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.findPrivacyGroup(CREATE_PRIVACY_GROUP_OBJECT.addresses);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_findPrivacyGroup");
      expect(request.params).toEqual([CREATE_PRIVACY_GROUP_OBJECT.addresses]);
    });

    it("throw error when call priv_findPrivacyGroup with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getCode", () => {
    it("should call priv_getCode with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.getCode(PRIVACY_GROUP_ID, ADDRESS, "latest");
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getCode");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, ADDRESS, "latest"]);
    });

    it("throw error when call priv_getCode with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getTransactionCount", () => {
    it("should call priv_getTransactionCount with param and format result", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      }, TRANSACTION_COUNT);
      const data = await web3.priv.getTransactionCount(
        ADDRESS,
        PRIVACY_GROUP_ID
      );
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getTransactionCount");
      expect(request.params).toEqual([ADDRESS, PRIVACY_GROUP_ID]);
      expect(data).toEqual(10);
    });

    it("throw error when call priv_getTransactionCount with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.getTransactionReceipt", () => {
    it("should call priv_getTransactionReceipt with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.getTransactionReceipt(TRANSACTION_HASH);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_getTransactionReceipt");
      expect(request.params).toEqual([TRANSACTION_HASH]);
    });

    it("throw error when call priv_getTransactionReceipt with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.newFilter", () => {
    it("should call priv_newFilter with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.newFilter(PRIVACY_GROUP_ID, {});
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_newFilter");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, {}]);
    });

    it("throw error when call priv_newFilter with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.uninstallFilter", () => {
    it("should call priv_uninstallFilter with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.uninstallFilter(PRIVACY_GROUP_ID, FILTER_ID);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_uninstallFilter");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, FILTER_ID]);
    });

    it("throw error when call priv_uninstallFilter with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.sendRawTransaction", () => {
    it("should call eea_sendRawTransaction with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.sendRawTransaction(SIGNED_RLP);
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("eea_sendRawTransaction");
      expect(request.params).toEqual([SIGNED_RLP]);
    });

    it("throw error when call priv_sendRawTransaction with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.subscribe", () => {
    it("should call priv_subscribe with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.subscribe(PRIVACY_GROUP_ID, "logs", {});
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_subscribe");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, "logs", {}]);
    });

    it("throw error when call priv_subscribe with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.unsubscribe", () => {
    it("should call priv_unsubscribe with param", async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });
      await web3.priv.unsubscribe(PRIVACY_GROUP_ID, "filterId");
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_unsubscribe");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, "filterId"]);
    });

    it("throw error when call priv_unsubscribe with no param", async () => {
      await expect(() => {
        return web3.priv.getPrivateTransaction();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe("web3.priv.subscribeWithPooling", () => {
    let subscription;
    it("should call priv_newFilter and then priv_getFilterChanges when using HTTP provider", async () => {
      web3.priv.subscriptionPollingInterval = 99999;
      let newFilterRequest;
      let getFilterRequest;
      let filterId;
      mockHttpPost((data) => {
        newFilterRequest = data;
      }, FILTER_ID);
      mockHttpPost(
        (data) => {
          getFilterRequest = data;
        },
        [[LOG_OBJECT]]
      );
      subscription = await web3.priv.subscribeWithPooling(
        PRIVACY_GROUP_ID,
        "logs",
        (_, filter) => {
          filterId = filter;
        }
      );
      expect(filterId).toEqual(FILTER_ID);
      expect(newFilterRequest.jsonrpc).toEqual("2.0");
      expect(newFilterRequest.method).toEqual("priv_newFilter");
      expect(newFilterRequest.params).toEqual([PRIVACY_GROUP_ID, "logs"]);
      expect(subscription.privacyGroupId).toEqual(PRIVACY_GROUP_ID);
      expect(subscription.filterId).toEqual(FILTER_ID);
      expect(subscription.filter).toEqual("logs");
      expect(subscription.protocol).toEqual("HTTP");
      await waitForExpect(() => {
        expect(getFilterRequest).toBeDefined();
        expect(getFilterRequest.jsonrpc).toEqual("2.0");
        expect(getFilterRequest.method).toEqual("priv_getFilterChanges");
        expect(getFilterRequest.params).toEqual([PRIVACY_GROUP_ID, FILTER_ID]);
      });
    });

    it("should call priv_uninstallFilter to unsubscribe from filter", async () => {
      let request;
      let isUninstalled = false;
      mockHttpPost((data) => {
        request = data;
      });
      const filterId = await subscription.unsubscribe((_, result) => {
        isUninstalled = result;
      });
      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual("priv_uninstallFilter");
      expect(request.params).toEqual([PRIVACY_GROUP_ID, FILTER_ID]);
      expect(filterId).toEqual(FILTER_ID);
      expect(isUninstalled).toBeTruthy();
    });
  });

  describe("web3.priv.generateAndDistributeRawTransaction", () => {
    it("should generate and call priv_distributeRawTransaction with param", async () => {
      const requests = [];
      mockHttpPost(
        (data) => {
          requests.push(data);
        },
        [CHAIN_ID, TRANSACTION_COUNT, TRANSACTION_HASH],
        3
      );
      await web3.priv.generateAndDistributeRawTransaction({
        privacyGroupId: PRIVACY_GROUP_ID,
        privateKey: PRIVATE_KEY,
        to: ADDRESS,
      });
      expect(requests[0].method).toEqual("eth_chainId");
      expect(requests[1].method).toEqual("priv_getTransactionCount");
      expect(requests[2].method).toEqual("priv_distributeRawTransaction");
      expect(requests[0].params).toEqual([]);
      expect(requests[1].params).toEqual([ADDRESS, PRIVACY_GROUP_ID]);
      expect(requests[2].params).toEqual([expect.any(String)]);
    });
  });

  describe("web3.priv.waitForTransactionReceipt", () => {
    it("should generate and call priv_distributeRawTransaction with param", async () => {
      const requests = [];
      mockHttpPost(
        (data) => {
          requests.push(data);
        },
        [TRANSACTION_RECEIPT, TRANSACTION_RECEIPT],
        2
      );
      await web3.priv.waitForTransactionReceipt(TRANSACTION_HASH);
      expect(requests[0].method).toEqual("eth_getTransactionReceipt");
      expect(requests[1].method).toEqual("priv_getTransactionReceipt");
      expect(requests[0].params).toEqual([TRANSACTION_HASH]);
      expect(requests[1].params).toEqual([TRANSACTION_HASH]);
    });
  });

  describe("web3.priv.generateAndSendRawTransaction", () => {
    it("should generate and call eea_sendRawTransaction with param", async () => {
      const requests = [];
      mockHttpPost(
        (data) => {
          requests.push(data);
        },
        [TRANSACTION_COUNT, TRANSACTION_HASH],
        2
      );
      await web3.priv.generateAndSendRawTransaction({
        privacyGroupId: PRIVACY_GROUP_ID,
        privateKey: PRIVATE_KEY,
        to: ADDRESS,
      });
      expect(requests[0].method).toEqual("priv_getTransactionCount");
      expect(requests[1].method).toEqual("eea_sendRawTransaction");
      expect(requests[0].params).toEqual([ADDRESS, PRIVACY_GROUP_ID]);
      expect(requests[1].params).toEqual([expect.any(String)]);
    });
  });
});
