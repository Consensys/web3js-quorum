# web3js-quorum

Web3js-Quorum is an Ethereum JavaScript library extending [web3.js](https://github.com/ethereum/web3.js/) that adds supports for [GoQuorum](https://docs.goquorum.consensys.net/en/stable/) and [Hyperledger Besu](https://besu.hyperledger.org/en/stable/) specific JSON-RPC APIs and features. In particular it enables to use [web3.js](https://github.com/ethereum/web3.js/) with private transactions.

Web3js-Quorum gather all features from [quorum.js](https://github.com/ConsenSys/quorum.js) and [web3js-eea](https://github.com/ConsenSys/web3js-eea.js) in a single library.

Please read the [documentation]() for more.

## Features

- Supports GoQuorum and Besu JSON-RPC APIs
- Create and send private transactions
- Privacy group management

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

For full usage and API details see the [documentation]().

## Examples

The [example](example) directory contains examples of web3js-quorum usage. 

## Contributing

Please follow the [Contribution Guidelines]() and Review Guidelines.
