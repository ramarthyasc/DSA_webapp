const { verifyUserJwt } = require('../service/securerouteServices.js');
const path = require('path');


// These are Secure routes. So I have to implement JWT verifier here. So we use JWT verfication middleware with
// a Verification service.
exports.jwtVerification = (req, res, next) => {
  //Extract JWT from cookie first. Then verify it
  const authJwt = req.cookies.auth_jwt;
  let decodedBody;
  try {
    decodedBody = verifyUserJwt(authJwt); //If verification = success, then returns decodedBody. Otherwise, throws error.
  } catch (err) {
    console.log(err);
    return res.redirect('/login?error=bad_request');
  }

  // You can add a Business logic here - by using the 'decodedBody'- To know if a role is allowed to access a
  // route. If Database has Roles also specified. Then 'admin' can access some routes which the 'user' can't.
  // Such as 'GET /problemCreate' route, ... etc.. admin privileged routes.
  //Create this LOGIC IF NEEDED> Otherwise, don't need to look at the claims in the decodedBody.
  req.decodedBody = decodedBody; //Assign a property to req object.
  next();
}

exports.userHomeGet = (req, res) => {
  res.render('home', {
    id: req.decodedBody.id,
    emailId: req.decodedBody.emailId
  })
}

exports.userProblemsetGet = (req, res) => {
  res.render('problemset', {
    id: req.decodedBody.id,
    emailId: req.decodedBody.emailId
  })
}
