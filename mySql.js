var pmysql = require("promise-mysql");

var pool;
//create a pool ,limit connections to 3
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
//fetch students from the student table
var getStudents = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM student")
      .then((data) => {
        console.log(data);
        //return fetched data
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
//reads in custom query 
var addStudent = function(myQuery){
    return new Promise((resolve, reject) => {
      //execute query
    pool.query(myQuery)
    .then((data) => {
      //resolve with the result data
    console.log(data)
    resolve(data);
    })
    .catch((error) => {
    console.log(error)
    reject(error);
    })
    
});
}

var Exists = function(id) {
  return new Promise((resolve, reject) => {
    pool.query(id)
    .then((data) => {
    if(data.length > 0)
    {
      resolve(true);//resolve wiht true if result is longer than 0
    }
    else
    {
    resolve(false);//result false
    }
    })
    .catch((error) => {
    console.log(error)
    reject(error);
    })
  })
}
//retrieve  student based on sid
var FillStudentData = function(sid) {
  return new Promise((resolve, reject) => {
    pool.query(sid)
    .then((data) => {
    if(data.length > 0)
    {
      resolve(data);
    }
    else
    {
    resolve(data);
    }
    })
    .catch((error) => {
    console.log(error)
    reject(error);
    })
  })
}
var getGrades = function () {
  return new Promise((resolve, reject) => {
    pool
      .query(`SELECT student.name AS student,
        module.name AS module,
        grade.grade AS grade From student Left join grade ON student.sid = grade.sid
        LeFT JOIN module On grade.mid = module.mid Order by student.name ASC, grade ASC;`)
      .then((data) => {
        console.log(data);
        resolve(data);//resolvew with grades data
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};


module.exports = { getStudents, addStudent,Exists,FillStudentData,getGrades};
