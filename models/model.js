// For support of MySQL 8.0's default authentication method (caching_sha2_password) in Node.js, use 'mysql2'
// import mysql from 'mysql2/promise';
import mysql from "mysql2";
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

// export const get_all = async () => {
//   isSearched = false;
//   const [results, ] = await connection.query(
//     'SELECT * FROM basics');
//   return results;
// };
export const get_all = async () => {
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

export const create_query = (req, res, next) => {
  connection.query(
    "INSERT INTO basics (name, department) VALUES (?, ?)",
    [req.body.employeeName, req.body.departmentName],
    (error, results) => {
      next();
    }
  );
};

export const forEdit_query = (req, res) => {
  connection.query(
    "SELECT * FROM basics WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.render("edit.ejs", { item: results[0] });
    }
  );
};

export const update_query = async (req, res) => {
  connection.query(
    "UPDATE basics SET name = ?, department = ? WHERE id = ?",
    [req.body.itemName, req.body.itemDepartment, req.params.id],
    async (error, results) => {
      if (isSearched) {
        search_query(req, res);
      } else {
        // this.list_all_query(req, res);
        // list_all_query(req, res);
        isSearched = false;
        const results = await get_all();
        await res.render('index.ejs', {items: results});
      }
    }
  );
};

export const search_query = (req, res) => {
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

export const delete_query = (req, res, next) => {
  connection.query(
    "DELETE FROM basics WHERE id = ?",
    [req.params.id],
    (error, results) => {}
  );
};
