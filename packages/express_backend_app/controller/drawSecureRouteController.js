const jwt = require('jsonwebtoken');
const { jwtVerifierService } = require('../service/drawJwtVerifierService.js');
const { jwtCreatorService } = require('../service/drawJwtCreatorService.js');


exports.secureRouteGet = (req, res, next) => {
  //header
  const header = req.get('Authorization');
  console.log(header);
  jsonWebToken = header.split(" ")[1];
  console.log(jsonWebToken);

  //Check Refresh Token: 
  //--------- If: Refresh token is Invalid (ie; Revoked RT or Different RT) (HACKED !!!! - REPLAY ATTACK), Logout the user from all browsers.
  //          ie; Revoke (revoked = true) all current Refresh Tokens of user (A user will have one active Refresh token per each browser). That's it.
  //--------- Else (Refresh token is Valid): 

  // (
  try { //jwt is Valid & not expired

    //---------- (When there is non expired Jwt, by default, it's corresponding valid RT will be unexpired) - as jwt = 15min, RT = 24hr
    //           Create new JWT only (Don't create new RT - to prevent waste of DB processing)

    const payload = jwtVerifierService(jwt, jsonWebToken);
    console.log(`payload = ${payload}`);
    //payload may have expirytime and iat properties. Check it. We don't need it
    const { iat, exp, ...userDetail } = payload;
    ////jwtCreatorService(jwt, userDetail);


  } catch (err) {
    if (err.name === "TokenExpiredError") { //jwt is expired

      //-------- Refreshtoken :         if: unexpired, Create new JWT + RT (Revoke old RT)
      //--------                 & else if: expired, Revoke RT ie; Logout in that browser.

      //
      //
      // const refreshToken = req.cookies.refreshToken;
      // const 
      // if ()
      //   console.log(err);
      // // Create new JWT and RT
      // const accessToken = jwtCreatorService(jwt, userDetail)



    } else if (err.name === "JsonWebTokenError") { //jwt is invalid (HACKED !!!!)

      // regardless of if RT is unexpired or expired, do the below- 
      // Logout from all browsers ie; Revoke all Refresh tokens. that's it.
      console.log(err);
      res.status(400).send("User not authorized for access !");
    }
  }

  //)


}

