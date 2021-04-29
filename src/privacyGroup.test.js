const { generatePrivacyGroup } = require("./privacyGroup");
const txFixtures = require("./test-utils/keySets.json");

describe("[EEA]: Privacy Group Generation", () => {
  it("should generate correct privacy group id", () => {
    txFixtures.forEach((pg) => {
      const expected = pg.privacyGroupId;
      const input = pg.privacyGroup;
      expect(generatePrivacyGroup({ privateFrom: input })).toEqual(expected);
    });
  });
});
