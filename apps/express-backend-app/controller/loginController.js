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

  //Verify the password
  let correctPasswordBool;
  try {
    correctPasswordBool = await verifyPassword(loginDetails, userDetail);
  } catch (err) {
    return res.status(400).send(`${err}`);
  }
  //temp
  return res.send(`Your password is ${correctPasswordBool}`)

  //  correctPasswordBool





}
