exports.refreshTokenGenerateService = (crypto) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return refreshToken;
}

//save refresh token in database with schema - id (primarykey, default = uuid), userid, token, expires_at, revoked (db default = false), rotated_from
exports.saveRefreshTokenService = async (addRefreshToken, { userid, token, expiresIn = 24, rotated_from }) => {
  const expires_at = new Date(Date.now() + expiresIn * 60 * 60 * 1000);

  const detailRefreshToken = await addRefreshToken({ userid, token, expires_at, rotated_from });
  const refreshToken = detailRefreshToken.token;

  return refreshToken;
}
