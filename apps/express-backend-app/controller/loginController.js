// Dependency inversion
const { searchUser } = require('../model/queries.js');
const path = require('path');
const { verifyUser, verifyPassword } = require('../service/loginServices.js');

exports.userLoginGet = (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, '../view') });
}

exports.userLoginAuthPost = async (req, res) => {
  const loginDetails = req.body;

  let userDetail;

  //Verfiy the emailId
  try {
    userDetail = await verifyUser(loginDetails, searchUser);
  } catch (err) {
    return res.status(500).send(err);
  }

  if (userDetail.length === 0) {
    return res.status(400).send("Email not registered. </br> <a href='/signup'>Signup</a> <a href='/login'>Go back</a> ");
  }

  //Verify the password & return JWT
  let jwt;
  try {
    jwt = await verifyPassword(loginDetails, userDetail);
  } catch (err) {
    return res.status(400).send(`${err}`);
  }


  //Send JWT through response header in the Set-Cookie property of the header, and Store it in the Browser cookies storage.
  //While sending Redirect resonse to the Browser, the Cookie is stored. And Send in every Subsequent requests to the Server.
  res.cookie('auth_jwt', jwt, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    secure: false, // As the localserver is not https. Change it to secure when in Production.
    sameSite: "strict",
  });

  res.redirect('/home');

}
