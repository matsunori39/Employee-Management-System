const express = require("express");

// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
// import mysql from 'mysql2/promise';
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcrypt");
// const connection = await mysql.createConnection({
const connection = mysql.createConnection({
  // host: '127.0.0.1',  // Change from 'localhost'
  host: "employee-management-system-mysql-1", // Change from 'localhost'
  user: "root",
  password: "R00tMysq1",
  database: "employee",
});

let isSearched = false;
let searchWord = "";

// exports.get_all = async () => {
//   isSearched = false;
//   const [results, ] = await connection.query(
//     'SELECT * FROM basics');
//   return results;
// };
exports.get_all = async () => {
  isSearched = false;
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM basics", (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

exports.create_query = (req, res, next) => {
  connection.query(
    "INSERT INTO basics (name, department) VALUES (?, ?)",
    [req.body.employeeName, req.body.departmentName],
    (error, results) => {
      next();
    }
  );
};

exports.forEdit_query = (req, res) => {
  connection.query(
    "SELECT * FROM basics WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.render("edit.ejs", { item: results[0] });
    }
  );
};

exports.update_query = (req, res) => {
  connection.query(
    "UPDATE basics SET name = ?, department = ? WHERE id = ?",
    [req.body.itemName, req.body.itemDepartment, req.params.id],
    (error, results) => {
      if (isSearched) {
        this.search_query(req, res);
      } else {
        this.list_all_query(req, res);
      }
    }
  );
};

exports.search_query = (req, res) => {
  isSearched = true;
  if (searchWord === "") {
    searchWord = req.body.searchName;
  }
  const query = "SELECT * FROM basics WHERE name LIKE ?";
  const likeWord = "%" + searchWord + "%";
  connection.query(query, [likeWord], (error, results) => {
    res.render("search.ejs", { items: results, word: searchWord });
  });
};

exports.delete_query = (req, res, next) => {
  connection.query(
    "DELETE FROM basics WHERE id = ?",
    [req.params.id],
    (error, results) => {}
  );
};
