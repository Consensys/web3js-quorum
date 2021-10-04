const Web3 = require("web3");
const Web3Quorum = require("../src");

const { contracts } = require("./support/helpers");
const { network, enclave } = require("./support/keys");

describe("getPrivateTransaction", () => {
  const node2Client = new Web3Quorum(new Web3(network.node2.url));
  const node1Client = new Web3Quorum(new Web3(network.node1.url));
  const node3Client = new Web3Quorum(new Web3(network.node3.url));

  let privacyGroupId;
  let publicHash;
  beforeAll(async () => {
    // create a privacy group with nodes 1 and 2
    privacyGroupId = await node1Client.priv.createPrivacyGroup({
      addresses: [enclave.node1.publicKey, enclave.node2.publicKey],
    });

    // deploy a contract and get the receipt
    const receipt = await node1Client.priv
      .generateAndSendRawTransaction({
        data: `0x${contracts.eventEmitter.bytecode}`,
        privateFrom: enclave.node1.publicKey,
        privacyGroupId,
        privateKey: network.node1.privateKey,
      })
      .then((hash) => {
        return node1Client.priv.waitForTransactionReceipt(hash);
      });
    publicHash = receipt.commitmentHash;
  });

  // group membership
  it("should get tx from originating node", async () => {
    const result = await node1Client.priv.getPrivateTransaction(publicHash);

    expect(result.privateFrom).toEqual(enclave.node1.publicKey);
    expect(result.privacyGroupId).toEqual(privacyGroupId);
  });

  it("should get tx from other member node", async () => {
    const result = await node2Client.priv.getPrivateTransaction(publicHash);

    expect(result.privateFrom).toEqual(enclave.node1.publicKey);
    expect(result.privacyGroupId).toEqual(privacyGroupId);
  });

  it("should get error from non-member node", async () => {
    const result = await node3Client.priv.getPrivateTransaction(publicHash);
    expect(result).toBeNull();
  });

  // inputs
  it("should fail if the transaction hash is invalid", async () => {
    await expect(
      node1Client.priv.getPrivateTransaction(undefined)
    ).rejects.toThrowError("Invalid params");
  });

  it("should return null if the txHash does not exist", async () => {
    const invalidHash =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const result = await node3Client.priv.getPrivateTransaction(invalidHash);
    expect(result).toBeNull();
  });
});
