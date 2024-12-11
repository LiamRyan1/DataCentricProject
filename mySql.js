var pmysql = require("promise-mysql");

var pool;
pmysql.createPool({
    connectionLimit: 4,
    host: "localhost",
    password: "root",
    user: "root",
    database: "student",
  })
  .then((p) => {
    pool = p;
  })
  .catch((e) => {
    console.log("pool error:" + e);
  });

var getStudents = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student_table")
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

module.exports = { getStudents };
