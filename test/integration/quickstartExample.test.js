const deployContract = require("../../example/multiNodeExample/deployContract");
const node1Example = require("../../example/multiNodeExample/storeValueFromNode1");
const node2Example = require("../../example/multiNodeExample/storeValueFromNode2");

describe("[MultiNodeExample]: Can run quickstart", () => {
  it("deploy contract", async () => {
    const contractAddress = await deployContract();
    expect(contractAddress).toEqual(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
  });

  it("store and gets from node 1", async () => {
    const result = await node1Example.storeValueFromNode1(
      "0xebf56429e6500e84442467292183d4d621359838",
      1000
    );
    expect(result.logs[0].data).toEqual(
      "0x000000000000000000000000fe3b557e8fb62b89f4916b721be55ceb828dbd7300000000000000000000000000000000000000000000000000000000000003e8"
    );

    const getNode1 = await node1Example.getValueFromNode1(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
    expect(getNode1.output).toEqual(
      "0x00000000000000000000000000000000000000000000000000000000000003e8"
    );

    const getNode2 = await node1Example.getValueFromNode2(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
    expect(getNode2.output).toEqual(
      "0x00000000000000000000000000000000000000000000000000000000000003e8"
    );

    const getNode3 = await node1Example.getValueFromNode3(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
    expect(getNode3.output).toEqual("0x");
  });

  it("store and gets from node 2", async () => {
    const result = await node2Example.storeValueFromNode2(
      "0xebf56429e6500e84442467292183d4d621359838",
      42
    );
    expect(result.logs[0].data).toEqual(
      "0x000000000000000000000000627306090abab3a6e1400e9345bc60c78a8bef57000000000000000000000000000000000000000000000000000000000000002a"
    );

    const getNode1 = await node2Example.getValueFromNode1(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
    expect(getNode1.output).toEqual(
      "0x000000000000000000000000000000000000000000000000000000000000002a"
    );

    const getNode2 = await node2Example.getValueFromNode2(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
    expect(getNode2.output).toEqual(
      "0x000000000000000000000000000000000000000000000000000000000000002a"
    );

    const getNode3 = await node2Example.getValueFromNode3(
      "0xebf56429e6500e84442467292183d4d621359838"
    );
    expect(getNode3.output).toEqual("0x");
  });
});
