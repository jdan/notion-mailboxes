const loop = require("../main.js");

module.exports = async (req, res) => {
  await loop();
  res.json({ status: "ok" });
};
