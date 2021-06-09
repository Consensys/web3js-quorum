const {
  decryptedAccount,
  fromAddress,
  toAddress,
} = require("./helpers/quorumConfig");

const httpConfig = require("./helpers/httpConfig");
const ipcConfig = require("./helpers/ipcConfig");

const contract = require("../../solidity/HumanStandardToken/HumanStandardToken.json")
  .contracts["HumanStandardToken.sol:HumanStandardToken"];

const abi = JSON.parse(contract.interface);
const code = `0x${contract.bytecode}`;

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
  describe(`${testCase.name}`, () => {
    const { web3, toPublicKey, fromPublicKey } = testCase.config;

    describe("Human Standard Contract", () => {
      const transferQty = 160;
      const totalSupplyQty = "100000";
      const tokenContract = new web3.eth.Contract(abi, null, options);

      const contractPayload = tokenContract
        .deploy({
          data: code,
          arguments: [totalSupplyQty, "web3js token", 18, "web3js"],
        })
        .encodeABI();

      it("can transfer funds with private payload", async () => {
        let nonce = await web3.eth.getTransactionCount(fromAddress);
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
        const totalSupply = await token.methods
          .totalSupply()
          .call({ from: fromAddress });
        expect(totalSupply).toEqual(totalSupplyQty);
        const supply = await token.methods
          .balanceOf(fromAddress)
          .call({ from: fromAddress });
        expect(supply).toEqual(totalSupplyQty);

        const transferAbi = token.methods
          .transfer(toAddress, transferQty)
          .encodeABI();

        nonce = await web3.eth.getTransactionCount(fromAddress);
        await web3.priv.generateAndSendRawTransaction({
          gasPrice: 0,
          gasLimit: 4300000,
          to: token.options.address,
          value: 0,
          data: transferAbi,
          from: decryptedAccount,
          isPrivate: true,
          privateFrom: fromPublicKey,
          privateFor: [toPublicKey],
          nonce,
        });
        const aliceBalance = await token.methods
          .balanceOf(fromAddress)
          .call({ from: fromAddress });
        const remainingQty = totalSupplyQty - transferQty;
        expect(aliceBalance).toEqual(String(remainingQty));

        const bobBalance = await token.methods
          .balanceOf(toAddress)
          .call({ from: toAddress });
        expect(bobBalance).toEqual(String(transferQty));
      });
    });
  });
});
