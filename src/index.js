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

const Utils = require("./utils");
const Priv = require("./priv");
const FlexiblePrivacyGroup = require("./flexiblePrivacyGroup");
const Eth = require("./eth");
const Ptm = require("./ptm");
const Raft = require("./raft");
const Istanbul = require("./istanbul");
const Permission = require("./permission");

/**
 * Handles elements
 * @name Web3Quorum
 * @class Web3Quorum
 *
 * @param {Object}  web3 instance of the web3.js library
 * @param {Object}  [enclaveOptions] configs of the transaction manager required for GoQuorum case only
 * @param {string}  enclaveOptions.ipcPath     absolute file path to the ipc of the transaction manager
 * @param {string}  enclaveOptions.privateUrl  http url to the transaction manager
 * @param {Object}  enclaveOptions.tlsSettings TLS configuration for the transaction manager when using HTTPS in privateUrl
 * @param {Buffer}  enclaveOptions.tlsSettings.key           client key buffer
 * @param {Buffer}  enclaveOptions.tlsSettings.clcert        client certificate buffer
 * @param {Buffer}  enclaveOptions.tlsSettings.cacert        CA certificate buffer
 * @param {Boolean} enclaveOptions.tlsSettings.allowInsecure
 * @param {Boolean} [isQuorum=false] indicates if the connected to client is quorum or besu
 */
function Web3Quorum(web3, enclaveOptions = {}, isQuorum = false) {
  if (web3.currentProvider == null) {
    throw new Error("Missing provider");
  }
  // TODO: to be updated by a method call web3_clientVersion
  // eslint-disable-next-line no-param-reassign
  web3.isQuorum = isQuorum;

  // Extend the utils namespace methods
  Utils(web3);

  Ptm(web3, enclaveOptions);
  // Extend the priv namespace methods
  Priv(web3);
  // Extend the flexiblePrivacyGroup namespace methods
  FlexiblePrivacyGroup(web3);

  // Extend the eth namespace methods with GoQuorum methods
  Eth(web3);

  // Extend the raft namespace methods
  Raft(web3);

  // Extend the Istanbul namespace methods
  Istanbul(web3);

  // Extend the Permission namespace methods
  Permission(web3);

  return web3;
}

module.exports = Web3Quorum;
