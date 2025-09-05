exports.jwtVerifierService = (jwt, jsonWebToken) => {
  try {
    const decodedBody = jwt.verify(jsonWebToken, process.env.JWT_SECRET_KEY)
    return decodedBody;
  } catch (err) {
    throw err;
  }
}
