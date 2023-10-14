const express = require('express');

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

exports.top_get = (req, res) => {
  if (res.locals.isLoggedIn) {
    return res.redirect('/list');
  }
  res.render('login.ejs');
};

exports.list_get = (req, res, next) => {
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
};

exports.new_get = (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  res.render('new.ejs');
};

exports.create_post = (req, res) => {
  connection.query(
    'INSERT INTO basics (name, department) VALUES (?, ?)',
    [ req.body.employeeName, req.body.departmentName ],
    (error, results) => {
      res.redirect('/list');
    }
  );
};

exports.edit_get = (req, res) => {
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
};

exports.update_post = (req, res) => {
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
};

exports.search_post = (req, res) => {
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
};

exports.fromEdit_get = (req, res) => {
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
};

exports.delete_id_post = (req, res) => {
  connection.query(
    'DELETE FROM basics WHERE id = ?',
    [ req.params.id ],
    (error, results) => {
      res.redirect('/fromEdit');
    }
  );
};

exports.before_signup_get = (req, res) => {
  if (res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  res.render('before-signup.ejs');
};

exports.signup_get = (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/before-signup');
  }
  res.render('signup.ejs', {errors: [] });
};

exports.user_registration_validation = (req, res, next) => {
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
};

exports.user_registration_duplicate_check = (req, res, next) => {
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
};

exports.user_registration = (req, res) => {
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
};

exports.login_post = (req, res) => {
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
            res.redirect('/list');
          } else {
            // !isEqual
            res.redirect('/');
          }
        });
      } else {
        // no results
        res.redirect('/');
      }
    }
  );
};

exports.login_for_signup = (req, res) => {
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
            res.redirect('/signup');
          } else {
            // !isEqual
            res.redirect('/before-signup');
          }
        });
      } else {
        // no results
        res.redirect('/before-signup');
      }
    }
  );
};

exports.logout_get = (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
};
