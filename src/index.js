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

/**
 * Handles elements
 * @name Web3Quorum
 * @class Web3Quorum
 */
function Web3Quorum(web3) {
  if (web3.currentProvider == null) {
    throw new Error("Missing provider");
  }

  // Extend the priv namespace methods
  Priv(web3);
  // Extend the flexiblePrivacyGroup namespace methods
  FlexiblePrivacyGroup(web3);
  // Extend the flexiblePrivacyGroup namespace methods
  Utils(web3);

  return web3;
}

module.exports = Web3Quorum;
