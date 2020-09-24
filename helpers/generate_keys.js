const crypto = require("crypto");

const key1 = crypto.randomBytes(64).toString("hex");
const key2 = crypto.randomBytes(64).toString("hex");
// console.log(key1);
console.table({ key1, key2 });
