/**
 * For more details about the {@link https://docs.goquorum.consensys.net/en/stable/Reference/APIs/PrivacyAPI Quorum Privacy APIs}
 * @module eth
 */
function Eth(web3) {
  web3.eth.extend({
    methods: [
      /**
       * @function sendRawPrivateTransaction
       * @param {String} Signed transaction data in HEX format
       * @param {Object} privateData Private data to send
       * @param {String[]} privateData.privateFor When sending a private transaction, an array of the recipients’ base64-encoded public keys.
       * @param {Number} [privateData.privacyFlag=0] 0 for SP (default if not provided), 1 for PP, 3 for PSV
       * @param {Function} [callback] If you pass a callback the HTTP request is made asynchronous.
       * @return {String} The 32 Bytes transaction hash as HEX string
       */
      {
        name: "sendRawPrivateTransaction",
        call: "eth_sendRawPrivateTransaction",
        params: 2,
      },
      /**
       * @function fillTransaction
       * @param {Object} txObj - The transaction object to send:
       * @param {String} txObj.from The address for the sending account.
       * @param {String} [txObj.to]  The destination address of the message,
       * @param {Number|String|BigNumber} [txObj.value] The value transferred for the transaction in Wei, also the endowment if it’s a contract-creation transaction.
       * @param {String} [txObj.data] Either a byte string containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
       * @param {String[]} [txObj.privateFor] When sending a private transaction, an array of the recipients’ base64-encoded public keys.
       * @return {Object} raw: RLP encoded bytes for the passed transaction object and tx : transaction object
       */
      {
        name: "fillTransaction",
        call: "eth_fillTransaction",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputTransactionFormatter],
      },
      /**
       * @function storageRoot
       * @param {String} address The address to fetch the storage root from in hex
       * @param {String} [block="latest"] The block number to fetch the storage root from in hex
       * @return {String} 32 Bytes storage root hash as hex string.
       */
      {
        name: "storageRoot",
        call: "eth_storageRoot",
        params: 2,
        inputFormatter: [
          web3.extend.formatters.inputAddressFormatter,
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
      /**
       * @function getQuorumPayload
       * @param  {String} id the HEX formatted generated Sha3-512 hash of the encrypted payload from the Private Transaction Manager. This is seen in the transaction as the input field
       * @return {String} unencrypted transaction payload in HEX format.
       */
      {
        name: "getQuorumPayload",
        call: "eth_getQuorumPayload",
        params: 1,
      },
      /**
       * @function sendTransactionAsync
       * @param {Object} txObj Transaction Object to send
       * @return {String}
       */
      {
        name: "sendTransactionAsync",
        call: "eth_sendTransactionAsync",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputTransactionFormatter],
      },
      /**
       * @function getContractPrivacyMetadata
       * @param {String} contractAddress
       * @return {Object}
       */
      {
        name: "getContractPrivacyMetadata",
        call: "eth_getContractPrivacyMetadata",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputAddressFormatter],
      },
      /**
       * @function distributePrivateTransaction
       * @param {String} privateTxn Signed private transaction in hex format
       * @param {Object} privateData Private data to send
       * @param {String[]} privateData.privateFor An array of the recipients’ base64-encoded public keys.
       * @param {String[]} [privateData.privateFrom] The sending party’s base64-encoded public key to use (Privacy Manager default if not provided).
       * @param {Number} [privateData.privacyFlag=0] 0 for SP (default if not provided), 1 for PP, 3 for PSV
       * @return {String} Transaction Manager hash to be used as a privacy marker transaction's `data` when externally signing..
       */
      {
        name: "distributePrivateTransaction",
        call: "eth_distributePrivateTransaction",
        params: 2,
      },
      /**
       * @function getPrivacyPrecompileAddress
       * @return {String} Contract address for the privacy precompile in hex format.
       */
      {
        name: "getPrivacyPrecompileAddress",
        call: "eth_getPrivacyPrecompileAddress",
        params: 0,
      },
      /**
       * @function getPrivateTransactionByHash
       * @param {String} hash Privacy marker transaction's hash in HEX format.
       * @return {Transaction} private transaction (will be nil if caller is not a participant).
       */
      {
        name: "getPrivateTransactionByHash",
        call: "eth_getPrivateTransactionByHash",
        params: 1,
      },
      /**
       * @function getPrivateTransactionReceipt
       * @param {String} hash Privacy marker transaction's hash in HEX format.
       * @return {Receipt} private transaction receipt (will be nil if caller is not a participant).
       */
      {
        name: "getPrivateTransactionReceipt",
        call: "eth_getPrivateTransactionReceipt",
        params: 1,
      },
    ],
  });

  // Use the web3 provider to directly call eth_sendTransaction in the node.
  // This is necessary as web3.eth.sendTransaction doesn't work with Privacy Marker Transactions.
  const sendTransactionUsingProvider = async (txnObject, callback) => {
    const provider = web3.eth.currentProvider;

    const jsonrpcPayload = {
      jsonrpc: "2.0",
      id: 3,
      method: "eth_sendTransaction",
      params: [txnObject],
    };

    const callSend = (sendParam) => {
      return new Promise((resolve, reject) => {
        try {
          provider.send(sendParam, (err, data) => {
            if (err) {
              reject(err);
            }
            resolve(data.result);

            if (callback != null) {
              if (data.error) {
                callback(data.error);
              } else {
                callback(undefined, data.result);
              }
            }
          });
        } catch (error) {
          reject(error);
          callback(error);
        }
      });
    };
    return callSend(jsonrpcPayload);
  };

  const getTransactionReceipt = (txHash, retries, delay) => {
    /* eslint-disable promise/param-names */
    /* eslint-disable promise/avoid-new */

    // TODO: Refactor to re-use this code which is common to priv.js::getMarkerTransaction()
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
   * Get the transaction Receipt, waiting until the receipt is ready.
   * If it's a Privacy Marker Transaction then return the receipt for the inner private transaction.
   */
  const waitForTransactionReceipt = (txHash, retries = 300, delay = 1000) => {
    return getTransactionReceipt(txHash, retries, delay).then((receipt) => {
      if (!receipt.isPrivacyMarkerTransaction) {
        return receipt;
      }
      return web3.eth.getPrivateTransactionReceipt(txHash);
    });
  };

  /**
   * Submit a transaction.
   * This method is similar to `web3.eth.sendTransaction()`, however it adds support for Privacy Marker Transactions.
   * If the transaction is a Privacy Marker, then the promise will return the receipt for the inner private transaction,
   * rather than the receipt for the Privacy Marker Transaction.
   * Note that this method does not currently support `PromiEvent` events that are returned by `web3.eth.sendTransaction()`.
   * @function sendQuorumTransaction
   * @param {Object} transaction The transaction object to send (see `web3.eth.sendTransaction()` for object details)
   * @param {Function} [callback] (optional) Optional callback, returns an error object as first parameter and the transaction hash as second.
   * @returns {Promise<T>} Resolves when the transaction receipt is available.
   */
  const sendQuorumTransaction = async (txnObject, callback) => {
    const txHash = await sendTransactionUsingProvider(txnObject, callback);
    return waitForTransactionReceipt(txHash);
  };

  Object.assign(web3.eth, {
    sendQuorumTransaction,
  });

  return web3;
}

module.exports = Eth;
