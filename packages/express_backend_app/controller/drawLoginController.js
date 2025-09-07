const { verifyOrAddUserService } = require('../service/drawVerifyOrAddUserService.js');
const { verifyGoogleJWTService } = require('../service/drawVerifyGoogleJWTService.js');
const { userAddReturn, searchUser, updatePicture } = require('../model/drawUsersQueries.js');
const { jwtCreatorService } = require('../service/drawJwtCreatorService.js');
const { refreshTokenGenerateService, addAndRevokeRTService } = require('../service/drawRefreshTokenService.js');
const { addRefreshToken } = require('../model/drawRefresh_tokensQueries.js');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.preflightOptions = (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.sendStatus(200);
}

exports.googleJwtVerifyPost = async (req, res, next) => {
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

  req.userDetail = userDetail;
  next();
}

exports.jwtCreatorPost = async (req, res) => {

  const userDetail = req.userDetail;
  //create jwt using the userDetail
  const accessToken = jwtCreatorService(jwt, userDetail);
  let refreshToken = refreshTokenGenerateService(crypto);

  //save refresh token in database with schema - id (primarykey, default = uuid), userid, token, expires_at, revoked (db default = false), rotated_from
  refreshToken = await addAndRevokeRTService(addRefreshToken,
    {
      userid: userDetail.userid,
      token: refreshToken,
      rotated_from: null
    });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: false, // As the localserver is not https. Change it to secure when in Production.
    sameSite: "lax",
  });

  res.json({ accessToken });
}


