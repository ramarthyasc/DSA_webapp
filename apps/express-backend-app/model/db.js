// Contains all the queries.


const userDb = {
  emailId: [

  ],
  password: [

  ]
};


// Add a function to get the input from the cient side to store in the mock Database above.

const postUserDetails = function(userDetail) {
  userDb.emailId.push(userDetail.user.emailId);
  userDb.password.push(userDetail.user.password);
}

module.exports = { postUserDetails, userDb };
