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

const RLP = require("rlp");
const _ = require("lodash");
const { keccak256 } = require("./custom-ethjs-util");

/**
 * Generate a privacyGroupId
 * @param options Options passed into `eea_sendRawTransaction`
 * @returns String
 */
const generatePrivacyGroup = (options) => {
  const participants = _.chain(options.privateFor || [])
    .concat(options.privateFrom)
    .uniq()
    .map((publicKey) => {
      const buffer = Buffer.from(publicKey, "base64");
      let result = 1;
      buffer.forEach((value) => {
        // eslint-disable-next-line no-bitwise
        result = (31 * result + ((value << 24) >> 24)) & 0xffffffff;
      });
      return { b64: publicKey, buf: buffer, hash: result };
    })
    .sort((a, b) => {
      return a.hash - b.hash;
    })
    .map((x) => {
      return x.buf;
    })
    .value();

  const rlp = RLP.encode(participants);

  return Buffer.from(keccak256(rlp)).toString("base64");
};

module.exports = {
  generatePrivacyGroup,
};
