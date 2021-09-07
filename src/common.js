/**
 * Common code.
 * @module common
 */

// Perform the specified operation which requires waiting for a transaction to be minted.
// Returns a promise which waits for the operation to complete.
const waitForTransactionWithRetries = (operation, txHash, retries, delay) => {
  /* eslint-disable promise/param-names */
  /* eslint-disable promise/avoid-new */

  const waitFor = (ms) => {
    return new Promise((r) => {
      return setTimeout(r, ms);
    });
  };

  let notified = false;
  const retryOperation = (operationToRetry, times) => {
    return new Promise((resolve, reject) => {
      return operationToRetry()
        .then((result) => {
          if (result == null) {
            if (!notified) {
              console.log("Waiting for transaction to be mined ...");
              notified = true;
            }
            if (delay === 0) {
              throw new Error(
                `Timed out after ${retries} attempts waiting for transaction to be mined`
              );
            } else {
              const waitInSeconds = (retries * delay) / 1000;
              throw new Error(
                `Timed out after ${waitInSeconds}s waiting for transaction to be mined`
              );
            }
          } else {
            return resolve(result);
          }
        })
        .catch((reason) => {
          if (times - 1 > 0) {
            // eslint-disable-next-line promise/no-nesting
            return waitFor(delay)
              .then(retryOperation.bind(null, operationToRetry, times - 1))
              .then(resolve)
              .catch(reject);
          }
          return reject(reason);
        });
    });
  };

  return retryOperation(operation, retries);
};

exports.waitForTransactionWithRetries = waitForTransactionWithRetries;
