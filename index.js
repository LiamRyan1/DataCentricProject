var express = require('express')
var app = express();
var mySql = require('./mySql')
app.set('view engine', 'ejs');
app.set('views', './views');

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