const hexToBase64 = (str) => {
  return Buffer.from(str, "hex").toString("base64");
};

const base64toHex = (str) => {
  return Buffer.from(str, "base64").toString("hex");
};

const intToHex = (int) => {
  return `0x${int.toString(16)}`;
};

module.exports = { hexToBase64, base64toHex, intToHex };
