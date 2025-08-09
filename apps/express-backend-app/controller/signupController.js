const userStorage = require('../model/db.js');
const { body, validationResult } = require('express-validator');
const { signupHash } = require('../service/signupHash.js');
const signupRouter = require('../routers/signupRouter.js');

exports.userSignupGet = (req, res) => {
  res.render('index', {
    message: 'Sign in to enter the world of Algorithms',
  });
}
// Validation
const validateUser = [
  body('emailId').trim()
    .isEmail().withMessage('Please enter a valid Email ID').bail()
    .custom((value) => {
      const userArray = Object.values(userStorage.listUser());
      for (let user of userArray) {
        if (user.emailId === value) return false;
      }
      return true;
    }).withMessage('Email ID is already registered'),
  body('password')
    .isStrongPassword().withMessage('Password require minimum 8 characters and atleast one number, one symbol, one lowercase and one uppercase letter')
    .bail()
    .custom((value, { req }) => {
      return value == req.body.confirmPassword ? true : false;
    }).withMessage('Passwords do not match'),
];


// Add code to integrate the DB function and send a response
// to the client
exports.addUserPost = [
  ...validateUser,
  async function(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // Here, I didn't redirect, because, there is no perceived problem even if the person refreshes and resubmits the post request.
      return res.status(400).render('index', {
        errors: result.array(),
        message: 'Welcome to the world of Algorithms',
      });
    }


    const userDetail = req.body;
    let hashedPass;
    try {
      hashedPass = await signupHash(userDetail.password);
    } catch (err) {
      return res.status(500).send(`${err}`);
    };

    //Changing the userDetail object's password property's value to hashed value
    userDetail.password = hashedPass;

    userStorage.addUser(userDetail);
    res.redirect(`${req.baseUrl}/database`);
  },
]

// A Middleware to display updated database in the redirect GET.
exports.displayUserGet = function(req, res) {
  res.send(`Your updated database is here : ${JSON.stringify(userStorage.userDb)}`);
}


