const crypto = require("crypto");
const Web3 = require("web3");

const Web3Quorum = require("../../src");

const { network, orion } = require("../support/keys");
const { contracts } = require("../support/helpers");

describe("On chain privacy", () => {
  const node1Client = new Web3Quorum(new Web3(network.node1.url));
  const node2Client = new Web3Quorum(new Web3(network.node2.url));
  const node3Client = new Web3Quorum(new Web3(network.node3.url));

  const privacyContractAddress = contracts.privacyInterface.address;

  let privacyGroupId;
  const participants = [orion.node1.publicKey];

  const privacyOptions = {
    enclaveKey: orion.node1.publicKey,
    privacyGroupId: undefined, // set later
    privateKey: network.node1.privateKey,
  };
  // createPrivacyGroup
  it("should create privacy group", async () => {
    const receipt = await node1Client.eth.flexiblePrivacyGroup.create({
      participants,
      enclaveKey: orion.node1.publicKey,
      privateKey: network.node1.privateKey,
    });

    ({ privacyGroupId } = receipt);
    // assign privacy group ID for later use
    privacyOptions.privacyGroupId = privacyGroupId;

    expect(receipt.privateFrom).toEqual(orion.node1.publicKey);
    expect(receipt.status).toEqual("0x1");
    expect(receipt.logs).toHaveLength(participants.length);
    expect(receipt.privacyGroupId).not.toEqual(null);
    expect(receipt.to).toEqual(privacyContractAddress);
  });

  it("should create privacy group with a specified privacyGroupId", async () => {
    // Generate a privacyGroupId
    const id = crypto.randomBytes(32).toString("base64");

    const receipt = await node1Client.eth.flexiblePrivacyGroup.create({
      participants,
      ...privacyOptions,
      privacyGroupId: id,
    });

    expect(receipt.privateFrom).toEqual(orion.node1.publicKey);
    expect(receipt.status).toEqual("0x1");
    expect(receipt.logs).toHaveLength(participants.length);
    expect(receipt.privacyGroupId).toEqual(id);
    expect(receipt.to).toEqual(privacyContractAddress);
  });

  // findOnChainPrivacyGroup
  it("should find privacy group after creation", async () => {
    const found = await node1Client.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup(
      participants
    );

    // the one we created should be in there
    const created = found.find((group) => {
      return group.privacyGroupId === privacyGroupId;
    });

    expect(created.privacyGroupId).toEqual(privacyGroupId);
    expect(created.members).toEqual(participants.sort());
    expect(created.type).toEqual("ONCHAIN");
    expect(created.name).toEqual("");
    expect(created.description).toEqual("");
  });

  it("non-member should not find privacy group(s)", async () => {
    const found = await node2Client.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup(
      participants
    );
    expect(found).toHaveLength(0);
  });

  // addToPrivacyGroup
  it("should add a member to the group", async () => {
    // add node 2
    const addReceipt = await node1Client.eth.flexiblePrivacyGroup.addTo({
      ...privacyOptions,
      participants: [orion.node2.publicKey],
    });
    expect(addReceipt.status).toEqual("0x1");
  });

  it("non-member should not be able to add to the group", async () => {
    await expect(
      node3Client.eth.flexiblePrivacyGroup.addTo({
        enclaveKey: orion.node3.publicKey,
        privateKey: network.node3.privateKey,
        privacyGroupId,
      })
    ).rejects.toThrowError();
  });

  // deploy contract
  let contract;
  let contractAddress;
  let readValue;
  describe("interaction with contract", () => {
    beforeAll(async () => {
      const receipt = await node1Client.priv
        .generateAndSendRawTransaction({
          data: `0x${contracts.eventEmitter.bytecode}`,
          privateFrom: orion.node1.publicKey,
          privacyGroupId,
          privateKey: network.node1.privateKey,
        })
        .then((hash) => {
          console.log("hash: ", hash);
          return node1Client.priv.waitForTransactionReceipt(hash);
        });

      ({ contractAddress } = receipt);
      contract = new node1Client.eth.Contract(contracts.eventEmitter.abi);

      // Read
      readValue = async (node) => {
        const raw = await node.priv.call(privacyGroupId, {
          to: contractAddress,
          data: contract.methods.value().encodeABI(),
        });

        return node.eth.abi.decodeParameter("uint256", raw);
      };
    });

    it("creating node should be able to read from the contract", async () => {
      console.log(readValue, typeof readValue);
      const value = await readValue(node1Client);
      expect(value).toEqual("0");

      const rawSender = await node1Client.priv.call(privacyGroupId, {
        to: contractAddress,
        data: contract.methods.value().encodeABI(),
      });
      const sender = node1Client.eth.abi.decodeParameter("address", rawSender);
      expect(sender).toEqual("0x0000000000000000000000000000000000000000");
    });

    it("member node should be able to read from the contract", async () => {
      const value = await readValue(node2Client);
      expect(value).toEqual("0");
    });

    // NOTE: this is really a node that has never been a memberonly
    it("non-member node should NOT be able to read from the contract", async () => {
      await expect(readValue(node3Client)).rejects.toThrowError();
    });

    // Write
    const writeValue = async (node, enclaveKey, privateKey, value) => {
      return node.priv
        .generateAndSendRawTransaction({
          to: contractAddress,
          data: contract.methods.store([value]).encodeABI(),
          privateFrom: enclaveKey,
          privacyGroupId,
          privateKey,
        })
        .then((transactionHash) => {
          return node.priv.waitForTransactionReceipt(transactionHash);
        });
    };

    it("creating node should be able to write to the contract", async () => {
      const result = await writeValue(
        node1Client,
        orion.node1.publicKey,
        network.node1.privateKey,
        1
      );
      expect(result.status).toEqual("0x1");
    });

    it("member node should be able to write to the contract", async () => {
      const result = await writeValue(
        node2Client,
        orion.node2.publicKey,
        network.node2.privateKey,
        2
      );
      expect(result.status).toEqual("0x1");
    });

    it("non-member node should NOT be able to write to the contract", async () => {
      await expect(
        writeValue(
          node3Client,
          orion.node3.publicKey,
          network.node3.privateKey,
          3
        )
      ).rejects.toThrowError();
    });
  });

  // Remove
  describe("removeFromPrivacyGroup", () => {
    it("should remove a node from the privacy group", async () => {
      const removeReceipt = await node1Client.eth.flexiblePrivacyGroup.removeFrom(
        {
          ...privacyOptions,
          participant: orion.node2.publicKey,
        }
      );
      expect(removeReceipt.status).toEqual("0x1");
    });

    it("removed node should not see contract updates", async () => {
      // member node updates contract
      const newValue = 4;

      const updateReceipt = await node1Client.priv
        .generateAndSendRawTransaction({
          to: contractAddress,
          data: contract.methods.store([newValue]).encodeABI(),
          privateFrom: orion.node1.publicKey,
          privacyGroupId,
          privateKey: network.node1.privateKey,
        })
        .then((transactionHash) => {
          return node1Client.priv.waitForTransactionReceipt(transactionHash);
        });
      expect(updateReceipt.status).toEqual("0x1");

      // read from member
      const rawValue1 = await node1Client.priv.call(privacyGroupId, {
        to: contractAddress,
        data: contract.methods.value().encodeABI(),
      });
      const value1 = node1Client.eth.abi.decodeParameter("uint256", rawValue1);
      expect(value1).toEqual(newValue.toString());

      // read from removed node
      const rawValue = await node2Client.priv.call(privacyGroupId, {
        to: contractAddress,
        data: contract.methods.value().encodeABI(),
      });
      const value = node2Client.eth.abi.decodeParameter("uint256", rawValue);
      expect(value).toEqual("2");
    });

    it("removed node should not find the privacy group", async () => {
      const result = await node2Client.eth.flexiblePrivacyGroup.findOnChainPrivacyGroup(
        [orion.node2.publicKey]
      );
      expect(result).toHaveLength(0);
    });
  });
});
