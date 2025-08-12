const argon2 = require('argon2');

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
  console.log("Hello")

  const correctPasswordBool = await argon2.verify(userDetail[0].password, loginDetails.password);
  if (!correctPasswordBool) {
    throw new Error('Incorrect Password');
  }

  return correctPasswordBool;
}
