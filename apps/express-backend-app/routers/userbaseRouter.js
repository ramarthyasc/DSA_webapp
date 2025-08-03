const { Router } = require('express');
const userbaseRouter = Router();
const { userListGet, userCreateGet, userCreatePost, userAdminGet, userUpdateGet, userUpdatePost, userDeletePost } =
  require('../controller/userbaseController.js')

userbaseRouter.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl; //manually created 'baseUrl' property in res.locals, and gave it's value as req.baseUrl
  next();
})

userbaseRouter.get('/', userAdminGet);

userbaseRouter.get('/list', userListGet);

userbaseRouter.route('/create')
  .get(userCreateGet)
  .post(userCreatePost);

userbaseRouter.route('/update/:id')
  .get(userUpdateGet)
  .post(userUpdatePost);

userbaseRouter.post('/delete/:id', userDeletePost);

// userbaseRouter.get('/search', userSearchGet);

module.exports = userbaseRouter;
