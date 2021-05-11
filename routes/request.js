let express = require('express');
let router = express.Router();
const Request = require('../models/request');
const {distance} = require('../controllers/distanceMatrix');
const {price} = require('../controllers/calculatePrice')
const STATUS =[
    'En Espera', 'Asignado', 'En Proceso', 'Entregado', 'Rechazado', 'Devuelto'
  ];

router.get('/', async (req,res) => {
    const request = await Request.find();
    res.json(request);
});
router.post('/', async (req,res) =>{
    let request = req.body;
    let matrix = distance(20,30);
    let value = price(matrix, 'estandar');
    let date = new Date()
    request = {
        distance: matrix,
        value,
        date,
        status: STATUS[0],
        ...request
    }
    const create = await Request.create(request);
    res.send(create)
})

module.exports = router;