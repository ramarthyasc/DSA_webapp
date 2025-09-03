const pool = require('./drawpool.js');

async function addRefreshToken({ userid, token, expires_at, rotated_from }) {
  // if (revoked === true) {
  // Update the row at that id (not userid)
  // attach the rotated_from of the new Refreshtoken as the id above.
  // }
  const text = "INSERT INTO refresh_tokens (userid, token, expires_at, rotated_from) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [userid, token, expires_at, rotated_from];
  const res = await pool.query(text, values);

  return res.rows[0];
}


module.exports = {
  addRefreshToken,
}
