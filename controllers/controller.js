const express = require('express');

const query = require("../models/model");

// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
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
    return this.list_redirect(req, res);
  }
  res.render('login.ejs');
};

exports.list_redirect = (req, res) => {
  res.redirect('/list');
};

exports.loggedIn_check = (req, res, next) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/');
  }
  next();
};

exports.list_get = async (req, res) => {
  isSearched = false;
  const results = await query.get_all();
  await res.render('index.ejs', {items: results});
};

exports.new_render = (req, res) => {
  res.render('new.ejs');
};

exports.create_post = (req, res, next) => {
  query.create_query(req, res, next);
};

exports.edit_get = (req, res) => {
  query.forEdit_query(req, res);
}

exports.edit_render = (req, res) => {
  res.render('edit.ejs', {item: res.locals.results[0]});
};

exports.update_post = (req, res) => {
  query.update_query(req, res);
};

exports.search_post = (req, res) => {
  isSearched = true;
  query.search_query(req, res);
};

exports.fromEdit_get = (req, res) => {
  if (isSearched) {
    this.search_post(req, res);
  } else {
    this.list_redirect(req, res);
  }
};

exports.delete_id_post = (req, res, next) => {
  query.delete_query(req, res, next);
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
