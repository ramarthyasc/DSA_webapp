const { Router } = require('express');
const signupRouter = Router();


const path = require('path');
const postUserDetails = require('../controller/userController.js');






// Attack this signup first :

//Add logic to decode body
//body should have email & password 
// Store email & pass (as for now) in the USERs array above (only if the use with the given email doesn't exist)
// return 200 OK status code to client
signupRouter.route('/')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../view/', 'index.html'));
  })
  .post(postUserDetails)



module.exports = signupRouter
