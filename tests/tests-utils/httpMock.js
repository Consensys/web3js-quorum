const nock = require("nock");
const { URL } = require("./constants");

let id = 0;

const mockHttpPost = (fn, result) => {
  nock(URL)
    .post("/")
    .once()
    .reply((_, body) => {
      if (fn) {
        fn(body);
      }
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

module.exports = {
  mockHttpPost,
};
