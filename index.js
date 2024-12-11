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
   res.send("<h1>G00416852</h1>")
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