const rp = require("request-promise-native");

jest.mock("request-promise-native");
const Ptm = require("./ptm");

describe("Private Transaction Manager", () => {
  const privateUrl = "https://localhost:22000";
  const web3 = new Ptm({}, { privateUrl });
  rp.mockResolvedValue({
    key: "asdasd",
  });

  it("should use the ipcPath passed", async () => {
    const { ptm } = new Ptm(
      {},
      {
        ipcPath: "tm.ipc",
      }
    );
    await ptm.upCheck("payload", "from", "to");

    expect(rp).toBeCalledWith({
      method: "GET",
      uri: "http://unix:tm.ipc:/upcheck",
    });
  });

  it("should use the privateUrl passed", async () => {
    const { ptm } = new Ptm(
      {},
      {
        privateUrl,
      }
    );
    await ptm.upCheck("payload", "from", "to");

    expect(rp).toBeCalledWith({
      method: "GET",
      uri: `${privateUrl}/upcheck`,
    });
  });

  it("should use the tlsSettings passed", async () => {
    const { ptm } = new Ptm(
      {},
      {
        privateUrl,
        tlsSettings: {
          key: "key",
          cacert: "cacert",
        },
      }
    );
    await ptm.upCheck("payload", "from", "to");

    expect(rp).toBeCalledWith({
      method: "GET",
      uri: `${privateUrl}/upcheck`,
      clientKey: "key",
      ca: "cacert",
    });
  });

  it("should call send api with the right payload", async () => {
    await web3.ptm.send({
      data: "0x123123123",
      privateFrom: "from",
      privateFor: "to",
    });

    expect(rp).toBeCalledWith({
      body: { from: "from", payload: "EjEjEg==", to: "to" },
      json: true,
      method: "POST",
      uri: `${privateUrl}/send`,
    });
  });

  it("should call storeRaw api with the right payload", async () => {
    await web3.ptm.storeRaw({
      data: "0x123123123",
      privateFrom: "from",
    });

    expect(rp).toBeCalledWith({
      body: { from: "from", payload: "EjEjEg==" },
      json: true,
      method: "POST",
      uri: `${privateUrl}/storeraw`,
    });
  });

  it("should call keys api", async () => {
    await web3.ptm.keys();

    expect(rp).toBeCalledWith({
      method: "GET",
      uri: `${privateUrl}/keys`,
    });
  });

  it("should call party info keys api", async () => {
    await web3.ptm.partyInfoKeys();

    expect(rp).toBeCalledWith({
      method: "GET",
      uri: `${privateUrl}/partyinfo/keys`,
    });
  });

  it("should call up-check api", async () => {
    await web3.ptm.upCheck();

    expect(rp).toBeCalledWith({
      method: "GET",
      uri: `${privateUrl}/upcheck`,
    });
  });
});
