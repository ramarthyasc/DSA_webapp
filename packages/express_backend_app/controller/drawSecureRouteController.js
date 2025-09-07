const jwt = require('jsonwebtoken');
const { jwtVerifierService } = require('../service/drawJwtVerifierService.js');
const { jwtCreatorService } = require('../service/drawJwtCreatorService.js');
const { searchRefreshToken, revokeOneOrAllRefreshTokens, addRefreshToken } = require('../model/drawRefresh_tokensQueries.js');
const { verifyValidityExpiryRevokeRTService, refreshTokenGenerateService, addAndRevokeRTService } = require('../service/drawRefreshTokenService.js');
const crypto = require('crypto');

exports.secureRouteGet = async (req, res) => {
  //header
  const header = req.get('Authorization');
  console.log(header);
  jsonWebToken = header.split(" ")[1];
  console.log(jsonWebToken);

  //Check Refresh Token: 
  //--------- If: Refresh token is Invalid (revoked) or Expired(Absolute or Relative), (ie; Revoked RT or Different RT) (HACKED !!!! - REPLAY ATTACK), Logout the user from all browsers.
  //          ie; Revoke (revoked = true) all current Refresh Tokens of user (A user will have one active Refresh token per each browser). That's it.
  //--------- Else (Refresh token is Valid and not Expired): 

  const refreshToken = req.cookies.refreshToken;

  // If cookie was deleted in the browser and then the user refreshed the page , then refreshToken above = undefined.
  //Here, we have to revoke the previous RT - if it was valid and not expired.


  let detailRefreshToken = await verifyValidityExpiryRevokeRTService(refreshToken, searchRefreshToken, revokeOneOrAllRefreshTokens);

  if (!detailRefreshToken) { // HACKED if Refresh token is different or is a revoked token. If cookie was deleted too, this will happen.
    // Refresh token revoked if incoming Refresh token is Invalid (ie; Any of Invalid combos = Invalid-expired, Invalid-nonExpired)
    // or Expired (ie' Any of "Expired" combos = Expired-Invalid, Expired-Valid)
    return res.sendStatus(400);

  } else {
    // Refresh token is Valid and non Expired (Only combo of Refresh token existing after the deletion of combos above)

    let userDetail;
    try { //jwt is Valid & not expired

      //           Create new JWT only (Don't create new RT - to prevent waste of DB processing)


      const payload = jwtVerifierService(jwt, jsonWebToken);
      console.log(`payload = ${payload}`);
      //payload may have expirytime and iat properties. Check it. We don't need it
      ({ iat, exp, ...userDetail } = payload);
      console.log(`userDetail = ${userDetail}`);

      const accessToken = jwtCreatorService(jwt, userDetail);

      return res.json({ accessToken });


    } catch (err) {
      console.log(err);

      if (err.name === "TokenExpiredError") { //jwt is expired

        //-------- We have Valid & unexpired RT and Expired JWT: Create new JWT + RT (Revoke old RT)



        const accessToken = jwtCreatorService(jwt, userDetail);

        let refreshToken = refreshTokenGenerateService(crypto);

        refreshToken = await addAndRevokeRTService(addRefreshToken,
          {
            userid: userDetail.userid,
            token: refreshToken,
            rotated_from: detailRefreshToken.id,
          }, revokeOneOrAllRefreshTokens, detailRefreshToken);

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          secure: false, // As the localserver is not https. Change it to secure when in Production.
          sameSite: "lax",
        });

        return res.json({ accessToken });





      } else if (err.name === "JsonWebTokenError") { //jwt is invalid (HACKED !!!!)

        // Logout from all browsers ie; Revoke all Refresh tokens. that's it.

        await revokeOneOrAllRefreshTokens(detailRefreshToken, true);
        return res.sendStatus(400);
      }
    }



  }


}
