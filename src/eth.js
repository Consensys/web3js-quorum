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
    ],
  });
  return web3;
}

module.exports = Eth;
