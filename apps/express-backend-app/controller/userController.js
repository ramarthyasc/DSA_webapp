const db = require('../model/db.js');


const postUserDetails = function(req, res, next) {
  // Add code to integrate the DB function and send a response
  // to the client
  db.postUserDetails(req.body);

  res.send(`Your updated database is here : ${JSON.stringify(db.userDb)}`);
}

module.exports = postUserDetails;
