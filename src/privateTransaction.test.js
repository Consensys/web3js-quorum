const utils = require("ethereumjs-util");

const PrivateTransaction = require("./privateTransaction.js");
const txFixtures = require("./test-utils/txs.json");

describe("[Transaction]: Basic functions", () => {
  const transactions = [];

  it("should decode transactions", () => {
    txFixtures.forEach((tx) => {
      const pt = new PrivateTransaction(tx.raw);
      expect(`0x${pt.nonce.toString("hex")}`).toEqual(tx.raw[0]);
      expect(`0x${pt.gasPrice.toString("hex")}`).toEqual(tx.raw[1]);
      expect(`0x${pt.gasLimit.toString("hex")}`).toEqual(tx.raw[2]);
      expect(`0x${pt.to.toString("hex")}`).toEqual(tx.raw[3]);
      expect(`0x${pt.value.toString("hex")}`).toEqual(tx.raw[4]);
      expect(`0x${pt.data.toString("hex")}`).toEqual(tx.raw[5]);
      expect(`0x${pt.v.toString("hex")}`).toEqual(tx.raw[6]);
      expect(`0x${pt.r.toString("hex")}`).toEqual(tx.raw[7]);
      expect(`0x${pt.s.toString("hex")}`).toEqual(tx.raw[8]);
      expect(pt.privateFrom.toString("base64")).toEqual(tx.raw[9]);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tx.raw[10].length; i++) {
        expect(pt.privateFor[i].toString("base64")).toEqual(tx.raw[10][i]);
      }
      expect(pt.privacyGroupId.toString()).toEqual(tx.raw[11]);
      expect(pt.restriction.toString()).toEqual(tx.raw[12]);
      transactions.push(pt);
    });
  });

  it("should decode rlp", () => {
    transactions.forEach((tx, i) => {
      expect(transactions[i].serialize()).toEqual(
        new PrivateTransaction(txFixtures[i].rlp).serialize()
      );
    });
  });

  it("should serialize", () => {
    transactions.forEach((tx, i) => {
      expect(`0x${tx.serialize().toString("hex")}`).toEqual(txFixtures[i].rlp);
    });
  });

  it("should sign tx", () => {
    transactions.forEach((tx, i) => {
      const privKey = Buffer.from(txFixtures[i].privateKey, "hex");
      expect(() => {
        tx.sign(privKey);
      }).not.toThrowError();
    });
  });

  it("should get sender's address after signing it", () => {
    transactions.forEach((tx, i) => {
      expect(tx.getSenderAddress().toString("hex")).toEqual(
        txFixtures[i].sendersAddress
      );
    });
  });

  it("should get sender's public key after signing it", () => {
    transactions.forEach((tx, i) => {
      expect(tx.getSenderPublicKey().toString("hex")).toEqual(
        utils
          .privateToPublic(Buffer.from(txFixtures[i].privateKey, "hex"))
          .toString("hex")
      );
    });
  });
});
