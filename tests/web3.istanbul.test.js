const Web3 = require("web3");
const Web3Quorum = require("../src/index");
const { mockHttpPost, resetMock } = require("./tests-utils/httpMock");
const { URL } = require("./tests-utils/constants");

describe("web3.istanbul", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  afterEach(() => {
    resetMock();
  });

  describe.each(["candidates", "nodeAddress"])("istanbul", (method) => {
    it(`should call istanbul_${method}`, async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.istanbul[method]();

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual(`istanbul_${method}`);
      expect(request.params).toEqual([]);
    });
  });

  describe.each([
    "discard",
    "getSnapshotAtHash",
    "getValidatorsAtHash",
    "getSignersFromBlockByHash",
  ])("istanbul", (method) => {
    it(`should call istanbul_${method}`, async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.istanbul[method]("0x123");

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual(`istanbul_${method}`);
      expect(request.params).toEqual(["0x123"]);
    });

    it(`throw error when call istanbul_${method} with no param`, async () => {
      await expect(() => {
        return web3.istanbul[method]();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe.each(["getSnapshot", "getValidators", "isValidator"])(
    "istanbul",
    (method) => {
      it(`should call istanbul_${method}`, async () => {
        let request;
        mockHttpPost((data) => {
          request = data;
        });

        await web3.istanbul[method](123);

        expect(request.jsonrpc).toEqual("2.0");
        expect(request.method).toEqual(`istanbul_${method}`);
        expect(request.params).toEqual(["0x7b"]);
      });

      it(`should call istanbul_${method} with latest as block number`, async () => {
        let request;
        mockHttpPost((data) => {
          request = data;
        });

        await web3.istanbul[method]();

        expect(request.jsonrpc).toEqual("2.0");
        expect(request.method).toEqual(`istanbul_${method}`);
        expect(request.params).toEqual(["latest"]);
      });
    }
  );

  it(`should call istanbul_getSignersFromBlock`, async () => {
    let request;
    mockHttpPost((data) => {
      request = data;
    });

    await web3.istanbul.getSignersFromBlock(123);

    expect(request.jsonrpc).toEqual("2.0");
    expect(request.method).toEqual(`istanbul_getSignersFromBlock`);
    expect(request.params).toEqual(["0x7b"]);
  });
});
