const { Router } = require('express');
const signupRouter = Router();
const { userSignupGet, addUserPost, displayUserGet } = require('../controller/signupController.js');


//Middleware for setting a localvariable in the locals object - which is a property of response object.
//This variable can be used by server and also the EJS (Embedded JS in the HTML)
signupRouter.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl;
  next();
})



// Attack this signup first :

//Add logic to decode body
//body should have email & password 
// Store email & pass (as for now) in the USERs array above (only if the use with the given email doesn't exist)
// return 200 OK status code to client
signupRouter.route('/')
  .get(userSignupGet)
  .post(addUserPost);

signupRouter.get('/database', displayUserGet);

module.exports = signupRouter;
