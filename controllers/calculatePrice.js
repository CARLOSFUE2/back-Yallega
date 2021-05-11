const VALUESUNITARIES ={
    estandar: 200,
    especial: 300,
    vip:500
}

function price (distance, data) {
    let cost = distance * VALUESUNITARIES.estandar
    return cost
}

module.exports = { price}