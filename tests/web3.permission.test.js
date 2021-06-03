const Web3 = require("web3");
const Web3Quorum = require("../src/index");
const { mockHttpPost, resetMock } = require("./tests-utils/httpMock");
const { URL } = require("./tests-utils/constants");

describe("web3.permission", () => {
  const web3 = new Web3Quorum(new Web3(URL));

  afterEach(() => {
    resetMock();
  });

  describe.each(["orgList", "acctList", "nodeList", "roleList"])(
    "permission",
    (method) => {
      it(`should call quorumPermission_${method}`, async () => {
        let request;
        mockHttpPost((data) => {
          request = data;
        });

        await web3.permission[method]();

        expect(request.jsonrpc).toEqual("2.0");
        expect(request.method).toEqual(`quorumPermission_${method}`);
        expect(request.params).toEqual([]);
      });
    }
  );

  describe.each([
    "updateOrgStatus",
    "approveOrgStatus",
    "removeRole",
    "recoverBlackListedAccount",
    "approveBlackListedAccountRecovery",
    "approveAdminRole",
    "addNode",
    "recoverBlackListedNode",
  ])("permission", (method) => {
    it(`should call quorumPermission_${method}`, async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.permission[method]("param", "param2");

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual(`quorumPermission_${method}`);
      expect(request.params).toEqual(["param", "param2"]);
    });

    it(`throw error when call quorumPermission_${method} with no param`, async () => {
      await expect(() => {
        return web3.permission[method]();
      }).toThrow("Invalid number of parameters");
    });
  });

  describe.each([
    "addOrg",
    "approveOrg",
    "addSubOrg",
    "addAccountToOrg",
    "changeAccountRole",
    "updateAccountStatus",
    "assignAdminRole",
    "updateNodeStatus",
    "approveBlackListedNodeRecovery",
    "connectionAllowed",
  ])("permission", (method) => {
    it(`should call quorumPermission_${method}`, async () => {
      let request;
      mockHttpPost((data) => {
        request = data;
      });

      await web3.permission[method]("param", "param2", "param3");

      expect(request.jsonrpc).toEqual("2.0");
      expect(request.method).toEqual(`quorumPermission_${method}`);
      expect(request.params).toEqual(["param", "param2", "param3"]);
    });

    it(`throw error when call quorumPermission_${method} with no param`, async () => {
      await expect(() => {
        return web3.permission[method]();
      }).toThrow("Invalid number of parameters");
    });
  });

  it(`should call quorumPermission_getOrgDetails`, async () => {
    let request;
    mockHttpPost((data) => {
      request = data;
    });

    await web3.permission.getOrgDetails("123");

    expect(request.jsonrpc).toEqual("2.0");
    expect(request.method).toEqual(`quorumPermission_getOrgDetails`);
    expect(request.params).toEqual(["123"]);
  });

  it(`should call quorumPermission_transactionAllowed`, async () => {
    let request;
    mockHttpPost((data) => {
      request = data;
    });

    await web3.permission.transactionAllowed({});

    expect(request.jsonrpc).toEqual("2.0");
    expect(request.method).toEqual(`quorumPermission_transactionAllowed`);
    expect(request.params).toEqual([{}]);
  });

  it(`should call quorumPermission_addNewRole`, async () => {
    let request;
    mockHttpPost((data) => {
      request = data;
    });

    await web3.permission.addNewRole(
      "param",
      "param2",
      "param3",
      "param4",
      "param5"
    );

    expect(request.jsonrpc).toEqual("2.0");
    expect(request.method).toEqual(`quorumPermission_addNewRole`);
    expect(request.params).toEqual([
      "param",
      "param2",
      "param3",
      "param4",
      "param5",
    ]);
  });

  it(`throw error when call quorumPermission_addNewRole with no param`, async () => {
    await expect(() => {
      return web3.permission.addNewRole();
    }).toThrow("Invalid number of parameters");
  });
});
