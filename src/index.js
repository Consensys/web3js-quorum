/*
 * Copyright ConsenSys Software Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const crypto = require("crypto");

const { privateToAddress } = require("./custom-ethjs-util");
const privacyProxyAbi = require("./solidity/PrivacyProxy.json").output.abi;
const PrivateTransaction = require("./privateTransaction");
const { generatePrivacyGroup } = require("./privacyGroup");
const { PrivateSubscription } = require("./privateSubscription");
const Priv = require("./priv");

/**
 * Handles elements
 * @name Web3Quorum
 * @class Web3Quorum
 */
function Web3Quorum(web3) {
  const GAS_PRICE = 0;
  const GAS_LIMIT = 3000000;

  if (web3.currentProvider == null) {
    throw new Error("Missing provider");
  }

  /* eslint-disable no-param-reassign */
  // Initialize the extensions
  // web3.priv = {
  //   ,
  // };
  web3.eea = {};
  web3.privx = {};
  /* eslint-enable no-param-reassign */
  Object.assign(web3.priv, {
    ...Priv(web3).priv,
    subscriptionPollingInterval: 1000,
  });

  // INTERNAL ==========
  web3.extend({
    property: "privInternal",
    methods: [
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
      // privx
      {
        name: "findOnChainPrivacyGroup",
        call: "privx_findOnChainPrivacyGroup",
        params: 1,
      },
    ],
  });

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
      .getTransactionCount(from, options.privacyGroupId)
      .then(async (transactionCount) => {
        tx.nonce = options.nonce || transactionCount;
        tx.gasPrice = GAS_PRICE;
        tx.gasLimit = GAS_LIMIT;
        tx.to = options.to;
        tx.value = 0;
        tx.data = options.data;
        // eslint-disable-next-line no-underscore-dangle
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

  const distributeRawTransaction = (options) => {
    return genericSendRawTransaction(options, "priv_distributeRawTransaction");
  };

  /**
   * Get the private transaction Receipt.
   * @param {string} txHash Transaction Hash of the marker transaction
   * @param {string} enclavePublicKey Public key used to start-up the Enclave
   * @param {int} retries Number of retries to be made to get the private marker transaction receipt
   * @param {int} delay The delay between the retries
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const getTransactionReceipt = (
    txHash,
    enclavePublicKey,
    retries = 300,
    delay = 1000
  ) => {
    return getMarkerTransaction(txHash, retries, delay).then(() => {
      return web3.privInternal.getTransactionReceipt(txHash, enclavePublicKey);
    });
  };

  /**
   * Subscribe to new logs matching a filter
   *
   * If the provider supports subscriptions, it uses `priv_subscribe`, otherwise
   * it uses polling and `priv_getFilterChanges` to get new logs. Returns an
   * error to the callback if there is a problem subscribing or creating the filter.
   * @param {string} privacyGroupId
   * @param {*} filter
   * @param {function} callback returns the filter/subscription ID, or an error
   * @return {PrivateSubscription} a subscription object that manages the
   * lifecycle of the filter or subscription
   */
  const subscribe = async (privacyGroupId, filter, callback) => {
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
    generatePrivacyGroup,
    distributeRawTransaction,
    subscribe,
  });

  // EEA ==========

  /**
   * Send the Raw transaction to the Besu node
   * @param options Map to send a raw transaction to besu
   * options map can contain the following:
   * - privateKey : Private Key used to sign transaction with
   * - privateFrom : Enclave public key
   * - privateFor : Enclave keys to send the transaction to
   * - privacyGroupId : Enclave id representing the receivers of the transaction
   * - nonce(Optional) : If not provided, will be calculated using `eea_getTransctionCount`
   * - to : The address to send the transaction
   * - data : Data to be sent in the transaction
   *
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const sendRawTransaction = (options) => {
    return genericSendRawTransaction(options, "eea_sendRawTransaction");
  };

  Object.assign(web3.eea, {
    sendRawTransaction,
  });

  // PRIVX ==========

  /**
   * Either lock or unlock the privacy group for member adding
   * @param options Map to lock the group
   * options map can contain the following:
   * - **privacyGroupId:** Privacy group ID to lock/unlock
   * - **privateKey:** Private Key used to sign transaction with
   * - **enclaveKey:** Orion public key
   * - **lock:** boolean indicating whether to lock or unlock
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const setPrivacyGroupLockState = (options) => {
    const contract = new web3.eth.Contract(privacyProxyAbi);
    // eslint-disable-next-line no-underscore-dangle
    const functionAbi = contract._jsonInterface.find((e) => {
      return e.name === (options.lock ? "lock" : "unlock");
    });

    const functionCall = {
      to: "0x000000000000000000000000000000000000007c",
      data: functionAbi.signature,
      privateFrom: options.enclaveKey,
      privacyGroupId: options.privacyGroupId,
      privateKey: options.privateKey,
    };

    return web3.eea
      .sendRawTransaction(functionCall)
      .then(async (transactionHash) => {
        return web3.priv.getTransactionReceipt(
          transactionHash,
          options.publicKey
        );
      });
  };

  /**
   * Create an on chain privacy group
   * @param options Map to add the members
   * options map can contain the following:
   * - **privacyGroupId:** Privacy group ID to add to
   * - **privateKey:** Private Key used to sign transaction with
   * - **enclaveKey:** Orion public key
   * - **participants:** list of enclaveKey to pass to the contract to add to the group
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const createXPrivacyGroup = (options) => {
    const contract = new web3.eth.Contract(privacyProxyAbi);
    // eslint-disable-next-line no-underscore-dangle
    const functionAbi = contract._jsonInterface.find((e) => {
      return e.name === "addParticipants";
    });
    const functionArgs = web3.eth.abi
      .encodeParameters(functionAbi.inputs, [
        options.participants.map((e) => {
          return Buffer.from(e, "base64");
        }),
      ])
      .slice(2);

    // Generate a random ID if one was not passed in
    const privacyGroupId =
      options.privacyGroupId || crypto.randomBytes(32).toString("base64");

    const functionCall = {
      to: "0x000000000000000000000000000000000000007c",
      data: functionAbi.signature + functionArgs,
      privateFrom: options.enclaveKey,
      privacyGroupId,
      privateKey: options.privateKey,
    };
    return web3.eea.sendRawTransaction(functionCall).then((transactionHash) => {
      return web3.priv.getTransactionReceipt(
        transactionHash,
        options.publicKey
      );
    });
  };

  /**
   * Add to an existing on-chain privacy group
   * @param options Map to add the members
   * options map can contain the following:
   *
   * - **privacyGroupId:** Privacy group ID to add to
   * - **privateKey:** Private Key used to sign transaction with
   * - **enclaveKey:** Orion public key
   * - **participants:** list of enclaveKey to pass to the contract to add to the group
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const addToPrivacyGroup = (options) => {
    return setPrivacyGroupLockState(
      Object.assign(options, { lock: true })
    ).then((receipt) => {
      if (receipt.status === "0x1") {
        return createXPrivacyGroup(options);
      }
      throw Error(
        `Locking the privacy group failed, receipt: ${JSON.stringify(receipt)}`
      );
    });
  };

  /**
   * Remove a member from an on-chain privacy group
   * @param options Map to add the members
   * options map can contain the following:
   * - **privacyGroupId:** Privacy group ID to add to
   * - **privateKey:** Private Key used to sign transaction with
   * - **enclaveKey:** Orion public key
   * - **participant:** single enclaveKey to pass to the contract to add to the group
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  const removeFromPrivacyGroup = (options) => {
    const contract = new web3.eth.Contract(privacyProxyAbi);
    // eslint-disable-next-line no-underscore-dangle
    const functionAbi = contract._jsonInterface.find((e) => {
      return e.name === "removeParticipant";
    });
    const functionArgs = web3.eth.abi
      .encodeParameters(functionAbi.inputs, [
        Buffer.from(options.participant, "base64"),
      ])
      .slice(2);

    const functionCall = {
      to: "0x000000000000000000000000000000000000007c",
      data: functionAbi.signature + functionArgs,
      privateFrom: options.enclaveKey,
      privacyGroupId: options.privacyGroupId,
      privateKey: options.privateKey,
    };
    return web3.eea.sendRawTransaction(functionCall).then((transactionHash) => {
      return web3.priv.getTransactionReceipt(
        transactionHash,
        options.publicKey
      );
    });
  };

  /**
   * Find privacy groups
   * @param options Map to find the group
   * options map can contain the following:
   * - **addresses:** the members of the privacy group
   * @returns Promise<privacy group | never>
   */
  const findOnChainPrivacyGroup = (options) => {
    // TODO: remove this function and pass arguments individually (breaks API)
    return web3.privInternal.findOnChainPrivacyGroup(options.addresses);
  };

  Object.assign(web3.privx, {
    createPrivacyGroup: createXPrivacyGroup,
    findOnChainPrivacyGroup,
    removeFromPrivacyGroup,
    addToPrivacyGroup,
    setPrivacyGroupLockState,
  });

  return web3;
}

module.exports = Web3Quorum;
