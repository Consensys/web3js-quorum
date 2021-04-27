function FlexiblePrivacyGroup(web3) {
  web3.eth.extend({
    property: "flexiblePrivacyGroup",
    methods: [
      {
        name: "findOnChainPrivacyGroup",
        call: "privx_findOnChainPrivacyGroup",
        params: 1,
      },
    ],
  });

  return web3;
}

module.exports = FlexiblePrivacyGroup;
