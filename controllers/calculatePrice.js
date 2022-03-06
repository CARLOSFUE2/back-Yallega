const Rate = require("../models/rates")

const VALUESUNITARIES ={
    estandar: 200,
    especial: 300,
    vip:500
}

async function price (distance, typeRateForClient) {
    console.log(typeRateForClient)
    let cost = 0;
    let deliverCost = 0;
    let rates = await Rate.find();
    let rate;
    
    rates.forEach(rt =>{
        if(rt.type == typeRateForClient){
         rate = rt;   
        } //ojo aqui
    })
    console.log(rate)
    
    if(distance <= 3){
        cost = rate.min;
        deliverCost = cost * (rate.minDistribution/100);
    }else{
        cost = (rate.min) + ( (distance - 3) * rate.forKm);
        deliverCost = cost * (rate.forKmdistribution/100);
    }
    return {cost, deliverCost}
}

module.exports = { price}