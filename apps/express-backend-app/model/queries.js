const pool = require("./pool.js");

async function listUser() {
  const { rows } = await pool.query("SELECT * FROM user_details");
  return rows;
}

async function addUser({ emailId, password }) {
  await pool.query("INSERT INTO user_details (email_id, password) VALUES ($1, $2)", [emailId, password]);
}

module.exports = {
  listUser,
  addUser,
};
