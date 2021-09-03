const Web3 = require("web3");
const Web3Quorum = require("../src");

const { contracts, ContractFactory } = require("./support/helpers");
const { network, enclave } = require("./support/keys");

describe("getLogs", () => {
  const node1Client = new Web3Quorum(new Web3(network.node1.url));
  const node2Client = new Web3Quorum(new Web3(network.node2.url));
  const node3Client = new Web3Quorum(new Web3(network.node3.url));

  // deploy contract
  const factory = new ContractFactory(
    contracts.eventEmitter.bytecode,
    contracts.eventEmitter.abi
  );
  const logCount = 4;
  let privacyGroupId;
  let contract2Address;
  let send4Receipt;
  let contract1Address;
  let send2Receipt;
  let deployReceipt;
  beforeAll(async () => {
    // create privacy group
    privacyGroupId = await node1Client.priv.createPrivacyGroup({
      addresses: [enclave.node1.publicKey, enclave.node2.publicKey],
      name: "",
      description: "Nodes 1 and 2",
    });
    await factory.connect(
      node1Client,
      { enclaveKey: enclave.node1.publicKey, privacyGroupId },
      network.node1.privateKey
    );

    const contract = await factory.privateDeploy(privacyGroupId);
    ({ deployReceipt } = contract);
    contract1Address = deployReceipt.contractAddress;
    console.log(deployReceipt);

    // send some transactions from member 1
    await contract.send("store", [1]);
    send2Receipt = await contract.send("store", [2]);

    // send some transactions from member 2
    await factory.connect(
      node2Client,
      { enclaveKey: enclave.node2.publicKey, privacyGroupId },
      network.node2.privateKey
    );

    await contract.send("store", [3]);
    // deploy another contract
    await factory.connect(
      node1Client,
      { enclaveKey: enclave.node1.publicKey, privacyGroupId },
      network.node1.privateKey
    );
    const contract2 = await factory.privateDeploy(privacyGroupId);
    const { deployReceipt: deployReceipt2 } = contract2;
    contract2Address = deployReceipt2.contractAddress;
    console.log(deployReceipt2);

    // send a transaction to the second contract
    send4Receipt = await contract2.send("store", [4]);
  });

  describe("accessibility", () => {
    it("creator should get logs", async () => {
      const logs = await node1Client.priv.getLogs(privacyGroupId, {});
      expect(logs).toHaveLength(logCount);
    });

    it("member should get logs", async () => {
      const logs = await node2Client.priv.getLogs(privacyGroupId, {});
      expect(logs).toHaveLength(logCount);
    });

    it("non-member should not get logs", async () => {
      const logs = await node3Client.priv.getLogs(privacyGroupId, {});
      expect(logs).toHaveLength(0);
    });
  });

  describe("filters", () => {
    it("should get logs by address", async () => {
      const logs1 = await node1Client.priv.getLogs(privacyGroupId, {
        address: contract1Address,
      });
      expect(logs1).toHaveLength(3);

      const logs2 = await node1Client.priv.getLogs(privacyGroupId, {
        address: contract2Address,
      });
      expect(logs2).toHaveLength(1);
    });

    it("should get logs to a given block number", async () => {
      const logs1 = await node1Client.priv.getLogs(privacyGroupId, {
        toBlock: deployReceipt.blockNumber,
      });
      expect(logs1).toHaveLength(0);

      const logs2 = await node1Client.priv.getLogs(privacyGroupId, {
        toBlock: send2Receipt.blockNumber,
      });
      expect(logs2).toHaveLength(2);

      const logs4 = await node1Client.priv.getLogs(privacyGroupId, {
        toBlock: send4Receipt.blockNumber,
      });
      expect(logs4).toHaveLength(4);
    });

    it("should get logs from a given block number", async () => {
      const logs1 = await node1Client.priv.getLogs(privacyGroupId, {
        fromBlock: deployReceipt.blockNumber,
      });
      expect(logs1).toHaveLength(4);

      // skip 1
      const logs2 = await node1Client.priv.getLogs(privacyGroupId, {
        fromBlock: send2Receipt.blockNumber,
      });
      expect(logs2).toHaveLength(3);

      // skip 3
      const logs4 = await node1Client.priv.getLogs(privacyGroupId, {
        fromBlock: send4Receipt.blockNumber,
      });
      expect(logs4).toHaveLength(1);
    });

    it("should get logs by topic", async () => {
      factory.contract._address = contract1Address;
      const filter = factory.contract.events.stored({});
      const { topics } = filter.arguments[0];

      const logs1 = await node1Client.priv.getLogs(privacyGroupId, {
        topics,
      });
      expect(logs1).toHaveLength(4);
    });
  });
});
