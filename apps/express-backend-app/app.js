const express = require('express')
const app = express()
const port = 3000

const path = require('path');
const signupRouter = require('./routers/signupRouter');
const userbaseRouter = require('./routers/userbaseRouter.js');
const { userLoginGet, userLoginAuthPost } = require('./controller/loginController.js');

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

app.set('views', ['./view', './view/miniCrud/']);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'view'), { index: false }));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send("<html><head><title>DSA Store</title></head><body><a href=\"/signup\">Signup</a></body></html>");
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


///////////////////////////////////////////////////////////////////




app.get('/questions', (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.json({
    name: 'Amarthya',
    age: 25
  })
})

app.get('/submissions', (req, res) => {
  // return the user's submissions for this problem
  res.json({
    name: 'Amarthya',
    age: 25
  })
})

app.post('/submissions', (req, res) => {
  // let the user submit a problem, randomly accept or reject the () => {
  // store the submission in the SUBMISSION array above.

  res.json({
    name: 'Amarthya',
    age: 25
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Leaving as hard to dos :
// Create a route that lets an admin add a new problem
// ensure that only admins can do that
//
//
//
// Here, we are not doing Databases. So if you turn off your app, then all submitted data will be lost - 
// As we are not yet persisting data into databases
