const express = require ("express")
let router = express.Router()
const getdata = require('../controller/getdata.controller')
const testtienich = require("../controller/tienich.controller")
const addkey = require('../controller/addkey.controller')
let initRouters =(app) =>{
    router.get('/getdata',getdata.getdata)
    router.get('/allplace',testtienich)
    router.get('/addkey',addkey)
    return app.use("/",router)
}
module.exports = initRouters;