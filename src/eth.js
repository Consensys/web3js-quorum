function Eth(web3) {
  web3.eth.extend({
    methods: [
      {
        name: "sendRawPrivateTransaction",
        call: "eth_sendRawPrivateTransaction",
        params: 2,
      },
      {
        name: "fillTransaction",
        call: "eth_fillTransaction",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputTransactionFormatter],
      },
      {
        name: "storageRoot",
        call: "eth_storageRoot",
        params: 2,
        inputFormatter: [
          web3.extend.formatters.inputAddressFormatter,
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
      {
        name: "getQuorumPayload",
        call: "eth_getQuorumPayload",
        params: 1,
      },
      {
        name: "sendTransactionAsync",
        call: "eth_sendTransactionAsync",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputTransactionFormatter],
      },
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
