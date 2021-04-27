const createGroup = require("../example/privacyGroupManagement/createPrivacyGroup");
const createGroupNode2 = require("../example/privacyGroupManagement/createPrivacyGroupNode2");
const findGroup = require("../example/privacyGroupManagement/findPrivacyGroup");
const findGroupNode2 = require("../example/privacyGroupManagement/findPrivacyGroupNode2");

describe("[MultiNodeExample]: Can manage privacy groups", () => {
  it("can create and find privacy group", async () => {
    const [privacyGroup12, privacyGroup23] = await Promise.all([
      createGroup.createPrivacyGroup(),
      createGroupNode2.createPrivacyGroupForNode23(),
    ]);
    const listPrivacyGroups = await findGroup.findPrivacyGroup();
    const listWithPrivacyGroupAfterCreate = listPrivacyGroups.filter((i) => {
      return i.privacyGroupId === privacyGroup12;
    });
    expect(listWithPrivacyGroupAfterCreate).toHaveLength(1);

    const listFindFromNode1 = await findGroup.findPrivacyGroupForNode23();

    // node1 should not see privacyGroup23
    expect(listFindFromNode1).toHaveLength(0);

    const listFromNode2 = await findGroupNode2.findPrivacyGroupForNode23();
    const listWithPrivacyGroupNode2AfterCreate23 = listFromNode2.filter((i) => {
      return i.privacyGroupId === privacyGroup23;
    });

    expect(listWithPrivacyGroupNode2AfterCreate23).toHaveLength(1);
  });
});
