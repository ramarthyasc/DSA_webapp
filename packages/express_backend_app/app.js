const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser');


const path = require('path');
const signupRouter = require('./routers/signupRouter');
const userbaseRouter = require('./routers/userbaseRouter.js');
const { userLoginGet, userLoginAuthPost } = require('./controller/loginController.js');
const { jwtVerification, userHomeGet, userProblemsetGet } = require('./controller/secureController.js')
const { gameDetailGet } = require('./controller/gameDetailController.js');
const { googleJwtVerifyPost, jwtRefreshTokenCreatorPost } = require('./controller/drawLoginController.js');
const { rotatingRefreshTokenAndJwt } = require('./controller/drawRotRefreshTokenController.js');
const { secureRouteGet } = require('./controller/drawSecureRouteController.js')
const { preflightOptionsSetter, corsAllowResponseSetter } = require('./controller/drawCorsController.js');

const USERS = [];
const QUESTIONS = [{
  title: "Two sum",
  description: "Find two numbers in a list which sums upto a target number specified",
  testCases: [{
    input: "[1,2,3,4], 7",
    output: 4
  }]
}]

const SUBMISSION = [{}]


///////////////////////////////////////////////////////////////////
//DrawLogin App


//DrawLogin App

app.set('views', [
  path.join(__dirname, 'view'),
  path.join(__dirname, 'view/miniCrud/'),
  path.join(__dirname, 'assets')
]);

app.set('view engine', 'ejs');

app.get('views').forEach(view => {
  app.use(express.static(view, { index: false }))
})
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //cookieParser() returns a middleware.
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/index.html'));
});
app.use('/admin', userbaseRouter); //Mini-CRUD app
app.use('/signup', signupRouter);

//For Login, Add logic to decode body
//body should have email & password 

//Check if the user with the given email exists in the USERs array
//Also ensure that the password is the same
//If pass is same, return 200 status code to client.
//If the password not same, return back 401 status code to client.
app.route('/login')
  .get(userLoginGet)
  .post(userLoginAuthPost);

//secure routes
app.get('/home', jwtVerification, userHomeGet);
app.get('/problemset', jwtVerification, userProblemsetGet);

//DrawLogin App

app.get('/algogame/:id', gameDetailGet);

app.options('/*splat', preflightOptionsSetter);
app.post('/draw-login', corsAllowResponseSetter, googleJwtVerifyPost, jwtRefreshTokenCreatorPost);
app.get('/draw-secure', corsAllowResponseSetter, rotatingRefreshTokenAndJwt, secureRouteGet);
app.post("/draw-secure", corsAllowResponseSetter, rotatingRefreshTokenAndJwt);
//Can use the rotatingRefreshTokenAndJwt controller for any website which needs Rotating Refresh token system


//DrawLogin App
///////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`localhost @ port: ${port}`);
})
