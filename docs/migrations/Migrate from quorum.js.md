### MIGRATION FROM quorum.js to web3js-quorum

## eth namespace
| quorum.js                             | web3js-quorum                       | changes   |
|---------------------------------------|-------------------------------------|-----------|
| quorum.eth.sendRawPrivateTransaction  | web3.eth.sendRawPrivateTransaction  | namespace |
| quorum.eth.storageRoot                | web3.eth.storageRoot                | namespace |
| quorum.eth.getQuorumPayload           | web3.eth.getQuorumPayload           | namespace |
| quorum.eth.getContractPrivacyMetadata | web3.eth.getContractPrivacyMetadata | namespace |


## istanbul namespace
| quorum.js                                 | web3js-quorum                           | changes   |
|-------------------------------------------|-----------------------------------------|-----------|
| quorum.istanbul.discard                   | web3.istanbul.discard                   | namespace |
| quorum.istanbul.propose                   | web3.istanbul.propose                   | namespace |
| quorum.istanbul.getValidatorsAtHash       | web3.istanbul.getValidatorsAtHash       | namespace |
| quorum.istanbul.getValidators             | web3.istanbul.getValidators             | namespace |
| quorum.istanbul.candidates                | web3.istanbul.candidates                | namespace |
| quorum.istanbul.getSnapshot               | web3.istanbul.getSnapshot               | namespace |
| quorum.istanbul.getSnapshotAtHash         | web3.istanbul.getSnapshotAtHash         | namespace |
| quorum.istanbul.nodeAddress               | web3.istanbul.nodeAddress               | namespace |
| quorum.istanbul.getSignersFromBlock       | web3.istanbul.getSignersFromBlock       | namespace |
| quorum.istanbul.getSignersFromBlockByHash | web3.istanbul.getSignersFromBlockByHash | namespace |

## permission namespace
| quorum.js                                                 | web3js-quorum                                     | changes   |
|-----------------------------------------------------------|---------------------------------------------------|-----------|
| quorum.quorumPermission.orgList                           | web3.permission.orgList                           | namespace |
| quorum.quorumPermission.acctList                          | web3.permission.acctList                          | namespace |
| quorum.quorumPermission.nodeList                          | web3.permission.nodeList                          | namespace |
| quorum.quorumPermission.roleList                          | web3.permission.roleList                          | namespace |
| quorum.quorumPermission.getOrgDetails                     | web3.permission.getOrgDetails                     | namespace |
| quorum.quorumPermission.addOrg                            | web3.permission.addOrg                            | namespace |
| quorum.quorumPermission.approveOrg                        | web3.permission.approveOrg                        | namespace |
| quorum.quorumPermission.updateOrgStatus                   | web3.permission.updateOrgStatus                   | namespace |
| quorum.quorumPermission.approveOrgStatus                  | web3.permission.approveOrgStatus                  | namespace |
| quorum.quorumPermission.addSubOrg                         | web3.permission.addSubOrg                         | namespace |
| quorum.quorumPermission.addNewRole                        | web3.permission.addNewRole                        | namespace |
| quorum.quorumPermission.removeRole                        | web3.permission.removeRole                        | namespace |
| quorum.quorumPermission.addAccountToOrg                   | web3.permission.addAccountToOrg                   | namespace |
| quorum.quorumPermission.changeAccountRole                 | web3.permission.changeAccountRole                 | namespace |
| quorum.quorumPermission.updateAccountStatus               | web3.permission.updateAccountStatus               | namespace |
| quorum.quorumPermission.recoverBlackListedAccount         | web3.permission.recoverBlackListedAccount         | namespace |
| quorum.quorumPermission.approveBlackListedAccountRecovery | web3.permission.approveBlackListedAccountRecovery | namespace |
| quorum.quorumPermission.assignAdminRole                   | web3.permission.assignAdminRole                   | namespace |
| quorum.quorumPermission.approveAdminRole                  | web3.permission.approveAdminRole                  | namespace |
| quorum.quorumPermission.addNode                           | web3.permission.addNode                           | namespace |
| quorum.quorumPermission.updateNodeStatus                  | web3.permission.updateNodeStatus                  | namespace |
| quorum.quorumPermission.recoverBlackListedNode            | web3.permission.recoverBlackListedNode            | namespace |
| quorum.quorumPermission.approveBlackListedNodeRecovery    | web3.permission.approveBlackListedNodeRecovery    | namespace |

## raft namespace
| quorum.js                 | web3js-quorum           | changes                     |
|---------------------------|-------------------------|-----------------------------|
| quorum.raft.cluster       | web3.raft.cluster       | namespace                   |
| quorum.raft.getRole       | web3.raft.role          | namespace and function name |
| quorum.raft.leader        | web3.raft.leader        | namespace                   |
| quorum.raft.addPeer       | web3.raft.addPeer       | namespace                   |
| quorum.raft.removePeer    | web3.raft.removePeer    | namespace                   |
| quorum.raft.addLearner    | web3.raft.addLearner    | namespace                   |
| quorum.raft.promoteToPeer | web3.raft.promoteToPeer | namespace                   |

## Raw transaction manager namespace
| quorum.js                                          | web3js-quorum                           | changes                     |
|----------------------------------------------------|-----------------------------------------|-----------------------------|
| RawTransactionManager.sendRawTransactionViaSendAPI | web3.ptm.send                           | namespace and function name |
| RawTransactionManager.storeRawRequest              | web3.ptm.storeRaw                       | namespace and function name |
| RawTransactionManager.sendRawTransaction           | web3.priv.generateAndSendRawTransaction | namespace and function name |
| RawTransactionManager.setPrivate                   | web3.utils.setPrivate                   | namespace                   |
| RawTransactionManager.sendRawRequest               | -                                       |                             |