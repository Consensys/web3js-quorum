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

const privacyProxyAbi = require("../solidity/PrivacyProxy.json").output.abi;
const { generatePrivacyGroup } = require("./privacyGroup");
const { PrivateSubscription } = require("./privateSubscription");
const Priv = require("./priv");
const FlexiblePrivacyGroup = require("./flexiblePrivacyGroup");

/**
 * Handles elements
 * @name Web3Quorum
 * @class Web3Quorum
 */
function Web3Quorum(web3) {
  if (web3.currentProvider == null) {
    throw new Error("Missing provider");
  }

  /* eslint-disable no-param-reassign */
  // Initialize the extensions
  web3.priv = {
    subscriptionPollingInterval: 1000,
  };
  web3.privx = {};
  web3.eth.flexiblePrivacyGroup = {};
  /* eslint-enable no-param-reassign */
  Object.assign(web3.priv, Priv(web3).priv);
  Object.assign(
    web3.eth.flexiblePrivacyGroup,
    FlexiblePrivacyGroup(web3).eth.flexiblePrivacyGroup
  );

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
    subscribeWithPooling: subscribe,
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

  Object.assign(web3.privx, {
    createPrivacyGroup: createXPrivacyGroup,
    removeFromPrivacyGroup,
    addToPrivacyGroup,
    setPrivacyGroupLockState,
  });

  return web3;
}

module.exports = Web3Quorum;
