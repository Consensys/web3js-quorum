const { Transaction } = require("ethereumjs-tx");
const PrivateTransaction = require("./privateTransaction");
const { privateToAddress } = require("./util/custom-ethjs-util");
const { PrivateSubscription } = require("./privateSubscription");
const { intToHex } = require("./util");

/**
 * @module priv
 */
function Priv(web3) {
  const GAS_PRICE = 0;
  const GAS_LIMIT = 3000000;
  let chainId = null;
  web3.extend({
    property: "priv",
    methods: [
      /**
       * Invokes a private contract function locally and does not change the privacy group state.
       * @function call
       * @param {String} privacyGroupId privacy group ID
       * @param {Object} call transaction call object
       * @param {String} blockNumber integer representing a block number or one of the string tags latest, earliest, or pending
       * @return {Data} result return value of the executed contract
       */
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
      /**
       * @function debugGetStateRoot
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {String|Number} blockNumber
       * @return {String} 32-byte state root
       */
      {
        name: "debugGetStateRoot",
        call: "priv_debugGetStateRoot",
        params: 2,
      },
      /**
       * @function distributeRawTransaction
       * @param {String} transaction signed RLP-encoded private transaction
       * @return {String} 32-byte enclave key
       */
      {
        name: "distributeRawTransaction",
        call: "priv_distributeRawTransaction",
        params: 1,
      },
      /**
       * @function getEeaTransactionCount
       * @param {String} address account address
       * @param {String} sender base64-encoded Orion address of the sender
       * @param {String[]} recipients base64-encoded Orion addresses of recipients
       * @return {String} integer representing the number of private transactions sent from the address to the specified group of sender and recipients
       */
      {
        name: "getEeaTransactionCount",
        call: "priv_getEeaTransactionCount",
        params: 3,
      },
      /**
       * @function getFilterChanges
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {String} filterId filter ID
       * @return {Object[]} list of log objects, or an empty list if nothing has changed since the last poll
       */
      {
        name: "getFilterChanges",
        call: "priv_getFilterChanges",
        params: 2,
        outputFormatter: web3.extend.formatters.outputLogFormatter,
      },
      /**
       * @function getFilterLogs
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {String} filterId filter ID
       * @return {Object[]} list of log objects
       */
      {
        name: "getFilterLogs",
        call: "priv_getFilterLogs",
        params: 2,
        outputFormatter: web3.extend.formatters.outputLogFormatter,
      },
      /**
       * @function getLogs
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {Object} filterOptions filter options object
       * @return {Object[]} list of log objects
       */
      {
        name: "getLogs",
        call: "priv_getLogs",
        params: 2,
        outputFormatter: web3.extend.formatters.outputLogFormatter,
      },
      /**
       * @function getPrivacyPrecompileAddress
       * @return {String} address of the privacy precompile
       */
      {
        name: "getPrivacyPrecompileAddress",
        call: "priv_getPrivacyPrecompileAddress",
        params: 0,
      },
      /**
       * @function getPrivateTransaction
       * @param {String} transaction transaction hash returned by eea_sendRawTransaction or eea_sendTransaction.
       * @return {Object} private transaction object, or null if not a participant in the private transaction
       */
      {
        name: "getPrivateTransaction",
        call: "priv_getPrivateTransaction",
        params: 1,
      },
      /**
       * @function createPrivacyGroup
       * @param {Object} options request options object with the following fields:
       * @param {String[]} options.addresses list of nodes specified by Orion public keys
       * @param {String} options.name (optional) privacy group name
       * @param {String} options.description (optional) privacy group description
       * @return {String} privacy group ID
       */
      {
        name: "createPrivacyGroup",
        call: "priv_createPrivacyGroup",
        params: 1,
      },
      /**
       * @function deletePrivacyGroup
       * @param {String} privacyGroupId privacy group ID
       * @return {String} deleted privacy group ID
       */
      {
        name: "deletePrivacyGroup",
        call: "priv_deletePrivacyGroup",
        params: 1,
      },
      /**
       * @function findPrivacyGroup
       * @param {String[]} members members specified by Orion public keys
       * @return {Object[]} privacy group objects
       */
      {
        name: "findPrivacyGroup",
        call: "priv_findPrivacyGroup",
        params: 1,
      },
      /**
       * @function getCode
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {String} address 20-byte contract address
       * @param {String|Number} blockNumber
       * @return {String} code stored at the specified address
       */
      {
        name: "getCode",
        call: "priv_getCode",
        params: 3,
      },
      /**
       * @function getTransactionCount
       * @param {String} address account address
       * @param {String} privacyGroupId privacy group ID
       * @return {String} integer representing the number of private transactions sent from the address to the specified privacy group
       */
      {
        name: "getTransactionCount",
        call: "priv_getTransactionCount",
        params: 2,
        outputFormatter: (output) => {
          return parseInt(output, 16);
        },
      },
      /**
       * @function getTransactionReceipt
       * @param {String} transaction 32-byte hash of a transaction
       * @return {Object} private Transaction receipt object, or null if no receipt found
       */
      {
        name: "getTransactionReceipt",
        call: "priv_getTransactionReceipt",
        params: 1,
      },
      /**
       * @function newFilter
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {Object} filterOptions filter options object
       * @return {String} filter ID
       */
      {
        name: "newFilter",
        call: "priv_newFilter",
        params: 2,
      },
      /**
       * @function uninstallFilter
       * @param {String} privacyGroupId 32-byte privacy Group ID
       * @param {Object} filterOptions filter options object
       * @return {Boolean} indicates if the filter is successfully uninstalled
       */
      {
        name: "uninstallFilter",
        call: "priv_uninstallFilter",
        params: 2,
      },
      /**
       * @function sendRawTransaction
       * @param {String} transaction signed RLP-encoded private transaction
       * @return {String} 32-byte transaction hash of the Privacy Marker Transaction
       */
      {
        name: "sendRawTransaction",
        call: "eea_sendRawTransaction",
        params: 1,
      },
      /**
       * @function subscribe
       * @param {String} privacyGroupId
       * @param {String} type
       * @param {Object} filter
       * @return {Sting} Subscription ID
       */
      {
        name: "subscribe",
        call: "priv_subscribe",
        params: 3, // privacyGroupId, type, filter
      },
      /**
       * @function unsubscribe
       * @param {String} privacyGroupId
       * @param {String} subscriptionId
       * @return {Boolean} true if subscription successfully unsubscribed; otherwise, returns an error.
       */
      {
        name: "unsubscribe",
        call: "priv_unsubscribe",
        params: 2, // privacyGroupId, subscriptionId
      },
    ],
  });

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
              return resolve(result);
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
   * Get the private transaction Receipt with waiting until the receipt is ready.
   * @function waitForTransactionReceipt
   * @param {string} txHash Transaction Hash of the marker transaction
   * @param {int} [retries=300] Number of retries to be made to get the private marker transaction receipt
   * @param {int} [delay=1000] The delay between the retries in milliseconds
   * @returns {Promise<T>}
   */
  const waitForTransactionReceipt = (txHash, retries = 300, delay = 1000) => {
    return getMarkerTransaction(txHash, retries, delay).then((receipt) => {
      if (web3.isQuorum) {
        return receipt;
      }
      return web3.priv.getTransactionReceipt(txHash);
    });
  };

  const getTransactionPayload = (options) => {
    if (options.isPrivate) {
      return web3.ptm.storeRaw(options);
    }
    return options.data;
  };

  const serializeSignedTransaction = (options, data) => {
    const rawTransaction = {
      nonce: intToHex(options.nonce),
      from: options.from,
      to: options.to,
      value: intToHex(options.value),
      gasLimit: intToHex(options.gasLimit),
      gasPrice: intToHex(options.gasPrice),
      data: `0x${data}`,
    };

    const tx = new Transaction(rawTransaction, {
      chain: "mainnet",
      hardfork: "homestead",
    });
    tx.sign(Buffer.from(options.from.privateKey.substring(2), "hex"));

    const serializedTx = tx.serialize();
    return `0x${serializedTx.toString("hex")}`;
  };

  const sendRawRequest = async (
    payload,
    privateFor,
    privacyFlag = undefined
  ) => {
    const privacyParams = {
      privateFor,
    };
    if (typeof privacyFlag !== "undefined") {
      privacyParams.privacyFlag = privacyFlag;
    }
    const txHash = await web3.eth.sendRawPrivateTransaction(
      payload,
      privacyParams
    );
    return waitForTransactionReceipt(txHash);
  };

  const genericSendRawTransaction = async (options, method) => {
    if (web3.isQuorum) {
      const transactionPayload = await getTransactionPayload(options);
      const serializedTx = serializeSignedTransaction(
        options,
        transactionPayload
      );

      const privateTx = web3.utils.setPrivate(serializedTx);
      return sendRawRequest(
        `0x${privateTx.toString("hex")}`,
        options.privateFor,
        options.privacyFlag
      );
    }
    if (options.privacyGroupId && options.privateFor) {
      throw Error("privacyGroupId and privateFor are mutually exclusive");
    }
    chainId = chainId || (await web3.eth.getChainId());
    const tx = new PrivateTransaction();
    const privateKeyBuffer = Buffer.from(options.privateKey, "hex");
    const from = `0x${privateToAddress(privateKeyBuffer).toString("hex")}`;
    const privacyGroupId =
      options.privacyGroupId || web3.utils.generatePrivacyGroup(options);
    const transactionCount =
      options.nonce ||
      (await web3.priv.getTransactionCount(from, privacyGroupId));
    tx.nonce = options.nonce || transactionCount;
    tx.gasPrice = GAS_PRICE;
    tx.gasLimit = GAS_LIMIT;
    tx.to = options.to;
    tx.value = 0;
    tx.data = options.data;
    tx._chainId = chainId;
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
  };

  /**
   * Generate and distribute the Raw transaction to the Besu node using the `priv_distributeRawTransaction` JSON-RPC call
   * @function generateAndDistributeRawTransaction
   * @param {object} options Map to send a raw transaction to besu
   * @param {string} options.privateKey Private Key used to sign transaction with
   * @param {string} options.privateFrom Enclave public key
   * @param {string} options.privateFor Enclave keys to send the transaction to
   * @param {string} options.privacyGroupId Enclave id representing the receivers of the transaction
   * @param {string} [options.nonce] If not provided, will be calculated using `priv_getTransactionCount`
   * @param {string} options.to The address to send the transaction
   * @param {string} options.data Data to be sent in the transaction
   *
   * @returns {Promise<T>}
   */
  const generateAndDistributeRawTransaction = (options) => {
    return genericSendRawTransaction(options, "priv_distributeRawTransaction");
  };

  /**
   * Generate and send the Raw transaction to the Besu node using the `eea_sendRawTransaction` JSON-RPC call
   * @function generateAndSendRawTransaction
   * @param {object} options Map to send a raw transaction to besu
   * @param {string} options.privateKey Private Key used to sign transaction with
   * @param {string} options.privateFrom Enclave public key
   * @param {string} options.privateFor Enclave keys to send the transaction to
   * @param {string} options.privacyGroupId Enclave id representing the receivers of the transaction
   * @param {string} [options.nonce] If not provided, will be calculated using `priv_getTransactionCount`
   * @param {string} options.to The address to send the transaction
   * @param {string} options.data Data to be sent in the transaction
   *
   * @returns {Promise<T>}
   */
  const generateAndSendRawTransaction = (options) => {
    return genericSendRawTransaction(options, "eea_sendRawTransaction");
  };

  /**
   * Subscribe to new logs matching a filter
   *
   * If the provider supports subscriptions, it uses `priv_subscribe`, otherwise
   * it uses polling and `priv_getFilterChanges` to get new logs. Returns an
   * error to the callback if there is a problem subscribing or creating the filter.
   * @function subscribeWithPooling
   * @param {string} privacyGroupId
   * @param {*} filter
   * @param {function} callback returns the filter/subscription ID, or an error
   * @return {PrivateSubscription} a subscription object that manages the
   * lifecycle of the filter or subscription
   */
  const subscribeWithPooling = async (privacyGroupId, filter, callback) => {
    const sub = new PrivateSubscription(web3, privacyGroupId, filter);

    let filterId;
    try {
      filterId = await sub.subscribe();
      callback(undefined, filterId);
    } catch (error) {
      callback(error);
    }

    return sub;
  };

  Object.assign(web3.priv, {
    subscriptionPollingInterval: 1000,
    waitForTransactionReceipt,
    generateAndDistributeRawTransaction,
    generateAndSendRawTransaction,
    subscribeWithPooling,
  });

  return web3;
}

module.exports = Priv;
