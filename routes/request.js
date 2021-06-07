let express = require('express');
let router = express.Router();
const Request = require('../models/request');
const User = require('../models/users');
const {distance} = require('../controllers/distanceMatrix');
const {price} = require('../controllers/calculatePrice');
const { request } = require('express');
const { find } = require('../models/request');
const STATUS =[
    'En Espera', 'Asignado', 'En Proceso', 'Entregado', 'Rechazado', 'Devuelto'
  ];

router.get('/', async (req,res) => {
    const request = await Request.find();
    res.json(request);
});
router.get('/client/:id', async (req,res) => {
    const id = req.params.id;
    let response =[]
    const request = await Request.find();
    const clients = await User.find();
    let requestMatch = [];
    request.forEach(e =>{
       if(e.clientId == id){
            requestMatch.push(e);
       } ;
    })
    requestMatch.forEach(req =>{
        let coincidencias = clients.filter( client => req.userId == client._id)
        let formatResponse ={
        _id:req._id,
        product: req.product,
        client:coincidencias[0].name,
        numberPhone: coincidencias[0].numberPhone,
        status: req.status,
        price: req.value,
        address: req.destiny
        }
        response.push(formatResponse)
    })
    res.json(response);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const request = await Request.findById({_id:id});
    const listClients = await User.find()
    let clients = listClients.filter( client => request.userId == client._id )
    let formatResponse ={
        _id:request._id,
        product: request.product,
        client:clients[0].name,
        numberPhone: clients[0].numberPhone,
        status: request.status,
        price: request.value,
        destiny: request.destiny,
        origin: request.origin
        }
    res.send(formatResponse)
})


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

router.put('/select/:id', async (req, res)=>{
    const id = req.params.id;
    const status = req.body.status;
    console.log(status)
    const request = await Request.updateOne({_id:id},{$set:{status: STATUS[status]}});
    res.json(request)
})

router.delete('/delete/:id', async (req,res)=>{
    const id = req.params.id;
    const response = await Request.findByIdAndDelete({_id: id});
    res.json(response)
})

module.exports = router;