const argon2 = require("argon2");



exports.signupHashService = async function(password) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw err;
  };
}

exports.displayUserService = async function(listUser) {
  const rows = await listUser();
  let text = "</br>";
  for (let row of rows) {
    text += JSON.stringify(row) + "</br>";
  }

  return text;

}

// Validation Service - can pass in fake req when testing (Don't need to start express). Thus this function is independent for unit test.
exports.validateAddUserService = {
  emailValidator: (body, listUser) => {
    return body('emailId').trim()
      .isEmail().withMessage('Please enter a valid Email ID').bail()
      .custom(async (value) => {
        let userArray;
        try {
          userArray = await listUser();
        } catch (err) {
          throw new Error("Internal Server Error");
        }
        //check if there is same email present.
        if (userArray == []) {
          return true;
        } else {
          for (let user of userArray) {
            if (user.email_id === value) throw new Error('Email ID is already registered');
          }
          return true;
        }
      })
  },
  passwordValidator: (body) => {
    return body('password')
      .isStrongPassword().withMessage('Password require minimum 8 characters and atleast one number,' +
        'one symbol, one lowercase and one uppercase letter')
      .bail()
      .custom((value, { req }) => {
        return value == req.body.confirmPassword ? true : false;
      }).withMessage('Passwords do not match')
  }
};

exports.addUserService = async function(userDetail, addUser) {
  await addUser(userDetail);
}
