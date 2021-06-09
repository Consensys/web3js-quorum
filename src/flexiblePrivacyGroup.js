const crypto = require("crypto");

const privacyProxyAbi = require("../solidity/PrivacyProxy.json").output.abi;

/**
 *
 * @module flexiblePrivacyGroup
 */
function FlexiblePrivacyGroup(web3) {
  web3.eth.extend({
    property: "flexiblePrivacyGroup",
    methods: [
      /**
       * @function findOnChainPrivacyGroup
       * @param {String[]} addresses
       * @return {Object}
       */
      {
        name: "findOnChainPrivacyGroup",
        call: "privx_findOnChainPrivacyGroup",
        params: 1,
      },
    ],
  });

  /**
   * Create an on chain privacy group
   * @function create
   * @param {Object}   options Map to add the members
   * @param {string}   options.privacyGroupId Privacy group ID to add to
   * @param {string}   options.privateKey Private Key used to sign transaction with
   * @param {string}   options.enclaveKey Orion public key
   * @param {string[]} options.participants list of enclaveKey to pass to the contract to add to the group
   * @return {Promise<T>}
   */
  const create = (options) => {
    const contract = new web3.eth.Contract(privacyProxyAbi);
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
    return web3.priv
      .generateAndSendRawTransaction(functionCall)
      .then((transactionHash) => {
        return web3.priv.waitForTransactionReceipt(transactionHash);
      });
  };

  /**
   * Remove a member from an on-chain privacy group
   * @function removeFrom
   * @param {Object}   options Map to add the members
   * @param {string}   options.privacyGroupId Privacy group ID to add to
   * @param {string}   options.privateKey Private Key used to sign transaction with
   * @param {string}   options.enclaveKey Orion public key
   * @param {string[]} options.participant single enclaveKey to pass to the contract to add to the group
   * @returns {Promise<T>}
   */
  const removeFrom = (options) => {
    const contract = new web3.eth.Contract(privacyProxyAbi);
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
    return web3.priv
      .generateAndSendRawTransaction(functionCall)
      .then((transactionHash) => {
        return web3.priv.waitForTransactionReceipt(transactionHash);
      });
  };

  /**
   * Either lock or unlock the privacy group for member adding
   * @function setLockState
   * @param {Object} options Map to lock the group
   * @param {string} options.privacyGroupId Privacy group ID to lock/unlock
   * @param {string} options.privateKey Private Key used to sign transaction with
   * @param {string} options.enclaveKey Orion public key
   * @param {boolean} options.lock boolean indicating whether to lock or unlock
   * @returns {Promise<T>}
   */
  const setLockState = (options) => {
    const contract = new web3.eth.Contract(privacyProxyAbi);
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

    return web3.priv
      .generateAndSendRawTransaction(functionCall)
      .then(async (transactionHash) => {
        return web3.priv.waitForTransactionReceipt(transactionHash);
      });
  };

  /**
   * Add to an existing on-chain privacy group
   * @function addTo
   * @param {Object}   options Map to add the members
   * @param {string}   options.privacyGroupId Privacy group ID to add to
   * @param {string}   options.privateKey Private Key used to sign transaction with
   * @param {string}   options.enclaveKey Orion public key
   * @param {string[]} options.participants list of enclaveKey to pass to the contract to add to the group
   * @returns {Promise<T>}
   */
  const addTo = (options) => {
    return setLockState(Object.assign(options, { lock: true })).then(
      (receipt) => {
        if (receipt.status === "0x1") {
          return create(options);
        }
        throw Error(
          `Locking the privacy group failed, receipt: ${JSON.stringify(
            receipt
          )}`
        );
      }
    );
  };

  Object.assign(web3.eth.flexiblePrivacyGroup, {
    create,
    removeFrom,
    setLockState,
    addTo,
  });
  return web3;
}

module.exports = FlexiblePrivacyGroup;
