const e = require('express');
const express = require('express');
// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
// const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(
  session({
    secret: 'itsy_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

const connection = mysql.createConnection({
  host: '127.0.0.1',  // Change from 'localhost'
  user: 'root',
  password: 'R00tMysq1',
  database: 'employee'
});

let isSearched = false;
let searchWord = '';

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.get('/', (req, res) => {
  if (res.locals.isLoggedIn) {
    return res.redirect('/list');
  }
  res.render('login.ejs');
});

app.get('/list', (req, res, next) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  connection.query(
    'SELECT * FROM basics',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
  isSearched = false;
});

app.get('/new', (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO basics (name, department) VALUES (?, ?)',
    [ req.body.employeeName, req.body.departmentName ],
    (error, results) => {
      res.redirect('/list');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  connection.query(
    'SELECT * FROM basics WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE basics SET name = ?, department = ? WHERE id = ?',
    [ req.body.itemName, req.body.itemDepartment, req.params.id ],
    (error, results) => {
      if (isSearched) {
        const query = 'SELECT * FROM basics WHERE name LIKE ?';
        const likeWord = '%' + searchWord + '%';
        connection.query(
          query,
          [ likeWord ],
          (error, results) => {
            res.render('search.ejs', {items: results, word: searchWord});
          }
        );
      } else {
        res.redirect('/list');
      }
    }
  );
});

app.post('/search', (req, res) => {
  searchWord = req.body.searchName;
  const query = 'SELECT * FROM basics WHERE name LIKE ?';
  const likeWord = '%' + searchWord + '%';
  connection.query(
    query,
    [ likeWord ],
    (error, results) => {
      res.render('search.ejs', {items: results, word: searchWord});
    }
  );
  isSearched = true;
});

app.get('/fromEdit', (req, res) => {
  if (isSearched) {
    const query = 'SELECT * FROM basics WHERE name LIKE ?';
    const likeWord = '%' + searchWord + '%';
    connection.query(
      query,
      [ likeWord ],
      (error, results) => {
        res.render('search.ejs', {items: results, word: searchWord});
      }
    );
  } else {
    res.redirect('/list');
  }
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM basics WHERE id = ?',
    [ req.params.id ],
    (error, results) => {
      res.redirect('/fromEdit');
    }
  );
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  connection.query(
    'INSERT INTO users(username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (error, results) => {
      req.session.userId = results.insertId;
      req.session.username = username;
      res.redirect('/list');
    }
  );
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (results.length > 0) {
        if (req.body.password === results[0].password) {
          req.session.userId = results[0].id;
          req.session.username = results[0].username;
          res.redirect('/list');
        } else {
          res.redirect('/');
        }
      } else {
        res.redirect('/');
      }
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
});

app.listen(3000);
