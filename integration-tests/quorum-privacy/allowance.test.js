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
      const approvedQuantity = "100";
      const tokenContract = new web3.eth.Contract(abi, null, options);
      const contractPayload = tokenContract
        .deploy({
          data: code,
          arguments: [100000, "web3js token", 18, "web3js"],
        })
        .encodeABI();

      it("can approve allowance and fetch events", async () => {
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
        const initialAllowance = await token.methods
          .allowance(fromAddress, toAddress)
          .call({ from: fromAddress });
        expect(initialAllowance).toEqual("0");

        const approveMethodPayload = token.methods
          .approve(toAddress, approvedQuantity)
          .encodeABI();
        nonce = await web3.eth.getTransactionCount(fromAddress);
        const receipt = await web3.priv.generateAndSendRawTransaction({
          gasPrice: 0,
          gasLimit: 4300000,
          to: token.options.address,
          value: 0,
          data: approveMethodPayload,
          from: decryptedAccount,
          isPrivate: true,
          privateFrom: fromPublicKey,
          privateFor: [toPublicKey],
          nonce,
        });
        expect(receipt.contractAddress).toBeNull();
        expect(receipt.status).toBeTruthy();

        const approvedResult = await token.methods
          .allowance(fromAddress, toAddress)
          .call({ from: fromAddress });
        expect(approvedResult).toEqual(approvedQuantity);

        const [event] = await token.getPastEvents("Approval", {
          fromBlock: "0",
          toBlock: "latest",
        });
        const eventResult = event.returnValues;
        expect(eventResult._owner.toLowerCase()).toEqual(fromAddress);
        expect(eventResult._spender.toLowerCase()).toEqual(toAddress);
        expect(eventResult._value).toEqual(approvedQuantity);
        expect(event.address).toEqual(token.options.address);
      });
    });
  });
});
