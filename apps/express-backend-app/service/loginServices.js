const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

exports.verifyUser = async (loginDetails, searchUser) => {
  let rows;
  try {
    rows = await searchUser(loginDetails);
  } catch (err) {
    throw err.message //`${error}` returns "name: ... message:..." where name property of Error object is "Error" string. ;
  }
  return rows;
}

exports.verifyPassword = async (loginDetails, userDetail) => {
  const correctPasswordBool = await argon2.verify(userDetail[0].password, loginDetails.password);
  if (!correctPasswordBool) {
    throw new Error('Incorrect Password');
  }
  // Creating JWT and return to controller
  const data = {
    id: userDetail.id,
    emailId: userDetail.emailId,
  };
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: Number(process.env.JWT_EXPIRES_IN) });


}
