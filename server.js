const express = require('express')
const Posts = require('./models/post')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

// used for cookies and JWTs
app.use(cookieParser());

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    res.locals.currentUser = req.user

  }
  console.log("current user", req.user)

  next();
};
// Checking Authentication
app.use(checkAuth);

// Set db
require('./data/reddit-db');

require('./controllers/posts.js')(app);

require('./controllers/comments-controller.js')(app);

require('./controllers/auth.js')(app);

require('./controllers/replies.js')(app);

//passwords and security
require('dotenv').config();

var exphbs = require('express-handlebars');
// {defaultLayout: 'main'} >>> In you main.hbs {{{body}}}. double check our RT tutorial
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

module.exports = app;


//LISTEN

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
