const { revokeOneOrAllRefreshTokens } = require("../model/drawRefresh_tokensQueries");

exports.refreshTokenGenerateService = (crypto) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return refreshToken;
}

//add refresh token in database with schema - id (primarykey, default = uuid), userid, token, expires_at, revoked (db default = false), rotated_from
exports.addAndRevokeRTService = async (addRefreshToken, { userid, token, expiresIn = 24, rotated_from, absoluteExpiresIn = 7 },
  revokeOneOrAllRefreshTokens = async () => { },
  detailRefreshToken = null) => {

  const expires_at = new Date(Date.now() + expiresIn * 60 * 60 * 1000); //24 hours = Relative Expiry
  const absolute_expires_at = new Date(Date.now() + absoluteExpiresIn * 24 * 60 * 60 * 1000); //7 days from now = Absolute expiry for all RTs


  // Create Refresh tokens which are not the First one of the Chain for a user
  if (rotated_from) {
    await revokeOneOrAllRefreshTokens(detailRefreshToken, false); //revoke previous RT of user 

    // create new RT with the same absolute expiry time as the previous RT
    const detailRefreshToken = await addRefreshToken({
      userid, token, expires_at, rotated_from,
      absolute_expires_at: detailRefreshToken.absolute_expires_at
    });

    const refreshToken = detailRefreshToken[0].token;
    return refreshToken;

  }

  // Create the First Refresh token of the chain (where rotated_from = null) where absolute_expires_at is set
  const detailRefreshToken = await addRefreshToken({ userid, token, expires_at, rotated_from, absolute_expires_at });
  const refreshToken = detailRefreshToken[0].token;

  return refreshToken;
}


exports.verifyValidityExpiryRevokeRTService = async (token, searchRefreshToken, revokeOneOrAllRefreshTokens) => {

  //Check Validity
  const detailRefreshToken = searchRefreshToken(token);
  const isRevokedRefreshToken = detailRefreshToken[0].revoked

  //Check Expiry
  const now = new Date();
  const expires_at = new Date(detailRefreshToken[0].expires_at);
  const absolute_expires_at = new Date(detailRefreshToken[0].absolute_expires_at);

  if (!detailRefreshToken.length || isRevokedRefreshToken || now > expires_at || now > absolute_expires_at) {
    // RT is invalid (different or revoked) or expired. ie; REPLAY ATTACK

    // true => Revoke all refresh tokens of the user ie; Logout the user from all browsers. Even the hacker. So that he 
    // have to create new Refresh token from start - from the entry point ie; Signin through google.
    await revokeOneOrAllRefreshTokens(detailRefreshToken[0], true)

    console.log(`Revoked all Refresh tokens of the user`);
    return;

  } else { // RT is valid

    return detailRefreshToken[0];

  }
}
