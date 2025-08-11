const db = require('../db/userbaseData.js');
const { body, validationResult } = require('express-validator');
const { search } = require('../routers/signupRouter.js');

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
const emaildupErr = 'is already registered';
const validateUser = [
  body('firstName').trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
  body(`lastName`).trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Last name ${lengthErr}`),
  body('emailId').trim()
    .isEmail().withMessage(`Email Id ${emailErr}`)
    .custom(value => {
      if (Object.values(db.userList()).length > 0) {
        for (let detail of Object.values(db.userList())) {
          if (detail.emailId === value) {
            //throw new Error('Email is already registered'); This also works
            return false;
          }
        }
      }
      return true;
    }).withMessage(`Email Id ${emaildupErr}`)
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


exports.userSearchGet = (req, res) => {
  const searchUsers = [];
  if (Object.values(db.userList()).length > 0) {
    for (let searchUser of Object.values(db.userList())) {
      if (searchUser.firstName.toLowerCase() === req.query.searchUsers.toLowerCase()) {
        searchUsers.push(searchUser);
      }
    }
    res.render('userList', {
      searchUsers: searchUsers,
      users: Object.values(db.userList()),
    });
  } else {
    res.render('userList');
  }
}

