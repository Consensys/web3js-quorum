function Priv(web3) {
  // web3.eth.extend({
  web3.extend({
    property: "priv",
    methods: [
      /**
       * Invokes a private contract function locally
       * @param {string} privacyGroupId Enclave id representing the receivers of the transaction
       * @param {object} tx Transaction call object
       * @param {int | string} blockNumber Block number defaults to "latest"
       * @returns {Promise<T>}
       */
      {
        name: "call",
        call: "priv_call",
        params: 3,
        inputFormatter: [
          null, // privacyGroupId
          null, // tx
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
    ],
  });
  return web3;
}

module.exports = Priv;
