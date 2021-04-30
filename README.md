# web3js-quorum

Web3js-Quorum is a JavaScript library to extend [web3.js](https://github.com/ethereum/web3.js/). It adds supports for
[GoQuorum](https://docs.goquorum.consensys.net/en/stable/) and [Besu](https://besu.hyperledger.org/en/stable/) through
JSON-RPC calls.


## Features

- Provide js applications with easy access to GoQuorum and Besu APIs
- Create and send private transactions
- Create, delete and find privacy groups
- Works with [web3.js](https://github.com/ethereum/web3.js/)

## Installation
```shell
npm install web3js-quorum
```

## Quickstart
The Quorum client APIs methods provided by web3js-quorum are accessed like so: 
### Extending web3 object
```js
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");

const web3 = new Web3Quorum(new Web3("http://localhost:22000"));

web3.priv.sendRawTransaction(signedRlpEncoded);
```

## Documentation

For full usage and API details see the [documentation]() TBD.

## Examples
The [example](example) directory contains examples of web3js-quorum usage. 
