import * as employee from "../models/employee.js";

// // For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
// import mysql from "mysql2";
// import bcrypt from "bcrypt";
// const connection = mysql.createConnection({
//   // host: '127.0.0.1',  // Change from 'localhost'
//   host: "employee-management-system-mysql-1", // Change from 'localhost'
//   user: "root",
//   password: "R00tMysq1",
//   database: "employee",
// });

let isFromList = false;
let searchWord = "";

export const top_get = (req, res) => {
  if (res.locals.isLoggedIn) {
    return list_redirect(req, res);
  }
  res.render("login.ejs");
};

export const list_redirect = (req, res) => {
  res.redirect("/list");
};

// export const loggedIn_check = (req, res, next) => {
//   if (!res.locals.isLoggedIn) {
//     return res.redirect("/");
//   }
//   next();
// };

export const list_get = async (req, res) => {
  isFromList = true;
  const results = await employee.get_all_employee();
  await res.render("index.ejs", { items: results });
};

export const new_render = (req, res) => {
  res.render("new.ejs");
};

export const create_post = (req, res, next) => {
  employee.create_employee(req, res);
  next();
};

export const edit_get = async (req, res) => {
  const results = await employee.forEdit_employee(req, res);
  await res.render("edit.ejs", { item: results[0] });
};

// export const edit_render = (req, res) => {
//   res.render('edit.ejs', {item: res.locals.results[0]});
// };

export const update_post = async (req, res) => {
  await employee.update_employee(req, res);
  if (isFromList) {
    list_get(req, res);
  } else {
    // isFromList = false;
    // const results = await get_all();
    // await res.render("index.ejs", { items: results });
    search_post(req, res);
  }
};

export const search_post = async (req, res) => {
  if (isFromList) {
    searchWord = req.body.searchName;
  }
  isFromList = false;
  const results = await employee.search_employee(searchWord);
  await res.render("search.ejs", { items: results, word: searchWord });
};

export const fromEdit_get = (req, res) => {
  if (isFromList) {
    list_redirect(req, res);
  } else {
    search_post(req, res);
  }
};

export const delete_id_post = async (req, res, next) => {
  employee.delete_employee(req.params.id);
  next();
};

// export const before_signup_get = (req, res) => {
//   if (res.locals.isLoggedIn) {
//     return res.redirect("/");
//   }
//   res.render("before-signup.ejs");
// };

// export const signup_get = (req, res) => {
//   if (!res.locals.isLoggedIn) {
//     return res.redirect("/before-signup");
//   }
//   res.render("signup.ejs", { errors: [] });
// };

// export const user_registration_validation = (req, res, next) => {
//   const username = req.body.username;
//   const email = req.body.email;
//   const password = req.body.password;

//   const errors = [];

//   if (username === "") {
//     errors.push("- ユーザー名が空です");
//   }
//   if (email === "") {
//     errors.push("- メールアドレスが空です");
//   }
//   if (password.length < 6) {
//     errors.push("- パスワードは6文字以上で入力して下さい");
//   }

//   if (errors.length > 0) {
//     res.render("signup.ejs", { errors: errors });
//   } else {
//     next();
//   }
// };

// export const user_registration_duplicate_check = (req, res, next) => {
//   const email = req.body.email;
//   const errors = [];
//   connection.query(
//     "SELECT * FROM users WHERE email=?",
//     [email],
//     (error, results) => {
//       if (results.length > 0) {
//         errors.push("- 入力されたメールアドレスは登録済みです");
//         res.render("signup.ejs", { errors: errors });
//       } else {
//         next();
//       }
//     }
//   );
// };

// export const user_registration = (req, res) => {
//   const username = req.body.username;
//   const email = req.body.email;
//   const password = req.body.password;
//   bcrypt.hash(password, 10, (error, hash) => {
//     connection.query(
//       "INSERT INTO users(username, email, password) VALUES (?, ?, ?)",
//       [username, email, hash],
//       (error, results) => {
//         req.session.userId = results.insertId;
//         req.session.username = username;
//         res.redirect("/list");
//       }
//     );
//   });
// };

// export const login_post = (req, res) => {
//   const email = req.body.email;
//   connection.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email],
//     (error, results) => {
//       if (results.length > 0) {
//         const plain = req.body.password;
//         const hash = results[0].password;
//         bcrypt.compare(plain, hash, (error, isEqual) => {
//           if (isEqual) {
//             req.session.userId = results[0].id;
//             req.session.username = results[0].username;
//             res.redirect("/list");
//           } else {
//             // !isEqual
//             res.redirect("/");
//           }
//         });
//       } else {
//         // no results
//         res.redirect("/");
//       }
//     }
//   );
// };

// export const login_for_signup = (req, res) => {
//   const email = req.body.email;
//   connection.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email],
//     (error, results) => {
//       if (results.length > 0) {
//         const plain = req.body.password;
//         const hash = results[0].password;
//         bcrypt.compare(plain, hash, (error, isEqual) => {
//           if (isEqual) {
//             req.session.userId = results[0].id;
//             req.session.username = results[0].username;
//             res.redirect("/signup");
//           } else {
//             // !isEqual
//             res.redirect("/before-signup");
//           }
//         });
//       } else {
//         // no results
//         res.redirect("/before-signup");
//       }
//     }
//   );
// };

// export const logout_get = (req, res) => {
//   req.session.destroy((error) => {
//     res.redirect("/");
//   });
// };
