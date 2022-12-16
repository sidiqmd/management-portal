const dbConfig = require("./config");
const mysql = require("serverless-mysql")({
  config: dbConfig,
});
module.exports = mysql;
