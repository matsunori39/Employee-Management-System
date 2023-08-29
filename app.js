const express = require('express');
const mysql = require('mysql2');

const app = express();
// const port = 3000;

app.use(express.static('public'));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'R00tMysq1',
  database: 'employee'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM basics',
    (error, results) => {
      console.log(results);
      res.render('hello.ejs');
    }
  );
});

app.get('/top', (req, res) => {
  res.render('top.ejs');
});

app.listen(3000);
