const data = require('../models/db.model')
const request = require('request')
let addkey = async (req, res) => {
    try {
        convertgia()
        //getlatlon(encodeURI("Cầu giấy hà nội"))
        res.send("thanh cong")
    } catch (err) {
        console.log(err)
    }
}


async function getlatlon(address) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://apis.wemap.asia/geocode-1/search?text=${address}&key=vpstPRxkBBTLaZkOaCfAHlqXtCR`,
            json: true
        }, (err, header, body) => {
            if (err) {
                reject(err)
            } else {
                if (body) {
                    if (body.features.length ==0 || body.features ===null) {
                        console.log("rong")
                    } else {
                        let a = body.features[0]
                        if(a.geometry.coordinates===null){
                            console.log('null')
                            const latlon1 ={
                                lat:"",
                                lon:""
                            }
                            resolve(latlon1)
                        }else{
                            let b = a.geometry.coordinates
                            const latlon = {
                                lat: b[1],
                                lon: b[0]
                            }
                            console.log(latlon)
                            resolve(latlon)
                        }    
                    }
                } else {                    
                    reject()
                }
            }
        })
    })
}

async function convertgia() {
    let a = await data.find({lat:"",status:0}).limit(5);
    a.map((e, index) => {
            let price = (e.price).replace('\n', ' ');
            let test = price.replace('triệu / m2', 'khong')
            let test1 = test.replace('triệu / tháng', 'khong')
            let t = test1.split(" ")
            let i = 0
            let cvpricety = 0
            let cvpricetrieu = 0
            let cvpriced = 0
            let cvprice = 0
            if (t.length <= 1) {
                cvprice = price
            } else {
                for (let i = 0; i < t.length; i++) {
                    if (t[i] === "tỷ" || t[i] === "Tỷ") {
                        cvpricety = parseFloat((t[i - 1]).replace(',', '.')) * 1000000000
                    }
                    if (t[i] === "triệu" || t[i] === "Triệu") {
                        cvpricetrieu = parseFloat((t[i - 1]).replace(',', '.')) * 1000000
                    }
                    if (t[i] === "đ") {
                        cvpriced = parseFloat((t[i - 1])) * 1000000000
                    }
                }
                cvprice = parseInt(cvpricety + cvpricetrieu + cvpriced)   
            }
            data.updateOne({ _id: e._id }, { $set: { status: 3, newprice: cvprice } }, (err, res) => {
                if (err) console.log(err)
                console.log(e._id + '  ' + 'update success' + e.price + " " + cvprice)
            })
            console.log(e.lat + ',' + e.lon)
            let newlat = 0
            let newlon = 0
            
            if (e.lat=="") {
                getlatlon(encodeURI(e.address)).then(de => {
                    newlat = de['lat']
                    newlon = de['lon']
                    console.log(newlat)
                    data.updateOne({ _id: e._id }, { $set: { lat: newlat, lon: newlon , status: 3} }, (err, res) => {
                        if (err) console.log(err)
                        console.log(e._id + '  ' + 'update success   :' + newlon + " " + newlat)
                    })
                }).catch(err => {
                    console.log(err)
                })
            }else{
                console.log("da ton tai lat lon")
            }
            
        })
        setTimeout(()=>{
            convertgia()
        },3000)



}

module.exports = addkey;