const request = require('request')
const express = require('express')
//const app = express()
const router = express.Router()

const API_KEY = 'vpstPRxkBBTLaZkOaCfAHlqXtCR'
const TYPES = [
    { name: 'hospital', k: 'amenity', v: 'hospital' },
    { name: 'university', k: 'amenity', v: 'university' },
    { name: 'medical_supply', k: 'shop', v: 'medical_supply' },
    { name: 'pharmacy', k: 'amenity', v: 'pharmacy' },
    // { name: 'veterinary', k: 'amenity', v: 'veterinary' },
    {name:  'clinic',  k:'amenity',v:'clinic'},
    { name: 'kindergarten', k: 'amenity', v: 'childcare' },
    { name: 'school', k: 'amenity', v: 'school' },
    { name: 'college', k: 'amenity', v: 'college' },
    { name: 'zoo', k: 'tourism', v: 'zoo' },
    { name: 'mall', k: 'shop', v: 'mall' },
    { name: 'supermarket', k: 'shop', v: 'supermarket' },
    { name: 'convenience', k: 'amenity', v: 'convenience' },
    { name: 'cafe', k: 'amenity', v: 'cafe' },
    { name: 'parking', k: 'amenity', v: 'parking' },
    { name: 'bus_station', k: 'amenity', v: 'bus_station' },
    { name: 'police', k: 'amenity', v: 'police' },
    { name: 'bank', k: 'amenity', v: 'bank' },
    { name: 'marketplace', k: 'amenity', v: 'marketplace' },
    // { name: 'language_school', k: 'amenity', v: 'language_school' },
    // { name: 'music_school', k: 'amenity', v: 'music_school' },
    // { name: 'furniture', k: 'shop', v: 'furniture' },
    // { name: 'restaurant', k: 'amenity', v: 'restaurant' },
    // { name: 'fast_food', k: 'amenity', v: 'fast_food' },
    // { name: 'convenience', k: 'shop', v: 'convenience' },
    // { name: 'fuel', k: 'amenity', v: 'fuel' },
    // { name: 'bus_station', k: 'amenity', v: 'bus_station' },
    // { name: 'train_station', k: 'building', v: 'train_station' },
    // { name: 'townhall', k: 'amenity', v: 'townhall' }, 
    // { name: 'community_centre', k: 'amenity', v: 'community_centre' },
    // { name: 'atm', k: 'amenity', v: 'atm' }, 
    // { name: 'jewelry', k: 'shop', v: 'jewelry' },
    // { name: 'hairdresser', k: 'shop', v: 'hairdresser' },
    // { name: 'cosmetics', k: 'shop', v: 'cosmetics' },
    // { name: 'fashion', k: 'shop', v: 'fashion' },
    // { name: 'baby_goods', k: 'shop', v: 'baby_goods' },
    // { name: 'sports', k: 'shop', v: 'sports' },
    // { name: 'tailor', k: 'shop', v: 'tailor' },
    // { name: 'museum', k: 'tourism', v: 'museum' },
    // { name: 'religion', k: 'office', v: 'religion' },
    // { name: 'post_office', k: 'amenity', v: 'post_office' },
    // { name: 'laundry', k: 'shop', v: 'laundry' },
    // { name: 'gas', k: 'shop', v: 'gas' },
    // { name: 'gift', k: 'shop', v: 'gift' },
    // { name: 'studio', k: 'amenity', v: 'studio' },
    // { name: 'copyshop', k: 'shop', v: 'copyshop' },
    // { name: 'electronics', k: 'shop', v: 'electronics' },
    // { name: 'general', k: 'shop', v: 'general' },
    // { name: 'houseware', k: 'shop', v: 'houseware' },
    // { name: 'hardware', k: 'shop', v: 'hardware' },
    // { name: 'electrical', k: 'shop', v: 'electrical' },
]
function getPlace(type, lat, lon) {
    return new Promise((resolve, reject) => {
        request(`https://apis.wemap.asia/we-tools/explore?lat=${lat}&lon=${lon}&k=${type.k}&v=${type.v}&d=500&key=${API_KEY}&type=raw`, (error, header, body) => {
            if (error) {
                reject(error)
            }
            else {
                try {
                    result = JSON.parse(body)
                    resolve(result)
                } catch (e) {
                    reject(e)
                }
            }
        })
    })
}

//router.get('/allplace',
let testtienic= async (req, res) => {
    lat = req.query.lat
    lon = req.query.lon
    array = get_all_name()
    arr = []
    array.forEach((val) => {
        arr.push(getPlace(getName(val), lat, lon))
    })
    Promise.all(arr).then((docs) => {
        let result = []
        docs.forEach((doc, index) => {
            result.push({ type: array[index], point: docs[index] })
        })
        res.send(result)
    }).catch(() => { res.send([]) })
}

// function getUltilities(lat, lon) {
//     e = { lat, lon }
//     $.ajax({
//         url: `${SERVER_URL}/tility/allplace?lat=${lat}&lon=${lon}`,
//         method: "GET",
//     }).done((data) => {
//         countUltilities(data, e)
//     })
// }
// function countUltilities(data, e) {
//     data.map(item => {
//         distance = []
//         count = 0
//         item.point.map(val => {
//             distance.push(getDistance(val, e))
//             if (distance.length > 0) {
//                 count = distance.filter(x => x <= 0.35).length
//             }
//         })
//         list_item_count.innerHTML = `${item.type} có ${count}`
//     })
// }
function get_all_name() {
    arr = []
    TYPES.forEach((ele, index) => {
        arr[index] = ele.name
    })
    return arr
}
function getName(na) {
    return TYPES.filter(type => type.name == na)[0]
}
module.exports = testtienic;