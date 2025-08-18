const jwt = require('jsonwebtoken');

exports.verifyUserJwt = (AuthJwt) => {
  try {
    const decodedBody = jwt.verify(AuthJwt, process.env.JWT_SECRET_KEY);
    return decodedBody;
  } catch (err) {
    throw err;
  }
}
