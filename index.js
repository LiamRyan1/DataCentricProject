var express = require("express");
var app = express();
var mySql = require("./mySql");
var dao = require("./DAO");
app.set("view engine", "ejs");
app.set("views", "./views");
var bodyParser = require("body-parser");

const { check, validationResult } = require("express-validator");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log("Get request on /");
  res.send(`
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Home Page</title>
            <style>
               ul {
                    margin: 0;
                    padding: 0;
                    list-style-type: none; 
                }
            </style>
        </head>
        <body>
            <h1>G00416852</h1>
            <div>
            <ul>
                <li><h4><a href = "/students">Students</a></h4></li>
                <li><h4><a href = "/grades">Grades</a></h4></li>
                <li><h4><a href = "/lecturers">Lecturers</a></h4></li>
            </ul>
            </div>
        </body>
        </html>
    `);
});

app.get("/students", (req, res) => {
  mySql
    .getStudents()
    .then((data) => {
      //render so it atapts to the html templaye
      res.render("students", { students: data });
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/students/add", (req, res) => {
  res.render("addStudent", { errors: undefined });
});

app.post(
  "/students/add",
  [
    check("sid")
      .isLength({ min: 4 })
      .withMessage("Should ID should 4 characters"),
    check("name")
      .isLength({ min: 2 })
      .withMessage("Student Name should be at least 2 characters"),
    check("age")
      .isInt({ min: 18 })
      .withMessage("Student age should be at least 18"),
    check("sid").custom(async (sid) => {
      var query = {
        sql: "SELECT * FROM student WHERE sid = ?",
        values: [sid],
      };
      var exists = await mySql.studentExists(query);
      if (exists) {
        throw new Error("Student ID " + sid + " already exists.");
      }
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("addStudent", { errors: errors.errors });
    } else {
      var myQuery = {
        sql: "INSERT INTO student VALUES (?, ?, ?)",
        values: [req.body.sid, req.body.name, req.body.age],
      };
      try {
        await mySql.addStudent(myQuery);
        res.redirect("/students");
      } catch (error) {
        console.log(error);
      }
    }
  }
);
app.get("/students/edit/:sid", (req, res) => {
  const sid = req.params.sid;
  var query = {
    sql: "SELECT * FROM student WHERE sid = ?",
    values: [sid],
  };
  mySql
    .FillStudentData(query)
    .then((data) => {
      res.render("updateStudent", { student: data[0], errors: undefined });
    })
    .catch((error) => {
      console.log(error);
    });
});
app.post(
  "/students/edit/:sid",
  [
    check("name")
      .isLength({ min: 2 })
      .withMessage("Student Name should be at least 2 characters"),
    check("age")
      .isInt({ min: 18 })
      .withMessage("Student age should be at least 18"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("updateStudent", {
        student: { sid: req.body.sid, name: req.body.name, age: req.body.age },
        errors: errors.errors,
      });
    } else {
      var myQuery = {
        sql: "UPDATE student SET name = ?,age =  ? WHERE sid = ?",
        values: [req.body.name, req.body.age, req.body.sid],
      };
      try {
        await mySql.addStudent(myQuery);
        res.redirect("/students");
      } catch (error) {
        console.log(error);
      }
    }
  }
);
app.get("/grades", (req, res) => {
  mySql
    .getGrades()
    .then((data) => {
      //render so it atapts to the html templaye
      res.render("grades", { students: data });
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/lecturers", (req, res) => {
  dao
    .findAll()
    .then((documents) => {
      res.render("lecturers", { lecturers: documents });
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get(`/lecturers/delete/:_id`, (req, res) => {
  const lecID = req.params._id;
  dao
    .delLecturer(lecID)
    .then((result) => {
      // Do Something
      res.redirect("/lecturers");
    })
    .catch((error) => {
      // Do Something
      res.send(error);
    });
});
//listen on port 3004
app.listen(3004, () => {
  console.log("Application listening on port 3004");
});
