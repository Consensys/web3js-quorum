const { generatePrivacyGroup } = require("../../src/privacyGroup");
const txFixtures = require("./support/keySets.json");

describe("[EEA]: Privacy Group Generation", () => {
  it("should generate correct privacy group id", () => {
    txFixtures.forEach((pg) => {
      const expected = pg.privacyGroupId;
      const input = pg.privacyGroup;
      expect(generatePrivacyGroup({ privateFrom: input })).toEqual(expected);
    });
  });
});
