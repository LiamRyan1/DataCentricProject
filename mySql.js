var pmysql = require("promise-mysql");

var pool;
pmysql.createPool({
    connectionLimit: 3,
    host: "localhost",
    password: "root",
    user: "root",
    database: "proj2024Mysql",
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
      .query("SELECT * FROM student")
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
var addStudent = function(myQuery){
    return new Promise((resolve, reject) => {
    pool.query(myQuery)
    .then((data) => {
    console.log(data)
    resolve(data);
    })
    .catch((error) => {
    console.log(error)
    reject(error);
    })
    
});
}

module.exports = { getStudents, addStudent};
