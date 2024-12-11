var express = require('express')
var app = express();
var mySql = require('./mySql')
app.set('view engine', 'ejs');
app.set('views', './views');
var bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator');
app.use(bodyParser.urlencoded({extended: false}))
//listen on port 3004
app.listen(3004,()=>{
    console.log("Application listening on port 3004");
})

app.get("/",(req,res)=>{
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
})

app.get("/students",(req,res)=>{
    mySql.getStudents()
    .then((data) => {
        //render so it atapts to the html templaye 
        res.render('students',{ students: data });
    })
    .catch((error) => {
        res.send(error)
    })
})
app.get("/students/add",(req,res)=>{
    mySql.getStudents()
    .then((data) => {
        //render so it atapts to the html templaye 
        res.render('addStudent',{"errors":undefined});
    })
    .catch((error) => {
        res.send(error)
    })
})
app.post("/students/add",
    [
    check("sid").isLength({min:4}).withMessage("Should ID should 4 characters"),
    check("name").isLength({min:2}).withMessage("Student Name should be at least 2 characters"),
    check("age").isInt({min:18}).withMessage("Student age should be at least 18"), 
    check("sid").custom(async (sid) =>{
        var query = {
            sql: 'SELECT * FROM student WHERE sid = ?',
            values: [sid]
        }
        var exists = await  mySql.studentExists(query);
        if (exists) {
            throw new Error("Student with this ID already exists.");
        }
    })
    ],
    async (req, res) => {
    const errors = validationResult(req)
   
    if(!errors.isEmpty())
    {
        res.render("addStudent",{"errors":errors.errors})
        
    }
    else{
        var myQuery = {
            sql: 'INSERT INTO student VALUES (?, ?, ?)',
            values: [req.body.sid, req.body.name, req.body.age]
            }
            try {
            await mySql.addStudent(myQuery);
            res.redirect("/students");
            }
            catch(error){
                console.log(error);
            }
    }
        
  
})