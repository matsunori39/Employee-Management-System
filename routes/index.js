const express = require('express');
const router = express.Router();

const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');
const connection = mysql.createConnection({
  // host: '127.0.0.1',  // Change from 'localhost'
  host: 'employee-management-system-mysql-1',  // Change from 'localhost'
  user: 'root',
  password: 'R00tMysq1',
  database: 'employee'
});

let isSearched = false;
let searchWord = '';
let isBeforeSignup = false;

router.get('/', (req, res) => {
  isBeforeSignup = false;
  if (res.locals.isLoggedIn) {
    return res.redirect('/list');
  }
  res.render('login.ejs');
});

router.get('/list', (req, res, next) => {
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

router.get('/new', (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  res.render('new.ejs');
});

router.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO basics (name, department) VALUES (?, ?)',
    [ req.body.employeeName, req.body.departmentName ],
    (error, results) => {
      res.redirect('/list');
    }
  );
});

router.get('/edit/:id', (req, res) => {
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

router.post('/update/:id', (req, res) => {
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

router.post('/search', (req, res) => {
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

router.get('/fromEdit', (req, res) => {
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

router.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM basics WHERE id = ?',
    [ req.params.id ],
    (error, results) => {
      res.redirect('/fromEdit');
    }
  );
});

router.get('/before-signup', (req, res) => {
  if (res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  isBeforeSignup = true;
  res.render('before-signup.ejs');
});

router.get('/signup', (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/before-signup');
  }
  res.render('signup.ejs', {errors: [] });
});

router.post('/signup',
  (req, res, next) => {
    console.log('Empty check of input values');

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const errors = [];

    if (username === '') {
      errors.push('- ユーザー名が空です');
    }
    if (email === '') {
      errors.push('- メールアドレスが空です');
    }
    if (password.length < 6) {
      errors.push('- パスワードは6文字以上で入力して下さい');
    }

    if (errors.length > 0) {
      res.render('signup.ejs', { errors: errors });
    } else {
      next();
    }
  },
  (req, res, next) => {
    console.log('Check duplicate email addresses');
    const email = req.body.email;
    const errors = [];
    connection.query(
      'SELECT * FROM users WHERE email=?',
      [email],
      (error, results) => {
        if (results.length > 0) {
          errors.push('- 入力されたメールアドレスは登録済みです');
          res.render('signup.ejs', { errors: errors});
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    console.log('User registration');
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (error, hash) => {
      connection.query(
        'INSERT INTO users(username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        (error, results) => {
          req.session.userId = results.insertId;
          req.session.username = username;
          res.redirect('/list');
        }
      );
    });
  }
);

router.post('/login', (req, res) => {
  const email = req.body.email;
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (results.length > 0) {
        const plain = req.body.password;
        const hash = results[0].password;
        bcrypt.compare(plain, hash, (error, isEqual) => {
          if (isEqual) {
            req.session.userId = results[0].id;
            req.session.username = results[0].username;
            if (isBeforeSignup) {
              isBeforeSignup = false;
              res.redirect('/signup');
            } else {
              res.redirect('/list');
            }
          } else {
            // !isEqual
            if (isBeforeSignup) {
              res.redirect('/before-signup');
            } else {
              res.redirect('/');
            }
          }
        });
      } else {
        // no results
        if (isBeforeSignup) {
          isBeforeSignup = false;
          res.redirect('/before-signup');
        } else {
          res.redirect('/');
        }
      }
    }
  );
});

router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
});

module.exports = router;
