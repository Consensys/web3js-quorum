const extend = function (web3, apis) {
  let allApis = false;

  if (!apis) {
    allApis = true;
  }

  // eslint-disable-next-line
  web3.quorum = {};

  if (allApis || apis.includes("istanbul")) {
    const methods = [
      {
        name: "getSnapshot",
        call: "istanbul_getSnapshot",
        params: 1,
      },
      {
        name: "getSnapshotAtHash",
        call: "istanbul_getSnapshotAtHash",
        params: 1,
      },
      {
        name: "getValidators",
        call: "istanbul_getValidators",
        params: 1,
      },
      {
        name: "getValidatorsAtHash",
        call: "istanbul_getValidatorsAtHash",
        params: 1,
      },
      {
        name: "propose",
        call: "istanbul_propose",
        params: 2,
      },
      {
        name: "discard",
        call: "istanbul_discard",
        params: 1,
      },
      {
        name: "getSignersFromBlock",
        call: "istanbul_getSignersFromBlock",
        params: 1,
        inputFormatter: [web3.extend.formatters.inputBlockNumberFormatter],
      },
      {
        name: "getSignersFromBlockByHash",
        call: "istanbul_getSignersFromBlockByHash",
        params: 1,
      },
      {
        name: "candidates",
        call: "istanbul_candidates",
        params: 0,
      },
      {
        name: "nodeAddress",
        call: "istanbul_nodeAddress",
        params: 0,
      },
    ];

    web3.extend({
      property: "istanbul",
      methods,
    });

    // eslint-disable-next-line
    web3.quorum.istanbul = web3.istanbul;
  }

  if (allApis || apis.includes("quorumPermission")) {
    const methods = [
      {
        name: "addOrg",
        call: "quorumPermission_addOrg",
        params: 4,
      },
      {
        name: "approveOrg",
        call: "quorumPermission_approveOrg",
        params: 4,
      },
      {
        name: "addSubOrg",
        call: "quorumPermission_addSubOrg",
        params: 4,
      },
      {
        name: "updateOrgStatus",
        call: "quorumPermission_updateOrgStatus",
        params: 3,
      },
      {
        name: "approveOrgStatus",
        call: "quorumPermission_approveOrgStatus",
        params: 3,
      },
      {
        name: "addNode",
        call: "quorumPermission_addNode",
        params: 3,
      },
      {
        name: "updateNodeStatus",
        call: "quorumPermission_updateNodeStatus",
        params: 4,
      },
      {
        name: "assignAdminRole",
        call: "quorumPermission_assignAdminRole",
        params: 4,
      },
      {
        name: "approveAdminRole",
        call: "quorumPermission_approveAdminRole",
        params: 3,
      },
      {
        name: "addNewRole",
        call: "quorumPermission_addNewRole",
        params: 6,
      },
      {
        name: "removeRole",
        call: "quorumPermission_removeRole",
        params: 3,
      },
      {
        name: "addAccountToOrg",
        call: "quorumPermission_addAccountToOrg",
        params: 4,
      },
      {
        name: "changeAccountRole",
        call: "quorumPermission_changeAccountRole",
        params: 4,
      },
      {
        name: "updateAccountStatus",
        call: "quorumPermission_updateAccountStatus",
        params: 4,
      },
      {
        name: "recoverBlackListedNode",
        call: "quorumPermission_recoverBlackListedNode",
        params: 3,
      },
      {
        name: "approveBlackListedNodeRecovery",
        call: "quorumPermission_approveBlackListedNodeRecovery",
        params: 3,
      },
      {
        name: "recoverBlackListedAccount",
        call: "quorumPermission_recoverBlackListedAccount",
        params: 3,
      },
      {
        name: "approveBlackListedAccountRecovery",
        call: "quorumPermission_approveBlackListedAccountRecovery",
        params: 3,
      },
      {
        name: "getOrgDetails",
        call: "quorumPermission_getOrgDetails",
        params: 1,
      },
      {
        name: "orgList",
        call: "quorumPermission_orgList",
        params: 0,
      },
      {
        name: "nodeList",
        call: "quorumPermission_nodeList",
        params: 0,
      },
      {
        name: "roleList",
        call: "quorumPermission_roleList",
        params: 0,
      },
      {
        name: "acctList",
        call: "quorumPermission_acctList",
        params: 0,
      },
    ];

    web3.extend({
      property: "quorumPermission",
      methods,
    });

    web3.quorum.quorumPermission = web3.quorumPermission;
  }
};

module.exports = {
  extend,
};
