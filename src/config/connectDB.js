const mongoose = require('mongoose')
const bluebird = require('bluebird')
let connectDB = ()=>{
    mongoose.Promise = bluebird;
    let DB_CONNECTION = "mongodb";
    let DB_HOST = "localhost";
    let DB_PORT = "27017";
    let DB_NAME ="data2";
    let DB_USERNAME = "";
    let DB_PASSWORD = "";
    let URI= `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    return mongoose.connect(URI,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true})
}
module.exports = connectDB;