const pool = require('./drawpool.js');

// refresh_tokens table schema : (\d+ refresh_tokens)
// id UUID PRIMARY KEY DEFAULT gen_random_uuid(), userid TEXT UNIQUE, token TEXT UNIQUE, expires_at timestamptz, revoked boolean DEFAULT false,
// rotated_from uuid, absolute_expires_at timestamptz

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

async function revokeOneOrAllRefreshTokens(detailRefreshToken, isRevokeUser = false) {

  if (isRevokeUser) {
    // Revoke all active Refresh tokens of the user. So that he/she will be logged out of all browser softwares.
    const text = "UPDATE refresh_tokens SET revoked = true WHERE userid = $1 AND revoked = false";
    const values = [detailRefreshToken.userid];
    const res = await pool.query(text, values);
    console.log(`Revoked all active Refresh tokens of user: ${userid}. ie; User logged out of all browsers.`);
    console.log(`Updated ${res.rowCount} row/s`)

  } else {
    const text = "UPDATE refresh_tokens SET revoked = true WHERE token = $1";
    const values = [detailRefreshToken.token];
    const res = await pool.query(text, values);
    console.log(`Revoked one active Refresh token of user: ${userid}. ie; User logged out of one browser.`);
    console.log(`Updated ${res.rowCount} row. Should only update one row.`)
  }
}


module.exports = {
  addRefreshToken,
  searchRefreshToken,
  revokeOneOrAllRefreshTokens
}
