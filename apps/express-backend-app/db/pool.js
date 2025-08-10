const { Pool } = require('pg');

module.exports = new Pool({
  host: "localhost",
  user: "r-amarthya-sreechand",
  database: "signup_users",
  password: "RascRasc12!@",
  port: 5432
});
