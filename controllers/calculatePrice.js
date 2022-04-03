const Rate = require("../models/rates")

const VALUESUNITARIES = {
  estandar: 200,
  especial: 300,
  vip: 500,
}

async function price(distance, typeRateForClient) {
  console.log(typeRateForClient)
  let cost = 0
  let deliverCost = 0
  let rates = await Rate.find()
  let rate

  rates.forEach((rt) => {
    if (rt.type == typeRateForClient) {
      rate = rt
    } //ojo aqui
  })
  let gainMinimal;
  let gainFormKm;
 
  if (distance <= 3) {
    cost = rate.min;
    gainMinimal = cost * (rate.minDistribution / 100);
    deliverCost = cost - gainMinimal;
  } else {
    let extra = (distance - 3) * rate.forKm;
    cost = rate.min + extra;
    gainMinimal = rate.min * (rate.minDistribution / 100);
    gainFormKm = extra * (rate.forKmdistribution / 100);
    deliverCost = (rate.min - gainMinimal) + (extra - gainFormKm);

  }
  console.log(cost,deliverCost)
  return { cost, deliverCost }
}

module.exports = { price }
