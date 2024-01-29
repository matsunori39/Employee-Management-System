// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
// Get the client
import mysql from 'mysql2/promise';
// import mysql from "mysql2";

// Create the connection to database
const connection = await mysql.createConnection({
// const connection = mysql.createConnection({
  // host: '127.0.0.1',  // Change from 'localhost'
  host: "employee-management-system-mysql-1", // Change from 'localhost'
  user: "root",
  password: "R00tMysq1",
  database: "employee",
});

let isSearched = false;
let searchWord = "";

export const get_all = async () => {
  isSearched = false;
  const [results, fields] = await connection.query(
    'SELECT * FROM basics'
  );
  return results;
};

export const create_query = async (req, res) => {
  const [results, fields] = await connection.query(
    'INSERT INTO basics (name, department) VALUES (?, ?)',
    [req.body.employeeName, req.body.departmentName]
  );
};

export const forEdit_query = async (req, res) => {
  const [results, fields] = await connection.query(
    "SELECT * FROM basics WHERE id = ?",
    [req.params.id]
  );
  return results;
};

export const update_query = async (req, res) => {
  const [results, fields] = await connection.query(
    "UPDATE basics SET name = ?, department = ? WHERE id = ?",
    [req.body.itemName, req.body.itemDepartment, req.params.id],
  );
  return results;
};

export const search_query = async (searchWord) => {
  isSearched = true;
  const likeWord = "%" + searchWord + "%";
  const [results, fields] = await connection.query(
    "SELECT * FROM basics WHERE name LIKE ?",
    [likeWord]
  );
  return results;
};

export const delete_query = async (idToDelete) => {
  const [results, fields] = await connection.query(
    "DELETE FROM basics WHERE id = ?",
    [idToDelete]
  )
};
