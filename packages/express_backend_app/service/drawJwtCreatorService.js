exports.jwtCreatorService = (jwt, userDetail) => {
  //process.env. is always a string. jsonWebToken module takes string and take it as millisecond
  return jwt.sign(userDetail, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}
