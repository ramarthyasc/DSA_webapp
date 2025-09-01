const { verifyOrAddUserService } = require('../service/verifyOrAddUserService.js');
const { verifyGoogleJWTService } = require('../service/verifyGoogleJWTService.js');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const { userAddReturn, searchUser, updatePicture } = require('../model/drawqueries.js');

exports.preflightOptions = (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.sendStatus(200);
}

exports.jwtCreatorPost = async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');

  const token = req.body.credential;
  let userPayload;
  try {
    userPayload = await verifyGoogleJWTService(client, token);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`User Error`);
  }

  let userDetail;
  try {
    userDetail = await verifyOrAddUserService(userPayload, searchUser, userAddReturn, updatePicture); //arguments give
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error !");
  }

  return res.json(userDetail);
}
