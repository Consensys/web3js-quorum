/**
 * @typedef raftClusterDetails
 * @property {String}  hostName: DNS name or the host IP address
 * @property {Boolean} nodeActive: true if the node is active in Raft cluster else false
 * @property {String}  nodeId: enode id of the node
 * @property {Number}  p2pPort: p2p port
 * @property {Number}  raftId: Raft id of the node
 * @property {Number}  raftPort: Raft port
 * @property {String}  role: role of the node in Raft GoQuorum. Can be minter/ verifier/ learner. In case there is no leader at network level it will be returned as ""
 */
