const data = require('../models/db.model')
const request = require('request')
let getdata = async (req, res) => {
    try {

        //convertgia()

        addUtilities()
        res.send("a")
    } catch (err) {
        console.log(err)
    }
}
let gettest = async (req, res) => {
    try {
        let test = {
            username: "test",
            password: "test2"
        }
        let test2 = await testSchema.createNew(test)
        res.send(test2)
    } catch (err) {
        console.log(err)
    }
}
let convertgia = () => {

    setTimeout(async () => {
        let a = await data.find({ status: 0 }).limit(20);
        a.map(e => {
            let price = e.price;
            let t = price.split(" ")
            let i = 0
            let cvpricety = 0
            let cvpricetrieu = 0
            let cvpriced = 0
            let cvprice = 0
            if (t.length <= 1) {
                cvprice = price
            } else {
                for (i; i < t.length; i++) {
                    if (t[i] == "tỷ") {
                        cvpricety = parseFloat(t[i - 1]) * 1000000000
                    } else {
                        cvpricety = 0
                    }
                    if (t[i] == "triệu") {
                        cvpricetrieu = parseFloat(t[i - 1]) * 1000000
                    } else {
                        cvpricetrieu = 0
                    }
                    if (t[i] == "đ") {
                        cvpriced = parseFloat(t[i - 1]) * 1000000000
                    } else {
                        cvpriced = 0
                    }

                }
                cvprice = parseInt(cvpricety + cvpricetrieu + cvpriced)
            }

            data.updateOne({ price: e.price }, { $set: { price: cvprice, status: 1 } }, (err, res) => {
                if (err) console.log(err)
                console.log('update success' + e.price + " " + cvprice)
            })

        })

    }, 2000)
    convertgia()
}

function getlatlon(address) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://apis.wemap.asia/geocode-3/api?q=${address}&key=vpstPRxkBBTLaZkOaCfAHlqXtCR`,
            json: true
        }, (err, header, body) => {
            if (err) {
                reject(err)
            } else {
                if (body) {
                    let a = body.features[0]
                    if (a == null) {
                        console.log("rong")
                    } else {
                        let b = a.geometry.coordinates
                        const latlon = {
                            lat: b[1],
                            lon: b[0]
                        }
                        console.log(latlon)
                        resolve(latlon)
                    }
                } else {
                    //console.log(body)
                    reject()
                }
            }
        })
    })
}
function run(){
    addUtilities().then(e=>{
        addUtilities()
    })
}
async function addUtilities() {
    let a = await data.find({ status: 3 }).limit(4)
    a.map((e, index) => {     
            if (e.lon == "" || e.lat == "" || e.lat == null || e.lat == 0) {
                console.log("Không có lat lon")
            } else {
                getUltilities(e.lat, e.lon).then(te => {
                    console.log(te)
                    if (te.length !== 0) {
                        let hospital = te.find(tes => tes.type === "hospital")
                        let clinic = te.find(tes => tes.type === "clinic")
                        let pharmacy = te.find(tes => tes.type === "pharmacy")
                        let kindergarten = te.find(tes => tes.type === "kindergarten")
                        let school = te.find(tes => tes.type === "school")
                        let university = te.find(tes => tes.type === "university")
                        let college = te.find(tes => tes.type === "college")
                        let mall = te.find(tes => tes.type === "mall")
                        let supermarket = te.find(tes => tes.type === "supermarket")
                        let convenience = te.find(tes => tes.type === 'convenience')
                        let cafe = te.find(tes => tes.type === "cafe")
                        let parking = te.find(tes => tes.type === "parking")
                        let bus_station = te.find(tes => tes.type === "bus_station")
                        let police = te.find(tes => tes.type === "police")
                        let bank = te.find(tes => tes.type === "bank")
                        let marketplace = te.find(tes => tes.type === 'marketplace')
                        let zoo = te.find(tes => tes.type === "zoo")
                        let medical_supply = te.find(tes => tes.type = "medical_supply")
                        console.log(hospital["count"] + ' ' + clinic["count"] + ' ' + pharmacy["count"] + ' ' + kindergarten["count"])
                        data.updateOne({ _id: e._id }, {
                            $set: {
                                hospital: hospital["count"],
                                clinic: clinic["count"],
                                pharmacy: pharmacy["count"],
                                kindergarten: kindergarten["count"],
                                school: school["count"],
                                university: university["count"],
                                college: college["count"],
                                mall: mall["count"],
                                supermarket: supermarket["count"],
                                convenience: convenience["count"],
                                cafe: cafe["count"],
                                parking: parking["count"],
                                bus_station: bus_station["count"],
                                police: police["count"],
                                bank: bank["count"],
                                marketplace: marketplace["count"],
                                zoo: zoo["count"],
                                medical_supply: medical_supply["count"],
                                status: 4
                            }
                        }, (err, res) => {
                            if (err) console.log(err)
                            console.log(e._id + 'update success' + e.price + hospital["count"])
                        })
                    } else {
                        console.log('rỗng')
                    }
                }).catch(err => {
                    console.log(err)
                })
            }


    })
    setTimeout(()=>{
        addUtilities()
    },4000)

}

function getUltilities(lat, lon) {
    let e = { lat, lon }
    return new Promise((resolve, reject) => {
        request({
            url: `http://localhost:8001/allplace?lat=${lat}&lon=${lon}`,
            json: true
        }, (err, header, body) => {
            if (err) {
                reject(err)
            } else {
                if (body) {
                    let arrr = []
                    body.map(item => {
                        let distance = []
                        let count = 0
                        if (item.point) {
                            item.point.map(val => {
                                distance.push(getDistance(val, e))
                                if (distance.length > 0) {
                                    count = distance.length
                                }
                            })
                            const arr = {
                                type: item.type,
                                count: count
                            }
                            arrr.push(arr)
                        }
                    })
                    resolve(arrr)
                } else {
                    console.log(body)
                    reject()
                }
            }
        }
        )
    })

}
function getDistance(pointUl, poinClick) {
    var lon1 = toRadian(pointUl.lon),
        lat1 = toRadian(pointUl.lat),
        lon2 = toRadian(poinClick.lon),
        lat2 = toRadian(poinClick.lat);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS;
}
function toRadian(degree) {
    return degree * Math.PI / 180;
}
module.exports = {
    getdata: getdata,
    gettest: gettest

}