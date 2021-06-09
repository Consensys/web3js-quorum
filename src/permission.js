/**
 * For more details about the {@link https://docs.goquorum.consensys.net/en/stable/Reference/APIs/PermissioningAPIs/ Quorum permissions JSON-RPC APIs}
 * @module Permission
 */
function Permission(web3) {
  web3.extend({
    property: "permission",
    methods: [
      /**
       * @function orgList
       * @return {Object[]} The list of all organizations with the status of each organization in the network
       */
      {
        name: "orgList",
        call: "quorumPermission_orgList",
        params: 0,
      },
      /**
       * @function acctList
       * @return {Object[]} The list of accounts permissioned in the network
       */
      {
        name: "acctList",
        call: "quorumPermission_acctList",
        params: 0,
      },
      /**
       * @function nodeList
       * @return {Object[]} The list of nodes permissioned in the network
       */
      {
        name: "nodeList",
        call: "quorumPermission_nodeList",
        params: 0,
      },
      /**
       * @function roleList
       * @return {Object[]} The list of roles in the network
       */
      {
        name: "roleList",
        call: "quorumPermission_roleList",
        params: 0,
      },
      /**
       * @function getOrgDetails
       * @param {String} orgId org or sub org id
       * @return {Object[]} The list of accounts, nodes, roles, and sub organizations linked to an organization
       */
      {
        name: "getOrgDetails",
        call: "quorumPermission_getOrgDetails",
        params: 1,
      },
      /**
       * @function addOrg
       * @param {String} orgId      unique org identfier
       * @param {String} enodeId    complete enode id
       * @param {String} accountId  account which will be the org admin account
       * @return {String} response message
       */
      {
        name: "addOrg",
        call: "quorumPermission_addOrg",
        params: 3,
      },
      /**
       * @function approveOrg
       * @param {String} orgId      unique org identfier
       * @param {String} enodeId    complete enode id
       * @param {String} accountId  account which will be the org admin account
       * @return {String} response message
       */
      {
        name: "approveOrg",
        call: "quorumPermission_approveOrg",
        params: 3,
      },
      /**
       * @function updateOrgStatus
       * @param {String} orgId
       * @param {Number} action 1 - for suspending a org, 2 - for activating a suspended organization
       * @return {String} response message
       */
      {
        name: "updateOrgStatus",
        call: "quorumPermission_updateOrgStatus",
        params: 2,
      },
      /**
       * @function approveOrgStatus
       * @param {String} orgId
       * @param {Number} action 1 - for approving org suspension, 2 - for approving activation of suspended org
       * @return {String} response message
       */
      {
        name: "approveOrgStatus",
        call: "quorumPermission_approveOrgStatus",
        params: 2,
      },
      /**
       * @function addSubOrg
       * @param {String} parentOrgId: parent org id
       * @param {String} subOrgId: sub org identifier
       * @param {String} enodeId: complete enode id of the node linked to the sub org id
       * @return {String} response message
       */
      {
        name: "addSubOrg",
        call: "quorumPermission_addSubOrg",
        params: 3,
      },
      /**
       * @function addNewRole
       * @param {String} orgId org id for which the role is being created
       * @param {String} roleId unique role identifier
       * @param {String} accountAccess account level access. Refer for complete list
       * @param {Boolean} isVoter bool indicates if its a voting role
       * @param {Boolean} isAdminRole bool indicates if its an admin role
       * @return {String} response message
       */
      {
        name: "addNewRole",
        call: "quorumPermission_addNewRole",
        params: 5,
      },
      /**
       * @function removeRole
       * @param {String} orgId org or sub org id to which the role belongs
       * @param {String} roleId role id
       * @return {String} response message
       */
      {
        name: "removeRole",
        call: "quorumPermission_removeRole",
        params: 2,
      },
      /**
       * @function addAccountToOrg
       * @param {String} acctId org or sub org id to which the role belongs
       * @param {String} orgId org id
       * @param {String} roleId role id
       * @return {String} response message
       */
      {
        name: "addAccountToOrg",
        call: "quorumPermission_addAccountToOrg",
        params: 3,
      },
      /**
       * @function changeAccountRole
       * @param {String} acctId account id
       * @param {String} orgId org id
       * @param {String} roleId new role id to be assigned to the account
       * @return {String} response message
       */
      {
        name: "changeAccountRole",
        call: "quorumPermission_changeAccountRole",
        params: 3,
      },
      /**
       * @function updateAccountStatus
       * @param {String} orgId org id
       * @param {String} acctId org or sub org id to which the role belongs
       * @param {String} action 1 - for suspending the account, 2 - for activating a suspended account, 3 - for blacklisting an account
       * @return {String} response message
       */
      {
        name: "updateAccountStatus",
        call: "quorumPermission_updateAccountStatus",
        params: 3,
      },
      /**
       * @function recoverBlackListedAccount
       * @param {String} orgId org or sub org id to which the node belongs
       * @param {String} acctId blacklisted account id
       * @return {String} response message
       */
      {
        name: "recoverBlackListedAccount",
        call: "quorumPermission_recoverBlackListedAccount",
        params: 2,
      },
      /**
       * @function approveBlackListedAccountRecovery
       * @param {String} orgId org or sub org id to which the node belongs
       * @param {String} acctId blacklisted account id
       * @return {String} response message
       */
      {
        name: "approveBlackListedAccountRecovery",
        call: "quorumPermission_approveBlackListedAccountRecovery",
        params: 2,
      },
      /**
       * @function assignAdminRole
       * @param {String} orgId org id to which the account belongs
       * @param {String} acctId account id
       * @param {String} roleId new role id to be assigned to the account. This can be the network admin role or org admin role only
       * @return {}
       */
      {
        name: "assignAdminRole",
        call: "quorumPermission_assignAdminRole",
        params: 3,
      },
      /**
       * @function approveAdminRole
       * @param {String} orgId org or sub org id to which the node belongs
       * @param {String} acctId blacklisted account id
       * @return {String} response message
       */
      {
        name: "approveAdminRole",
        call: "quorumPermission_approveAdminRole",
        params: 2,
      },
      /**
       * @function addNode
       * @param {String} orgId org or sub org id to which the node belongs
       * @param {String} enodeId complete enode id
       * @return {String} response message
       */
      {
        name: "addNode",
        call: "quorumPermission_addNode",
        params: 2,
      },
      /**
       * @function updateNodeStatus
       * @param {String} orgId org id
       * @param {String} enodeId complete enode id
       * @param {String} action 1 - for deactivating the node, 2 - for activating a deactivated node, 3 - for blacklisting a node
       * @return {String} response message
       */
      {
        name: "updateNodeStatus",
        call: "quorumPermission_updateNodeStatus",
        params: 3,
      },
      /**
       * @function recoverBlackListedNode
       * @param {String} orgId org or sub org id to which the node belongs
       * @param {String} enodeId complete enode id
       * @return {String} response message
       */
      {
        name: "recoverBlackListedNode",
        call: "quorumPermission_recoverBlackListedNode",
        params: 2,
      },
      /**
       * @function approveBlackListedNodeRecovery
       * @param {String} orgId org or sub org id to which the node belongs
       * @param {String} enodeId complete enode id
       * @return {String} response message
       */
      {
        name: "approveBlackListedNodeRecovery",
        call: "quorumPermission_approveBlackListedNodeRecovery",
        params: 3,
      },
      /**
       * @function transactionAllowed
       * @param {Object} txArgs: transaction arguments object
       * @return {Boolean} status indicating if transaction is allowed or not
       */
      {
        name: "transactionAllowed",
        call: "quorumPermission_transactionAllowed",
        params: 1,
      },
      /**
       * @function connectionAllowed
       * @param {String} enodeId enode id
       * @param {String} ipAddress IP address of the node
       * @param {Number} portNum port number
       * @return {Boolean} status indicating if connection is allowed or not
       */
      {
        name: "connectionAllowed",
        call: "quorumPermission_connectionAllowed",
        params: 3,
      },
    ],
  });
  return web3;
}

module.exports = Permission;
