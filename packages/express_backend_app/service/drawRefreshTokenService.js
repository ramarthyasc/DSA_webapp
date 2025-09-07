const { revokeOneOrAllRefreshTokens } = require("../model/drawRefresh_tokensQueries");

exports.refreshTokenGenerateService = (crypto) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return refreshToken;
}

//add refresh token in database with schema - id (primarykey, default = uuid), userid, token, expires_at, revoked (db default = false), rotated_from
exports.addAndRevokeRTService = async (addRefreshToken, { userid, token, expiresIn = 24, rotated_from }, revokeOneOrAllRefreshTokens = async () => { },
  detailRefreshToken = null) => {

  if (rotated_from) {
    await revokeOneOrAllRefreshTokens(detailRefreshToken, false); //revoke one RT per user
  }
  const expires_at = new Date(Date.now() + expiresIn * 60 * 60 * 1000);

  const detailRefreshToken = await addRefreshToken({ userid, token, expires_at, rotated_from });
  const refreshToken = detailRefreshToken[0].token;

  return refreshToken;
}


exports.verifyValidityRevokeRTService = async (token, searchRefreshToken, revokeOneOrAllRefreshTokens) => {

  const detailRefreshToken = searchRefreshToken(token);
  const isRevokedRefreshToken = detailRefreshToken[0].revoked

  if (!detailRefreshToken.length || isRevokedRefreshToken) { // RT is invalid. ie; REPLAY ATTACK

    // true => Revoke all refresh tokens of the user
    await revokeOneOrAllRefreshTokens(detailRefreshToken[0], true)

    console.log(`Revoked all Refresh tokens of the user`);
    return;

  } else { // RT is valid

    return detailRefreshToken[0];

  }
}

exports.verifyExpiryRevokeRTService = async (detailRefreshToken, revokeOneOrAllRefreshTokens) => {

  const now = new Date();
  const expires_at = new Date(detailRefreshToken.expires_at);

  if (now > expires_at) { //expired
    await revokeOneOrAllRefreshTokens(detailRefreshToken, false) //Revoke one active RT of user
    return;

  } else {
    return detailRefreshToken;
  }
}

