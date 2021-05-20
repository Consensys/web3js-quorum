const rp = require("request-promise-native");
const { URL } = require("url");

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

  const send = (payload, from, to) => {
    return rp({
      method: "POST",
      uri: `${privateEndpoint}/send`,
      json: true,
      body: { payload, from, to },
      ...tlsOptions,
    });
  };

  const storeRaw = (payload, from) => {
    return rp({
      method: "POST",
      uri: `${privateEndpoint}/storeraw`,
      json: true,
      body: { payload, from },
      ...tlsOptions,
    });
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
