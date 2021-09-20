const Rate = require("../models/rates")

const VALUESUNITARIES ={
    estandar: 200,
    especial: 300,
    vip:500
}

async function price (distance, data) {
    console.log(distance);
    let cost = 0;
    let rates = await Rate.find();
    rates = rates[0];
    if(distance <= 3){
        cost = rates.min;
    }else{
        cost = distance * rates.forKm;
    }
    return cost
}

module.exports = { price}