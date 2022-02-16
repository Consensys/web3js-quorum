
### MIGRATION FROM web3js-eea to web3js-quorum

## Priv namespace

| Web3js-eea                                                    | web3js-quorum                                                 | changes                      |
|---------------------------------------------------------------|---------------------------------------------------------------|------------------------------|
| web3.priv.getFilterChanges                                    | web3.priv.getFilterChanges                                    | NO                           |
| web3.priv.getFilterLogs                                       | web3.priv.getFilterLogs                                       | NO                           |
| web3.priv.createPrivacyGroup                                  | web3.priv.createPrivacyGroup                                  | NO                           |
| web3.priv.unsubscribe                                         | web3.priv.unsubscribe                                         | NO                           |
| web3.priv.uninstallFilter                                     | web3.priv.uninstallFilter                                     | NO                           |
| web3.priv.getPastLogs                                         | web3.priv.getLogs                                             | function name                |
| web3.priv.getTransaction                                      | web3.priv.getPrivateTransaction                               | function name                |
| web3.priv.createFilter                                        | web3.priv.newFilter                                           | function name                |
| web3.priv.subscribe                                           | web3.priv.subscribeWithPooling                                | function name                |
| web3.priv.distributeRawTransaction                            | web3.priv.generateAndDistributeRawTransaction                 | function name                |
| web3.eea.sendRawTransaction                                   | web3.priv.generateAndSendRawTransaction                       | function name                |
| web3.priv.generatePrivacyGroup                                | web3.utils.generatePrivacyGroup                               | namespace                    |
| web3.priv.call({to, from, data, privacyGroupId, blockNumber}) | web3.priv.call(privacyGroupId, {to, from, data}, blockNumber) | parameters                   |
| web3.priv.deletePrivacyGroup({privacyGroupId})                | web3.priv.deletePrivacyGroup(privacyGroupId)                  | parameters                   |
| web3.priv.findPrivacyGroup({addresses})                       | web3.priv.findPrivacyGroup(addresses)                         | parameters                   |
| web3.priv.getTransactionCount({form,privacyGroupId})          | web3.priv.getTransactionCount(from, privacyGroupId)           | parameters                   |
| web3.priv.getTransactionReceipt(txHash, enclavePublicKey)     | web3.priv.waitForTransactionReceipt(txHash)                   | function name and parameters |


## Privx namespace 
| Web3js-eea                                      | web3js-quorum                                 | changes                     |
|-------------------------------------------------|-----------------------------------------------|-----------------------------|
| web3.privx.findOnChainPrivacyGroup({addresses}) | web3.eth.flexiblePrivacyGroup.find(addresses) | namespace and parameters    |
| web3.privx.createPrivacyGroup                   | web3.eth.flexiblePrivacyGroup.create          | function name and namespace |
| web3.privx.removeFromPrivacyGroup               | web3.eth.flexiblePrivacyGroup.removeFrom      | function name and namespace |
| web3.privx.addToPrivacyGroup                    | web3.eth.flexiblePrivacyGroup.addTo           | function name and namespace |
| web3.privx.setPrivacyGroupLockState             | web3.eth.flexiblePrivacyGroup.setLockState    | function name and namespace |
