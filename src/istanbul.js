/**
 * For more details about the {@link https://docs.goquorum.consensys.net/en/stable/Reference/Consensus/IBFT-RPC-API/ Istanbul JSON-RPC APIs}
 * @module Istanbul
 */
function Istanbul(web3) {
  web3.extend({
    property: "istanbul",
    methods: [
      /**
       * @function candidates
       * @return {Object} The current candidates map
       */
      {
        name: "candidates",
        call: "istanbul_candidates",
        params: 0,
      },
      /**
       * @function discard
       * @param {String} address the address of the candidate
       */
      {
        name: "discard",
        call: "istanbul_discard",
        params: 1,
      },
      /**
       * @function getSnapshot
       * @param {String|Number} blockHashOrBlockNumber The block number, the string “latest” or nil. nil is the same with string “latest” and means the latest block
       * @return {Object} The snapshot object
       */
      {
        name: "getSnapshot",
        call: "istanbul_getSnapshot",
        params: 1,
        inputFormatter: [
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
      /**
       * @function getSnapshotAtHash
       * @param {String} blockHash The block hash
       * @return {Object} The snapshot object
       */
      {
        name: "getSnapshotAtHash",
        call: "istanbul_getSnapshotAtHash",
        params: 1,
      },
      /**
       * @function getValidators
       * @param {String|Number} blockHashOrBlockNumber The block number, the string “latest” or nil. nil is the same with string “latest” and means the latest block
       * @return {String[]}  The validator address array
       */
      {
        name: "getValidators",
        call: "istanbul_getValidators",
        params: 1,
        inputFormatter: [
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
      /**
       * @function getValidatorsAtHash
       * @param {String} blockHash The block hash
       * @return {String[]} The validator address array
       */
      {
        name: "getValidatorsAtHash",
        call: "istanbul_getValidatorsAtHash",
        params: 1,
      },
      /**
       * @function
       * @param {String} address The address of candidate bool - true votes in and false votes out
       * @param {Boolean} auth true votes in and false votes out
       */
      {
        name: "propose",
        call: "istanbul_propose",
        params: 2,
      },
      /**
       * @function nodeAddress
       * @return {String} The nodes public signing address
       */
      {
        name: "nodeAddress",
        call: "istanbul_nodeAddress",
        params: 0,
      },
      /**
       * @function getSignersFromBlock
       * @param {Number} blockNumber The block number to retrieve
       * @return {Object}
       */
      {
        name: "getSignersFromBlock",
        call: "istanbul_getSignersFromBlock",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputBlockNumberFormatter],
      },
      /**
       * @function getSignersFromBlockByHash
       * @param {String} blockHash The hash of the block to retrieve
       * @return {Object}
       */
      {
        name: "getSignersFromBlockByHash",
        call: "istanbul_getSignersFromBlockByHash",
        params: 1,
      },
      /**
       * @function status
       * @param {Number} startBlockNumber start block number
       * @param {Number} endBlockNumber   end block number
       * @return {Object}
       */
      {
        name: "status",
        call: "istanbul_status",
        params: 2,
      },
      /**
       * @function isValidator
       * @param {Number} blockNumber block number
       * @return {Boolean} validator status of this node for the given blockNumber.
       */
      {
        name: "isValidator",
        call: "istanbul_isValidator",
        params: 1,
        inputFormatter: [
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
    ],
  });
  return web3;
}

module.exports = Istanbul;
