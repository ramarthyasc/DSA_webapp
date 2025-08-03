const db = require('../model/userbaseData.js');
const { body, validationResult } = require('express-validator')

exports.userAdminGet = function(req, res) {
  res.send("<html><head><title>Admin</title></head><body><a href=' " +
    req.baseUrl + "/list'>User List</a></body></html>");
}

exports.userListGet = function(req, res) {
  res.render('userList', {
    users: Object.values(db.userList()),
  });
}

exports.userCreateGet = (req, res) => {
  res.render('userCreate');
}

// Validation&Sanitization Middleware functions array
const lengthErr = 'must be between 1 and 20 characters';
const alphaErr = 'must contain only letters';
const emailErr = 'must be valid';
const validateUser = [
  body('firstName').trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
  body(`lastName`).trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Last name ${lengthErr}`),
  body('emailId').trim()
    .isEmail().withMessage(`Email Id ${emailErr}`)
];

exports.userCreatePost = [
  validateUser,
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).render('userCreate', {
        errors: result.array(),
      });
    }

    //Store the details in database object
    db.userCreate(req.body);
    res.redirect(`${req.baseUrl}/list`);
  }
]

exports.userUpdateGet = (req, res) => {
  res.render('userUpdate', {
    user: db.userList()[req.params.id],
  });
}


exports.userUpdatePost = [
  validateUser,
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).render('userUpdate', {
        errors: result.array(),
        user: db.userList()[req.params.id],
      });
    }
    db.userUpdate(req.params.id, req.body);
    res.redirect(`${req.baseUrl}/list`);
  }
]

exports.userDeletePost = (req, res) => {
  db.userDelete(req.params.id);
  res.redirect(`${req.baseUrl}/list`);
}
