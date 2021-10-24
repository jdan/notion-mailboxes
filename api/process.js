const run = require("../main.js");

module.exports = async (req, res) => {
  await run();
  res.json({ status: "ok" });
};
