const { decryptedAccount, fromAddress } = require("./helpers/quorumConfig");

const httpConfig = require("./helpers/httpConfig");
const ipcConfig = require("./helpers/ipcConfig");

const contract = require("../../solidity/greeter.json").contracts[
  "Greeter.sol:Greeter"
];

const abi = JSON.parse(contract.abi);
const code = `0x${contract.bin}`;

const options = {
  data: code,
};

[
  {
    name: "Http",
    config: httpConfig,
  },
  {
    name: "Ipc",
    config: ipcConfig,
  },
].forEach((testCase) => {
  const { web3, toPublicKey, fromPublicKey } = testCase.config;

  const tokenContract = new web3.eth.Contract(abi, null, options);

  describe(`${testCase.name}`, () => {
    describe("Greeter Contract", () => {
      const contractPayload = tokenContract
        .deploy({
          data: code,
          arguments: ["Hello Tessera!"],
        })
        .encodeABI();

      it("can be deployed and executed", async () => {
        const nonce = await web3.eth.getTransactionCount(fromAddress);
        const result = await web3.priv.generateAndSendRawTransaction({
          gasPrice: 0,
          gasLimit: 4300000,
          to: "",
          value: 0,
          data: contractPayload,
          from: decryptedAccount,
          isPrivate: true,
          privateFrom: fromPublicKey,
          privateFor: [toPublicKey],
          nonce,
        });
        expect(result).not.toEqual("0x");
        expect(result.status).toBeTruthy();
        expect(result.contractAddress).toEqual(expect.any(String));

        const token = new web3.eth.Contract(
          abi,
          result.contractAddress,
          options
        );
        const greetingResult = await token.methods.greet().call({
          from: fromAddress,
        });
        expect(greetingResult).toEqual("Hello Tessera!");
      });
    });
  });
});
