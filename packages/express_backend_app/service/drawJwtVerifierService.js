exports.jwtVerifierService = (jwt, jsonWebToken, ignoreExpiration = false) => {
  try {
    const decodedBody = jwt.verify(jsonWebToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: ignoreExpiration });
    return decodedBody;
  } catch (err) {
    throw err;
  }
}
