const Utils = require("./utils");
const txFixtures = require("./test-utils/keySets.json");

describe("Utils", () => {
  describe("Privacy Group Generation", () => {
    it("should generate correct privacy group id", () => {
      const { generatePrivacyGroup } = new Utils({ utils: {} }).utils;
      txFixtures.forEach((pg) => {
        const expected = pg.privacyGroupId;
        const input = pg.privacyGroup;
        expect(generatePrivacyGroup({ privateFrom: input })).toEqual(expected);
      });
    });
  });

  describe("web3.utils.setPrivate", () => {
    it("should set the raw transaction to private", () => {
      const { setPrivate } = new Utils({ utils: {} }).utils;
      const res = setPrivate(
        "0xf88e81b18083419ce08080b840184a2b03d4be85960a2cd856eb98e00f99a0f3919c3dc2554f292a1e6cd3a47c5f6fd4da56896f81fd545d2093561f2aaaf89d268d9f7386cd88853a6b68fed61ca04395f7291f430b0643fcb136f9015673b76e94e1fd86bde494af8b814f335c85a0183a86724513fcd1788e2db25cb219a8c2643c3c678c3ee4972134c67474b238"
      ).toString("hex");
      expect(res).toEqual(
        "f88e81b18083419ce08080b840184a2b03d4be85960a2cd856eb98e00f99a0f3919c3dc2554f292a1e6cd3a47c5f6fd4da56896f81fd545d2093561f2aaaf89d268d9f7386cd88853a6b68fed626a04395f7291f430b0643fcb136f9015673b76e94e1fd86bde494af8b814f335c85a0183a86724513fcd1788e2db25cb219a8c2643c3c678c3ee4972134c67474b238"
      );
    });
  });
});
