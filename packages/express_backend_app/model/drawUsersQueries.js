const pool = require("./drawpool.js");

// users table schema : (\d+ users)
// userid TEXT PRIMARY KEY, name TEXT, email TEXT, picture TEXT

async function userAddReturn(userPayload) {
  const text = "INSERT INTO users (userid, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *"
  const values = [userPayload.sub, userPayload.name, userPayload.email, userPayload.picture];
  const { rows } = await pool.query(text, values);
  return rows;
}

async function updatePicture(userPayload) {
  const text = "UPDATE users SET picture = $1 WHERE userid = $2";
  const values = [userPayload.picture, userPayload.sub];
  const res = await pool.query(text, values);
  console.log(`Updated ${res.rowCount} row. Should only be 1 row.`);
}

async function searchUser(userPayload) {
  const text = "SELECT * FROM users WHERE userid = $1";
  const values = [userPayload.sub];
  const { rows } = await pool.query(text, values);
  return rows;
}

module.exports = {
  userAddReturn,
  searchUser,
  updatePicture,
}

