const Web3 = require("web3");
const Web3Quorum = require("../src/index");
const { mockHttpPost, resetMock } = require("./tests-utils/httpMock");
const { URL } = require("./tests-utils/constants");

describe("web3.raft", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  afterEach(() => {
    resetMock();
  });

  describe.each(["cluster", "role", "leader"])("raft", (method) => {
    it(`should call raft_${method}`, async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.raft[method]();

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual(`raft_${method}`);
      expect(request.params).toEqual([]);
    });
  });

  describe.each(["addPeer", "removePeer", "addLearner", "promoteToPeer"])(
    "raft",
    (method) => {
      it(`should call raft_${method}`, async () => {
        let request;
        mockHttpPost((data) => {
          request = data;
        });

        await web3.raft[method]("param");

        expect(request.jsonrpc).toEqual("2.0");
        expect(request.method).toEqual(`raft_${method}`);
        expect(request.params).toEqual(["param"]);
      });

      it(`throw error when call raft_${method} with no param`, async () => {
        await expect(() => {
          return web3.raft[method]();
        }).toThrow("Invalid number of parameters");
      });
    }
  );
});
