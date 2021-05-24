const httpConfig = require("./helpers/httpConfig");
const ipcConfig = require("./helpers/ipcConfig");

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
  const { web3 } = testCase.config;

  describe(`${testCase.name}`, () => {
    it("can connect to upcheck", async () => {
      const data = await web3.ptm.upCheck();

      expect(data).toEqual("I'm up!");
    });
  });
});
