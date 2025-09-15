//This Controller can be used for any website - with minor changes or none at all

const jwt = require('jsonwebtoken');
const { jwtVerifierService } = require('../service/drawJwtVerifierService.js');
const { jwtCreatorService } = require('../service/drawJwtCreatorService.js');
const { searchRefreshToken, revokeRefreshToken, addRefreshToken } = require('../model/drawRefresh_tokensQueries.js');
const { verifyValidityExpiryRevokeRTService, refreshTokenGenerateService, addAndRevokeRTService } = require('../service/drawRefreshTokenService.js');
const { searchUser } = require('../model/drawUsersQueries.js');
const crypto = require('crypto');


exports.rotatingRefreshTokenAndJwt = async (req, res, next) => {


  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const refreshToken = req.cookies.refreshToken;

  // If cookie was deleted in the browser manually or after cookie expiry, and then the user refreshed the page , 
  // then refreshToken above = undefined. Handle it below: ie; Logout the user even if they have a Valid JWT with them - simplicity & secure.
  // When manually deleted the Cookie, 
  // The Refresh token which is deleted from the browser but still active in the Database will get expired and the RT chain will get expired after 
  // Abs.exp. time of that token. Here, then the user and the hacker gets logged out, and need to signin to get an RT without Rotated_from 
  // (ie; Fresh chain of RTs with a new Abs.expiry time from now on)
  if (!refreshToken) {
    return res.json({ rtError: "NO_REFRESH_TOKEN" }); //Set isLogin as False for this json at Frontend (React)
  }



  //Check Refresh Token: 
  //--------- If: Refresh token is Invalid (revoked) or Expired(Absolute or Relative), (ie; Revoked RT or Different RT) (HACKED !!!! - REPLAY ATTACK), Logout the user from all browsers.
  //          ie; Revoke (revoked = true) current Refresh Token of hacker (A user will have one active Refresh token per each browser). That's it.
  //--------- Else (Refresh token is Valid and not Expired): 

  const detailRefreshToken = await verifyValidityExpiryRevokeRTService(refreshToken, searchRefreshToken, revokeRefreshToken);

  if (!detailRefreshToken) { // HACKED if Refresh token is different or is a revoked token or is Expired token. 
    // Refresh token revoked if incoming Refresh token is Expired(When RT is expired, it would have been deleted along with the expired cookie.
    // But the hacker got hold to the Expired RT, and send it to us)(ie; Any of Expired combos or Revoked combos or Different RT are filtered out
    // = Revoked-expired, Revoked-nonExpired, Expired-NonRevoked, Different RT)
    // THESE CAN'T BE IN ANY WAY DONE BY USERS. BUT ONLY BY HACKERSS.
    return res.json({ rtError: "INVALID_REFRESH_TOKEN" }); // logout from the current browser or Not give access by setting isLogin false in the React by using this json 

  } else {
    // Refresh token is Valid(non Revoked) and non Expired (Only combo of Refresh token existing after the deletion of combos above)

    //Revoke Refresh Token when User manually Signsout : 
    const reqbody = req.body;
    if (reqbody && reqbody.revokeRefreshToken) {
      await revokeRefreshToken(detailRefreshToken)
      return res.json({ rtError: "REFRESH_TOKEN_IS_REVOKED_BY_SERVER" });
    }


    // JWT 

    //Header containing JWT
    const header = req.get('Authorization');

    let jsonWebToken;
    if (header && header.startsWith('Bearer')) {
      //If there is Authorization header ie; JWT is being send-
      jsonWebToken = header.split(" ")[1];
    } else {
      // There is no JWT being send
      jsonWebToken = null;
    }

    //When i refresh the browser after logged in (In LoggedIn state, i have JWT stored in memory, + RT in cookie), the react page starts
    //afresh - which means i get the Signin page at the same webpage path. To prevent that, i can store the jwt in the local storage (XSS attack
    //can take the jwt) Or I can use the Refresh token in the cookie to generate one jwt from server. The latter is what i will do :
    //I have to use refresh token to create new jwt, then use that new jwt to access the secure route by sending it to server  to 
    //verfiy it, and then create new jwt using Refresh token, and send it back to frontend. Thus i use jwt to move through secure route (login page), and here 
    //i also would have to do 2 requests here.
    //Or you can just go with the Response that i give here (One jwt & UserDetail)
    //that the server sends to the client. Then use it to get User Details,and JWT ofcourse. SIMPLE, FAST, SAFE
    //
    //Remember : Jwt is a token and is the one who lets you through secure routes. Refesh token is the one who lets you create new Jwts.

    if (!jsonWebToken) { // If there is no JWT, Create new one (Only if Refresh token is Valid & Non Expired- that we verified above)
      const fakeUserPayload = { sub: detailRefreshToken.userid };
      const [userDetail] = await searchUser(fakeUserPayload);

      const accessToken = jwtCreatorService(jwt, userDetail);

      res.locals.userDetail = userDetail;
      res.locals.accessToken = accessToken;
      return next();
    }


    try { //jwt Exists, is Valid & not expired

      //           Create new JWT only (Don't create new RT - to prevent waste of DB processing)


      // The Below line may jump to the Catch
      const payload = jwtVerifierService(jwt, jsonWebToken);
      //payload may have expirytime and iat properties. Check it. We don't need it
      const { iat, exp, ...userDetail } = payload;
      //console.log(`userDetail2: ${JSON.stringify(userDetail)}`);

      const accessToken = jwtCreatorService(jwt, userDetail);

      //for Use in the next middleware
      res.locals.accessToken = accessToken;
      res.locals.userDetail = userDetail;
      return next() //res.json({ accessToken });


    } catch (err) {
      console.log(err);

      if (err.name === "TokenExpiredError") { //jwt is expired

        //-------- We have Valid & unexpired RT and Expired JWT: Create new JWT + RT (Revoke old RT)



        //ignoreExpiration = true
        const payload = jwtVerifierService(jwt, jsonWebToken, true);
        const { iat, exp, ...userDetail } = payload;
        //console.log(`userDetail3: ${JSON.stringify(userDetail)}`);

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

        return res.json({ jwtError: "INVALID_JWT" }); //Logout from the browser from which request was send
      }
    }



  }


}
