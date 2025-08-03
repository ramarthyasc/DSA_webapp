const db = require('../model/userbaseData.js');

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

exports.userCreatePost = (req, res) => {
  db.userCreate(req.body);
  res.redirect(`${req.baseUrl}/list`);
}

exports.userUpdateGet = (req, res) => {
  res.render('userUpdate', {
    user: db.userList()[req.params.id],
  });
}

exports.userUpdatePost = (req, res) => {
  db.userUpdate(req.params.id, req.body);
  res.redirect(`${req.baseUrl}/list`);
}

exports.userDeletePost = (req, res) => {
  db.userDelete(req.params.id);
  res.redirect(`${req.baseUrl}/list`);
}
