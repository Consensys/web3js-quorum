/**
 * For more details about the {@link https://docs.goquorum.consensys.net/en/stable/Reference/Consensus/Raft-RPC-API raft JSON-RPC APIs}
 * @module Raft
 */
function Raft(web3) {
  web3.extend({
    property: "raft",
    methods: [
      /**
       * @function cluster
       * @return {raftClusterDetails[]} result
       */
      {
        name: "cluster",
        call: "raft_cluster",
        params: 0,
      },
      /**
       * @function role
       * @return {String} Role of the node in Raft GoQuorum
       */
      {
        name: "role",
        call: "raft_role",
        params: 0,
      },
      /**
       * @function leader
       * @return {String} enode id of the leader
       */
      {
        name: "leader",
        call: "raft_leader",
        params: 0,
      },
      /**
       * @function addPeer
       * @param {String} enodeId enode id of the node to be added to the network
       * @return {Number} Raft id for the node being added
       */
      {
        name: "addPeer",
        call: "raft_addPeer",
        params: 1,
      },
      /**
       * @function removePeer
       * @param {Number} raftId Raft id of the node to be removed from the cluster
       * @return {null}
       */
      {
        name: "removePeer",
        call: "raft_removePeer",
        params: 1,
      },
      /**
       * @function addLearner
       * @param {String} enodeId enode id of the learner node to be added to the network
       * @return {Number} Raft id for the node being added
       */
      {
        name: "addLearner",
        call: "raft_addLearner",
        params: 1,
      },
      /**
       * @function promoteToPeer
       * @param {Number} raftId Raft id of the node to be promoted
       * @return {Boolean}
       */
      {
        name: "promoteToPeer",
        call: "raft_promoteToPeer",
        params: 1,
      },
    ],
  });
  return web3;
}

module.exports = Raft;
