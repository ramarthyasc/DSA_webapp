exports.jwtCreatorService = (jwt, userDetail) => {
  return jwt.sign(userDetail, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}
