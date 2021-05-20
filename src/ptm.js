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
  if (ipcPath === undefined) {
    const { protocol } = new URL(privateEndpoint);
    if (protocol === "https:") {
      tlsOptions.clientKey = tlsSettings.key || null;
      tlsOptions.clientCert = tlsSettings.clcert || null;
      tlsOptions.ca = tlsSettings.cacert || null;
      tlsOptions.rejectInsecure = !tlsSettings.allowInsecure || null;
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
