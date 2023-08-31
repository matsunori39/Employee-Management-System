const express = require('express');
// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
const mysql = require('mysql2');

const app = express();
// const port = 3000;

app.use(express.static('public'));

const connection = mysql.createConnection({
  host: '127.0.0.1',  // Change from 'localhost'
  user: 'root',
  password: 'R00tMysq1',
  database: 'employee'
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM basics',
    (error, results) => {
      // console.log(results);
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/top', (req, res) => {
  res.render('top.ejs');
});

app.listen(3000);
