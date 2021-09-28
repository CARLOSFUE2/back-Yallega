const Rate = require("../models/rates")

const VALUESUNITARIES ={
    estandar: 200,
    especial: 300,
    vip:500
}

async function price (distance, data) {
    let cost = 0;
    let deliverCost = 0;
    let rates = await Rate.find();
    rates = rates[0];
    if(distance <= 3){
        cost = rates.min;
        deliverCost = cost * (rates.minDistribution/100);
    }else{
        cost = (rates.min) + ( (distance - 3) * rates.forKm);
        deliverCost = cost * (rates.forKmdistribution/100);
    }
    return {cost, deliverCost}
}

module.exports = { price}