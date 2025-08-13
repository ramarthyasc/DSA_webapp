const pool = require("./pool.js");

async function listUser() {
  const { rows } = await pool.query("SELECT * FROM user_details");
  return rows;
}

async function addUser({ emailId, password }) {
  await pool.query("INSERT INTO user_details (email_id, password) VALUES ($1, $2)", [emailId, password]);
}

async function searchUser({ emailId }) {
  try {
    const { rows } = await pool.query("SELECT id, email_id, password FROM user_details " +
      "WHERE email_id = $1::text", [emailId]);
    return rows;

  } catch (err) {
    throw new Error(`Data error: ${err}`);
  }
}

module.exports = {
  listUser,
  addUser,
  searchUser,
};
