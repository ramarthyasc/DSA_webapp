const pool = require('./drawpool.js');

// refresh_tokens table schema : (\d+ refresh_tokens)
// id UUID PRIMARY KEY DEFAULT gen_random_uuid(), userid TEXT UNIQUE REFERENCES users(userid), token TEXT UNIQUE, expires_at timestamptz
// , revoked boolean DEFAULT false, rotated_from uuid, absolute_expires_at timestamptz

async function addRefreshToken({ userid, token, expires_at, rotated_from, absolute_expires_at }) {

  const text = "INSERT INTO refresh_tokens (userid, token, expires_at, rotated_from, absolute_expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [userid, token, expires_at, rotated_from, absolute_expires_at];
  const res = await pool.query(text, values);

  return res.rows;
}

async function searchRefreshToken(token) {

  const text = "SELECT * FROM refresh_tokens WHERE token = $1";
  const values = [token];
  const { rows } = await pool.query(text, values);


  return rows;
}

async function revokeRefreshToken(detailRefreshToken) {

  const text = "UPDATE refresh_tokens SET revoked = true WHERE token = $1 RETURNING *";
  const values = [detailRefreshToken.token];
  const res = await pool.query(text, values);
  console.log(`Revoked one active Refresh token of user: ${res.rows[0].userid}. ie; User logged out of one browser.`);
  console.log(`Updated ${res.rowCount} row. Should only update one row.`)
}


module.exports = {
  addRefreshToken,
  searchRefreshToken,
  revokeRefreshToken,
}
