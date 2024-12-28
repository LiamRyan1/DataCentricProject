const { ObjectId } = require('mongodb')

const MongoClient = require('mongodb').MongoClient
//connect to mongo db
MongoClient.connect('mongodb://127.0.0.1:27017')
.then((client) => {
db = client.db('proj2024MongoDB')
coll = db.collection('proj2024MongoDB')
})
.catch((error) => {
console.log(error.message)
})

var findAll = function() {
    return new Promise((resolve, reject) => {
    //find all docs in coll and sort by ascending
    var cursor = coll.find().sort({ _id: 1 }); 
    //convert to array and send return result
    cursor.toArray()
    .then((documents) => {
    resolve(documents)
    })
    .catch((error) => {
    reject(error)
    })
    })
}

var delLecturer = function(lecID) {
    return new Promise((resolve, reject) => {
    coll.deleteOne({_id:lecID})
    .then((documents) => {
    resolve(documents)
    })
    .catch((error) => {
    reject(error)
    })
    })
    }
module.exports = {findAll, delLecturer};