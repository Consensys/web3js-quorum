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
      {
        name: "distributeRawTransaction",
        call: "priv_distributeRawTransaction",
        params: 1,
      },
      {
        name: "getEeaTransactionCount",
        call: "priv_getEeaTransactionCount",
        params: 0, // TODO: @achraf check params
      },
      {
        name: "getFilterChanges",
        call: "priv_getFilterChanges",
        params: 2,
        outputFormatter: web3.extend.outputLogFormatter,
      },
      {
        name: "getFilterLogs",
        call: "priv_getFilterLogs",
        params: 2,
        outputFormatter: web3.extend.outputLogFormatter,
      },
      {
        name: "getLogs",
        call: "priv_getLogs",
        params: 3,
        inputFormatter: [
          null,
          null,
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
        outputFormatter: web3.extend.outputLogFormatter,
      },
      {
        name: "getPrivacyPrecompileAddress",
        call: "priv_getPrivacyPrecompileAddress",
        params: 0, // TODO: @achraf check params
      },
      {
        name: "getPrivateTransaction",
        call: "priv_getPrivateTransaction",
        params: 1,
      },
      {
        name: "createPrivacyGroup",
        call: "priv_createPrivacyGroup",
        params: 1,
      },
      {
        name: "deletePrivacyGroup",
        call: "priv_deletePrivacyGroup",
        params: 1,
      },
      {
        name: "findPrivacyGroup",
        call: "priv_findPrivacyGroup",
        params: 1,
      },
      {
        name: "getCode",
        call: "priv_getCode",
        params: 0, // TODO: @achraf check params
      },
      {
        name: "getTransactionCount",
        call: "priv_getTransactionCount",
        params: 2,
        outputFormatter: (output) => {
          return parseInt(output, 16);
        },
      },
      {
        name: "getTransactionReceipt",
        call: "priv_getTransactionReceipt",
        params: 2,
      },
      {
        name: "newFilter",
        call: "priv_newFilter",
        params: 3,
        inputFormatter: [
          null,
          null,
          web3.extend.formatters.inputDefaultBlockNumberFormatter,
        ],
      },
      {
        name: "uninstallFilter",
        call: "priv_uninstallFilter",
        params: 2,
      },
      {
        name: "sendRawTransaction",
        call: "eea_sendRawTransaction",
        params: 1,
      },
    ],
  });
  return web3;
}

module.exports = Priv;
