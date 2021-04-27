const PrivateTransaction = require("./privateTransaction");
const { privateToAddress } = require("./utils/custom-ethjs-util");

function Priv(web3) {
  const GAS_PRICE = 0;
  const GAS_LIMIT = 3000000;
  // web3.eth.extend({
  web3.extend({
    property: "priv",
    methods: [
      {
        name: "call",
        call: "priv_call",
        params: 3,
        inputFormatter: [
          null, // privacyGroupId
          null, // tx
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
      {
        name: "debugGetStateRoot",
        call: "priv_debugGetStateRoot",
        params: 2,
      },
      {
        name: "distributeRawTransaction",
        call: "priv_distributeRawTransaction",
        params: 1,
      },
      {
        name: "getEeaTransactionCount",
        call: "priv_getEeaTransactionCount",
        params: 3,
      },
      {
        name: "getFilterChanges",
        call: "priv_getFilterChanges",
        params: 2,
        outputFormatter: web3.extend.formatters.outputLogFormatter,
      },
      {
        name: "getFilterLogs",
        call: "priv_getFilterLogs",
        params: 2,
        outputFormatter: web3.extend.formatters.outputLogFormatter,
      },
      {
        name: "getLogs",
        call: "priv_getLogs",
        params: 2,
        outputFormatter: web3.extend.formatters.outputLogFormatter,
      },
      {
        name: "getPrivacyPrecompileAddress",
        call: "priv_getPrivacyPrecompileAddress",
        params: 0,
      },
      {
        name: "getPrivateTransaction",
        call: "priv_getPrivateTransaction",
        params: 1,
      },
      {
        name: "createPrivacyGroup",
        call: "priv_createPrivacyGroup",
        params: 1,
      },
      {
        name: "deletePrivacyGroup",
        call: "priv_deletePrivacyGroup",
        params: 1,
      },
      {
        name: "findPrivacyGroup",
        call: "priv_findPrivacyGroup",
        params: 1,
      },
      {
        name: "getCode",
        call: "priv_getCode",
        params: 3,
      },
      {
        name: "getTransactionCount",
        call: "priv_getTransactionCount",
        params: 2,
        outputFormatter: (output) => {
          return parseInt(output, 16);
        },
      },
      {
        name: "getTransactionReceipt",
        call: "priv_getTransactionReceipt",
        params: 1,
      },
      {
        name: "newFilter",
        call: "priv_newFilter",
        params: 2,
      },
      {
        name: "uninstallFilter",
        call: "priv_uninstallFilter",
        params: 2,
      },
      {
        name: "sendRawTransaction",
        call: "eea_sendRawTransaction",
        params: 1,
      },
      {
        name: "subscribe",
        call: "priv_subscribe",
        params: 3, // type, privacyGroupId, filter
      },
      {
        name: "unsubscribe",
        call: "priv_unsubscribe",
        params: 2, // privacyGroupId, filterId
      },
    ],
  });

  /**
   * Returns the Private Marker transaction
   * @param {string} txHash The transaction hash
   * @param {int} retries Number of retries to be made to get the private marker transaction receipt
   * @param {int} delay The delay between the retries
   * @returns Promise to resolve the private marker transaction receipt
   * @memberOf Web3Quorum
   */
  const getMarkerTransaction = (txHash, retries, delay) => {
    /* eslint-disable promise/param-names */
    /* eslint-disable promise/avoid-new */

    const waitFor = (ms) => {
      return new Promise((r) => {
        return setTimeout(r, ms);
      });
    };

    let notified = false;
    const retryOperation = (operation, times) => {
      return new Promise((resolve, reject) => {
        return operation()
          .then((result) => {
            if (result == null) {
              if (!notified) {
                console.log("Waiting for transaction to be mined ...");
                notified = true;
              }
              if (delay === 0) {
                throw new Error(
                  `Timed out after ${retries} attempts waiting for transaction to be mined`
                );
              } else {
                const waitInSeconds = (retries * delay) / 1000;
                throw new Error(
                  `Timed out after ${waitInSeconds}s waiting for transaction to be mined`
                );
              }
            } else {
              return resolve();
            }
          })
          .catch((reason) => {
            if (times - 1 > 0) {
              // eslint-disable-next-line promise/no-nesting
              return waitFor(delay)
                .then(retryOperation.bind(null, operation, times - 1))
                .then(resolve)
                .catch(reject);
            }
            return reject(reason);
          });
      });
    };

    const operation = () => {
      return web3.eth.getTransactionReceipt(txHash);
    };

    return retryOperation(operation, retries);
  };

  /**
   * Get the private transaction Receipt.
   * @param {string} txHash Transaction Hash of the marker transaction
   * @param {string} enclavePublicKey Public key used to start-up the Enclave
   * @param {int} retries Number of retries to be made to get the private marker transaction receipt
   * @param {int} delay The delay between the retries
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const waitForTransactionReceipt = (txHash, retries = 300, delay = 1000) => {
    return getMarkerTransaction(txHash, retries, delay).then(() => {
      return web3.priv.getTransactionReceipt(txHash);
    });
  };

  /**
   * Send a transaction to `eea_sendRawTransaction` or `priv_distributeRawTransaction`
   * @param options Used to create the private transaction
   * - options.privateKey
   * - options.privateFrom
   * - options.privacyGroupId
   * - options.privateFor
   * - options.nonce
   * - options.to
   * - options.data
   */
  const genericSendRawTransaction = (options, method) => {
    if (options.privacyGroupId && options.privateFor) {
      throw Error("privacyGroupId and privateFor are mutually exclusive");
    }
    const tx = new PrivateTransaction();
    const privateKeyBuffer = Buffer.from(options.privateKey, "hex");
    const from = `0x${privateToAddress(privateKeyBuffer).toString("hex")}`;
    return web3.priv
      .getTransactionCount(
        from,
        options.privacyGroupId || web3.priv.generatePrivacyGroup(options)
      )
      .then(async (transactionCount) => {
        tx.nonce = options.nonce || transactionCount;
        tx.gasPrice = GAS_PRICE;
        tx.gasLimit = GAS_LIMIT;
        tx.to = options.to;
        tx.value = 0;
        tx.data = options.data;
        tx._chainId = await web3.eth.getChainId();
        tx.privateFrom = options.privateFrom;

        if (options.privateFor) {
          tx.privateFor = options.privateFor;
        }
        if (options.privacyGroupId) {
          tx.privacyGroupId = options.privacyGroupId;
        }
        tx.restriction = "restricted";

        tx.sign(privateKeyBuffer);

        const signedRlpEncoded = tx.serialize().toString("hex");

        let result;
        if (method === "eea_sendRawTransaction") {
          result = web3.priv.sendRawTransaction(signedRlpEncoded);
        } else if (method === "priv_distributeRawTransaction") {
          result = web3.priv.distributeRawTransaction(signedRlpEncoded);
        }
        if (result != null) {
          return result;
        }

        throw new Error(`Unknown method ${method}`);
      });
  };

  /**
   * Generate and distribute the Raw transaction to the Besu node using the `priv_distributeRawTransaction` JSON-RPC call
   * @param {object} options Map to send a raw transaction to besu
   * @param {string} options.privateKey : Private Key used to sign transaction with
   * @param {string} options.privateFrom : Enclave public key
   * @param {string} options.privateFor : Enclave keys to send the transaction to
   * @param {string} options.privacyGroupId : Enclave id representing the receivers of the transaction
   * @param {string} options.nonce(Optional) : If not provided, will be calculated using `eea_getTransctionCount`
   * @param {string} options.to : The address to send the transaction
   * @param {string} options.data : Data to be sent in the transaction
   *
   * @returns {Promise<T>}
   */
  const generateAndDistributeRawTransaction = (options) => {
    return genericSendRawTransaction(options, "priv_distributeRawTransaction");
  };

  /**
   * Generate and send the Raw transaction to the Besu node using the `eea_sendRawTransaction` JSON-RPC call
   * @param {object} options Map to send a raw transaction to besu
   * @param {string} options.privateKey : Private Key used to sign transaction with
   * @param {string} options.privateFrom : Enclave public key
   * @param {string} options.privateFor : Enclave keys to send the transaction to
   * @param {string} options.privacyGroupId : Enclave id representing the receivers of the transaction
   * @param {string} options.nonce(Optional) : If not provided, will be calculated using `eea_getTransctionCount`
   * @param {string} options.to : The address to send the transaction
   * @param {string} options.data : Data to be sent in the transaction
   *
   * @returns {Promise<T>}
   */
  const generateAndSendRawTransaction = (options) => {
    return genericSendRawTransaction(options, "eea_sendRawTransaction");
  };

  Object.assign(web3.priv, {
    waitForTransactionReceipt,
    generateAndDistributeRawTransaction,
    generateAndSendRawTransaction,
  });

  return web3;
}

module.exports = Priv;
