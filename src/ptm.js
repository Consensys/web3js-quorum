const rp = require("request-promise-native");
const { URL } = require("url");
const { hexToBase64, base64toHex } = require("./util");

function ptm(web3, { ipcPath, privateUrl, tlsSettings }) {
  const socketRoot = `http://unix:${ipcPath}:`;
  const privateEndpoint = ipcPath ? socketRoot : privateUrl;
  const publicEndpoint = ipcPath ? socketRoot : privateUrl;
  const tlsOptions = {};
  // eslint-disable-next-line no-param-reassign
  web3.ptm = {};

  // tls settings fot https connections
  if (ipcPath === undefined && privateEndpoint) {
    const { protocol } = new URL(privateEndpoint);
    if (protocol === "https:" && tlsSettings) {
      if (tlsSettings.key) {
        tlsOptions.clientKey = tlsSettings.key;
      }
      if (tlsSettings.clcert) {
        tlsOptions.clientCert = tlsSettings.clcert;
      }
      if (tlsSettings.cacert) {
        tlsOptions.ca = tlsSettings.cacert;
      }
      if (tlsSettings.allowInsecure) {
        tlsOptions.rejectInsecure = tlsSettings.allowInsecure;
      }
    }
  }

  /**
   * Calls Tessera’s ThirdParty /send API to encrypts a payload, stores result in database, and publishes result to recipients.
   * @param {Object} options
   * @param {String} options.data        Hex encoded private transaction data (value of data/input field in the transaction)
   * @param {String} options.privateFrom Sending party’s base64-encoded public key
   * @param {String} options.privateFor  public keys identifying the recipients of the payload
   * @returns   A promise that resolves to the hex-encoded hash of the encrypted data (key field) that should be used to replace the data field of a transaction if externally signing.
   */
  const send = async ({ data, privateFrom, privateFor }) => {
    const response = await rp({
      method: "POST",
      uri: `${privateEndpoint}/send`,
      json: true,
      body: {
        payload: hexToBase64(data.substring(2)),
        from: privateFrom,
        to: privateFor,
      },
      ...tlsOptions,
    });
    return base64toHex(response.key);
  };

  /**
   * Calls Tessera’s ThirdParty /storeraw API to encrypt the provided data and store in preparation for a eth_sendRawPrivateTransaction.
   * @param {Object} options
   * @param {String} options.data        Hex encoded private transaction data (value of data/input field in the transaction)
   * @param {String} options.privateFrom Sending party’s base64-encoded public key
   * @returns   A promise that resolves to the hex-encoded hash of the encrypted data (key field) that should be used to replace the data field of a transaction if externally signing.
   */
  const storeRaw = async ({ data, privateFrom }) => {
    const response = await rp({
      method: "POST",
      uri: `${privateEndpoint}/storeraw`,
      json: true,
      body: {
        payload: hexToBase64(data.substring(2)),
        from: privateFrom,
      },
      ...tlsOptions,
    });
    return base64toHex(response.key);
  };

  const keys = () => {
    return rp({
      method: "GET",
      uri: `${publicEndpoint}/keys`,
      ...tlsOptions,
    });
  };

  const partyInfoKeys = () => {
    return rp({
      method: "GET",
      uri: `${publicEndpoint}/partyinfo/keys`,
      ...tlsOptions,
    });
  };

  const upCheck = () => {
    return rp({
      method: "GET",
      uri: `${publicEndpoint}/upcheck`,
      ...tlsOptions,
    });
  };

  Object.assign(web3.ptm, {
    send,
    storeRaw,
    keys,
    partyInfoKeys,
    upCheck,
  });
  return web3;
}
module.exports = ptm;
