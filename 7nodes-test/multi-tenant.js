const Web3 = require("web3");
const https = require("https");
const axios = require("axios");
const FormData = require("form-data");
const Web3HttpProvider = require("web3-providers-http");

const Web3Quorum = require("../src");

const PSI = "PS1"; // To change based on the private state identifier
const url = `https://localhost:22000?PSI=${PSI}`;
const oauthURL = "https://localhost:4445/clients";

const getAccessToken = async () => {
  try {
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    await instance.delete(`${oauthURL}/${PSI}`);
    const args = {
      client_id: PSI,
      client_secret: "foofoo",
      scope: `rpc://eth_* rpc://quorumExtension_* rpc://rpc_modules psi://${PSI}?self.eoa=0x0&node.eoa=0x0`,
    };
    await instance.post(oauthURL, {
      grant_types: ["client_credentials"],
      token_endpoint_auth_method: "client_secret_post",
      audience: ["Node1"],
      ...args,
    });

    const body = new FormData();
    body.append("grant_type", "client_credentials");
    body.append("audience", "Node1");
    Object.keys(args).forEach((key) => {
      body.append(key, args[key]);
    });

    const { data } = await instance.post(
      `https://localhost:4444/oauth2/token`,
      body,
      {
        headers: {
          ...body.getHeaders(),
        },
      }
    );
    return data.access_token;
  } catch (e) {
    console.error(e.response.data);
  }
  return null;
};
(async () => {
  try {
    const accessToken = await getAccessToken();
    const options = {
      keepAlive: true,
      headers: [{ name: "Authorization", value: `bearer ${accessToken}` }],
      agent: {
        https: https.Agent({
          rejectUnauthorized: false,
        }),
        baseUrl: url,
      },
    };

    const provider = new Web3HttpProvider(url, options);
    const web3 = new Web3Quorum(
      new Web3(provider),
      {
        privateUrl: "http://localhost:9081",
      },
      true
    );
    // Example of calling PSI specific API
    const psi = await web3.eth.getPSI();
    console.log(`You are connected to ${psi}`);
  } catch (e) {
    console.error(e);
  }
})();
