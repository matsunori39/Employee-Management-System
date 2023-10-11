const express = require('express');
// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
// const mysql = require('mysql2');
const session = require('express-session');
// const bcrypt = require('bcrypt');
const app = express();
// const port = 3000;

const routes = require('./routes/index');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(
  session({
    secret: 'itsy_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

// const connection = mysql.createConnection({
//   // host: '127.0.0.1',  // Change from 'localhost'
//   host: 'employee-management-system-mysql-1',  // Change from 'localhost'
//   user: 'root',
//   password: 'R00tMysq1',
//   database: 'employee'
// });

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3000);
