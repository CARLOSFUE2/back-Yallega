//const {API_KEY_GOOGLE} = process.env;
const axios = require('axios');
const API_KEY_GOOGLE = "AIzaSyBpqRILZ7Ebt-KZUo4_sbXhquFldXCZR-Y"

async function requestMatrixDistane(origin, destiny){
    try{
        let distance = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin.lat+","+origin.lng+"&destinations="+destiny.lat+","+destiny.lng+"&key="+ API_KEY_GOOGLE)
        //si necesitas extraer mas data descomenta console.log(JSON.stringify(distance.data));
        let distanceMts = distance.data.rows[0].elements[0].distance.value;
        let value = distanceMts/1000;
        return value
    }catch(err){
        console.log(err);
    }
}
 module.exports = {requestMatrixDistane};