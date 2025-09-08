//This Controller can be used for any website - with minor changes or none at all

const jwt = require('jsonwebtoken');
const { jwtVerifierService } = require('../service/drawJwtVerifierService.js');
const { jwtCreatorService } = require('../service/drawJwtCreatorService.js');
const { searchRefreshToken, revokeRefreshToken, addRefreshToken } = require('../model/drawRefresh_tokensQueries.js');
const { verifyValidityExpiryRevokeRTService, refreshTokenGenerateService, addAndRevokeRTService } = require('../service/drawRefreshTokenService.js');
const crypto = require('crypto');


exports.rotatingRefreshTokenAndJwt = async (req, res, next) => {



  const refreshToken = req.cookies.refreshToken;

  // If cookie was deleted in the browser manually or after cookie expiry, and then the user refreshed the page , 
  // then refreshToken above = undefined. Handle it below: ie; Logout the user even if they have a Valid JWT with them - simplicity & secure.
  // The Refresh token which is deleted but still active in the Database will get expired and the chain will get expired after Abs.exp. time
  // of that token.
  if (!refreshToken) {
    return res.sendStatus(400); //Set isLogin as False for this status code at Frontend (React)
  }



  //Check Refresh Token: 
  //--------- If: Refresh token is Invalid (revoked) or Expired(Absolute or Relative), (ie; Revoked RT or Different RT) (HACKED !!!! - REPLAY ATTACK), Logout the user from all browsers.
  //          ie; Revoke (revoked = true) current Refresh Token of hacker (A user will have one active Refresh token per each browser). That's it.
  //--------- Else (Refresh token is Valid and not Expired): 

  const detailRefreshToken = await verifyValidityExpiryRevokeRTService(refreshToken, searchRefreshToken, revokeRefreshToken);

  if (!detailRefreshToken) { // HACKED if Refresh token is different or is a revoked token or is Expired token. 
    // Refresh token revoked if incoming Refresh token is Expired (ie; Any of Expired combos or Revoked combos or Different RT are filtered out
    // = Revoked-expired, Revoked-nonExpired, Expired-NonRevoked, Different RT)
    // THESE CAN'T BE IN ANY WAY DONE BY USERS. BUT ONLY BY HACKERSS.
    return res.sendStatus(400); // logout from the current browser by setting isLogin false in the React by using this Status code.

  } else {
    // Refresh token is Valid(non Revoked) and non Expired (Only combo of Refresh token existing after the deletion of combos above)

    //header
    const header = req.get('Authorization');

    let jsonWebToken;
    if (header && header.startsWith('Bearer')) {
      //If there is Authorization header -
      jsonWebToken = header.split(" ")[1];
    } else {
      jsonWebToken = null;
    }

    //When i refresh the browser after logged in (In LoggedIn state, i have JWT stored in memory, + RT in cookie), the react page starts
    //afresh - which means i get the Signin page at the same webpage path. To prevent that, i can store the jwt in the local storage (XSS attack
    //can take the jwt) Or I can use the Refresh token in the cookie to generate one jwt from server. The latter is what i will do :
    //I have to use refresh token to create new jwt, then use that new jwt to access the secure route by sending it to server  to 
    //verfiy it, and then create new jwt using Refresh token, and send it back to frontend. Thus i use jwt to move through secure route (login page), and here 
    //i also would have to do 2 requests here.
    //
    //Remember : Jwt is a token and is the one who lets you through secure routes. Refesh token is the one who lets you create new Jwts.
    // jwtCreatorService(jwt,)


    try { //jwt is Valid & not expired

      //           Create new JWT only (Don't create new RT - to prevent waste of DB processing)


      // The Below line may jump to the Catch
      const payload = jwtVerifierService(jwt, jsonWebToken);
      console.log(`payload = ${payload}`);
      //payload may have expirytime and iat properties. Check it. We don't need it
      const { iat, exp, ...userDetail } = payload;
      console.log(`userDetail = ${userDetail}`);

      const accessToken = jwtCreatorService(jwt, userDetail);

      //for Use in the next middleware
      res.locals.accessToken = accessToken;
      res.locals.userDetail = userDetail;
      console.log(`Access token : ${accessToken}, userDetail: ${userDetail}`)
      return next() //res.json({ accessToken });


    } catch (err) {
      console.log(err);

      if (err.name === "TokenExpiredError") { //jwt is expired

        //-------- We have Valid & unexpired RT and Expired JWT: Create new JWT + RT (Revoke old RT)



        //ignoreExpiration = true
        const payload = jwtVerifierService(jwt, jsonWebToken, true);
        console.log(`payload = ${payload}`);
        const { iat, exp, ...userDetail } = payload;
        console.log(`userDetail = ${userDetail}`);

        const accessToken = jwtCreatorService(jwt, userDetail);

        let refreshToken = refreshTokenGenerateService(crypto);

        refreshToken = await addAndRevokeRTService(addRefreshToken,
          {
            userid: userDetail.userid,
            token: refreshToken,
            rotated_from: detailRefreshToken.id,
          }, revokeRefreshToken, detailRefreshToken);

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          secure: false, // As the localserver is not https. Change it to secure when in Production.
          sameSite: "lax",
        });

        //for Use in the next middleware
        res.locals.accessToken = accessToken;
        res.locals.userDetail = userDetail;
        return next() //res.json({ accessToken });





      } else if (err.name === "JsonWebTokenError") { //jwt is invalid (HACKED !!!!)

        // Logout from the hacker's browser ie; Revoke Refresh token. that's it.
        // THESE CAN'T BE IN ANY WAY DONE BY USERS. BUT ONLY BY HACKERSS.

        await revokeRefreshToken(detailRefreshToken);
        return res.sendStatus(400); //Logout from the browser from which request was send
      }
    }



  }


}
