const Utils = require("./utils");
const txFixtures = require("./test-utils/keySets.json");

describe("[EEA]: Privacy Group Generation", () => {
  it("should generate correct privacy group id", () => {
    const { generatePrivacyGroup } = new Utils({ utils: {} }).utils;
    txFixtures.forEach((pg) => {
      const expected = pg.privacyGroupId;
      const input = pg.privacyGroup;
      expect(generatePrivacyGroup({ privateFrom: input })).toEqual(expected);
    });
  });
});
