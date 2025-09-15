exports.refreshTokenGenerateService = (crypto) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return refreshToken;
}

//add refresh token in database with schema - id (primarykey, default = uuid), userid, token, expires_at, revoked (db default = false), rotated_from
exports.addAndRevokeRTService = async (addRefreshToken, { userid, token,
  expiresIn = process.env.RT_EXPIRES_IN, rotated_from, absoluteExpiresIn = process.env.RT_ABSOLUTE_EXPIRES_IN },
  revokeRefreshToken = async () => { },
  detailRefreshToken = null) => {

  const expires_at = new Date(Date.now() + Number(expiresIn)); //24 hours = Relative Expiry
  const absolute_expires_at = new Date(Date.now() + Number(absoluteExpiresIn)); //7 days from now = Absolute expiry for all RTs


  // Create Refresh tokens which are not the First one of the Chain for a user's browser
  if (rotated_from) {
    await revokeRefreshToken(detailRefreshToken); //revoke previous RT of user's browser 

    // create new RT with the same absolute expiry time as the previous RT
    detailRefreshToken = await addRefreshToken({
      userid, token, expires_at, rotated_from,
      absolute_expires_at: detailRefreshToken.absolute_expires_at
    });

    const refreshToken = detailRefreshToken[0].token;
    return refreshToken;

  }

  // Create the First Refresh token of the chain (where rotated_from = null) where absolute_expires_at is set
  detailRefreshToken = await addRefreshToken({ userid, token, expires_at, rotated_from, absolute_expires_at });
  const refreshToken = detailRefreshToken[0].token;

  return refreshToken;
}


exports.verifyValidityExpiryRevokeRTService = async (token, searchRefreshToken, revokeRefreshToken) => {

  //Check Validity
  const detailRefreshToken = await searchRefreshToken(token);

  if (!detailRefreshToken.length) {
    // A Different RT is being supplied, so return
    return;
  }

  const isRevokedRefreshToken = detailRefreshToken[0].revoked
  if (isRevokedRefreshToken) {
    //RT is invalid (revoked) = Replay attack
    return;
  }

  //Check Expiry
  const now = new Date();
  const expires_at = new Date(detailRefreshToken[0].expires_at);
  const absolute_expires_at = new Date(detailRefreshToken[0].absolute_expires_at);

  if (now > expires_at || now > absolute_expires_at) {
    //Expired. ie; REPLAY ATTACK

    // Revoke refresh token of the user ie; Logout the user/hacker from the browser. So that he 
    // have to create new Refresh token from start - from the entry point ie; Signin through google.
    await revokeRefreshToken(detailRefreshToken[0])


    if (now > expires_at) {
      console.log(`Revoked user's or hacker's current browser Refresh token by Relative Expiry`);

    }
    if (now > absolute_expires_at) {
      console.log(`Revoked user's or hacker's current browser Refresh token by ABSOLUTE Expiry`);
    }
    return;

  }

  // As the thread reached here, RT is valid

  return detailRefreshToken[0];
}
