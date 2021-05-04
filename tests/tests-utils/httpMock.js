const nock = require("nock");
const { URL } = require("./constants");

const mockHttpPost = (fn, results, n = 1) => {
  nock(URL)
    .post("/")
    .times(n)
    .reply((_, body) => {
      if (fn) {
        fn(body);
      }
      const result = Array.isArray(results) ? results.shift() : results;
      return [
        201,
        {
          jsonrpc: "2.0",
          id: body.id,
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
