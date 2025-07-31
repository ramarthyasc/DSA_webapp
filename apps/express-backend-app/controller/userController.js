const userStorage = require('../model/db.js');






// Add code to integrate the DB function and send a response
// to the client
const postUserDetails = function(req, res, next) {
  const { user: { emailId, password } } = req.body;
  console.log(emailId);
  console.log(password);
  userStorage.addUser({ emailId, password });

  res.redirect(`${req.baseUrl}/database`);
}
// A Middleware to display updated database in the redirect GET.
const displayUserDetails = function(req, res) {
  res.send(`Your updated database is here : ${JSON.stringify(userStorage.userDb)}`);
}


module.exports = { postUserDetails, displayUserDetails };
