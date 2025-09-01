const { body, validationResult } = require('express-validator');
const { signupHashService, displayUserService, addUserService, validateAddUserService } = require('../service/signupServices.js');
//Dependency Inversion
const { listUser, addUser } = require("../model/testqueries.js");

exports.userSignupGet = (req, res) => {
  res.render('signup', {
    message: 'Sign in to enter the world of Algorithms',
  });
}


// Add code to integrate the DB function and send a response
// to the client
exports.addUserPost = [
  validateAddUserService.emailValidator(body, listUser),
  validateAddUserService.passwordValidator(body),
  async function(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // Here, I didn't redirect, because, there is no perceived problem even if the person refreshes and resubmits the post request.
      return res.status(400).render('signup', {
        errors: result.array(),
        message: 'Welcome to the world of Algorithms',
      });
    }
    const userDetail = req.body;
    let hashedPass;
    try {
      hashedPass = await signupHashService(userDetail.password);
    } catch (err) {
      return res.status(500).send(`${err}`);
    };

    //Changing the userDetail object's password property's value to hashed value
    userDetail.password = hashedPass;

    //Adding user into database
    await addUserService(userDetail, addUser);

    res.redirect(`/login`);
  },
]



// A Middleware to display updated database in the redirect GET.
exports.displayUserGet = async function(req, res) {

  const text = await displayUserService(listUser);
  res.send(`Updated database is here : ${text}`);
}


