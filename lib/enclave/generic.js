const rp = require("request-promise-native");

module.exports = (web3) => {
  const sleep = (ms) => {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  };

  const retry = (operation, delay, times) => {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      return operation()
        .then(resolve)
        .catch((reason) => {
          if (times - 1 > 0) {
            // eslint-disable-next-line promise/no-nesting
            return sleep(delay)
              .then(retry.bind(null, operation, delay, times - 1))
              .then(resolve)
              .catch(reject);
          }
          return reject(reason);
        });
    });
  };

  const getTransactionReceipt = (txHash) => {
    return web3.eth.getTransactionReceipt(txHash).then((txReceipt) => {
      if (txReceipt) {
        return txReceipt;
      }
      throw new Error("Can't get transaction receipt");
    });
  };

  const sendRawRequest = (payload, privateFor, privacyFlag = undefined) => {
    const privacyParams = {
      privateFor,
    };
    if (typeof privacyFlag !== "undefined") {
      privacyParams.privacyFlag = privacyFlag;
    }
    const sendRawPrivateTransactionRequest = {
      method: "POST",
      // eslint-disable-next-line no-underscore-dangle
      uri: web3.eth.currentProvider.host,
      headers: web3.eth.currentProvider.headers,
      json: true,
      body: {
        jsonrpc: "2.0",
        method: "eth_sendRawPrivateTransaction",
        params: [payload, privacyParams],
        id: "1",
      },
    };

    return rp(sendRawPrivateTransactionRequest).then((res) => {
      if (res.error !== undefined) {
        throw new Error(
          `eth_sendRawPrivateTransaction failed: ${res.error.message}`
        );
      }
      return retry(
        () => {
          return getTransactionReceipt(res.result);
        },
        100,
        100
      );
    });
  };

  return {
    sendRawRequest,
  };
};
