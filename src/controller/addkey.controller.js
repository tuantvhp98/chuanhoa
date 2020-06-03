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
                        if(item.point){
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
                        // list_item_count.innerHTML = `${item.type} có ${count}`
                        
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


function addUtilities(lat, lon) {
    if (lon == "" || lat == "" || lat == null || lat == NaN) {
        console.log("Không có lat lon")
    } else {
        getUltilities(lat, lon).then(te => {
            console.log(te.link)
            console.log(te)
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
            console.log(hospital["count"]+' '+clinic["count"]+' '+pharmacy["count"]+' '+kindergarten["count"])
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

                }
            }, (err, res) => {
                if (err) console.log(err)
                console.log('update success' + e.price + hospital["count"])
            })
        }).catch(err => {
            console.log(err)
        })
    }
}
function run(){
    convertgia().then(function(){
        convertgia()
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