const nock = require("nock");
const { URL } = require("./constants");

let id = 0;

const mockHttpPost = (fn, results, n = 1) => {
  nock(URL)
    .post("/")
    .times(n)
    .reply((_, body) => {
      if (fn) {
        fn(body);
      }
      const result = Array.isArray(results) ? results.shift() : results;
      id += 1;
      return [
        201,
        {
          jsonrpc: "2.0",
          id,
          result: result || "0x0",
        },
      ];
    });
};

const resetMock = () => {
  nock.cleanAll();
};

module.exports = {
  mockHttpPost,
  resetMock,
};
