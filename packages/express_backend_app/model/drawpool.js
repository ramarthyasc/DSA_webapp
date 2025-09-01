const { Pool } = require('pg');

module.exports = new Pool({
  host: "localhost",
  user: "r-amarthya-sreechand",
  database: "draw_signin",
  password: "RascRasc12!@",
  port: 5432
})
