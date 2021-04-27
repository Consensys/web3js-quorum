const { spawn } = require("child_process");
const axios = require("axios");

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  const { config } = err;
  if (!config || !config.retry) return Promise.reject(err);
  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }
  config.__retryCount += 1;

  /* eslint-disable promise/avoid-new */
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 1);
  });

  return backoff.then(() => {
    return axios(config);
  });
});

const runPrivacyDocker = () => {
  return new Promise((resolve) => {
    const run = spawn("cd docker && ./run.sh", {
      shell: true,
      stdio: "inherit",
    });

    run.on("close", () => {
      return resolve({});
    });
  });
};

const waitForBesu = () => {
  return axios.get("http://localhost:20000", {
    retry: 60 * 5,
    retryDelay: 1000,
  });
};

runPrivacyDocker()
  .then(waitForBesu)
  .then(() => {
    return console.log("Finished: Besu Network is Running");
  })
  .catch(console.error);
