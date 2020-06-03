const express = require('express')
const connectDB = require('./src/config/connectDB.js')
const initRouter = require('./src/router/router')
const mongoose = require('mongoose');
let app = express()
let port = 8001;
let hostname = 'localhost'
//Connect to mongodb
connectDB()
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("connect to db"));
initRouter(app)
app.get("/nnn",(req,res)=>{
    res.send({
        test:"tes"
    })
})
app.listen(port, hostname,()=>{
    console.log(`Running at ${hostname}:${port}`)
})