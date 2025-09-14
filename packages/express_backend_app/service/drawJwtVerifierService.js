exports.jwtVerifierService = (jwt, jsonWebToken, ignoreExpiration = false) => {
  try {
    const decodedBody = jwt.verify(jsonWebToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: ignoreExpiration });
    console.log("JWT verified successfully");
    return decodedBody;
  } catch (err) {
    throw err;
  }
}
