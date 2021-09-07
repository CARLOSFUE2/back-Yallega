let express = require('express');
let router = express.Router();
const Request = require('../models/request');
const User = require('../models/users');
const Billing = require('../models/billing');
const {requestMatrixDistane} = require('../controllers/distanceMatrix');
const {price} = require('../controllers/calculatePrice');
const Token = require('../models/tokens');
const {sendNotification} = require('../controllers/notifications');
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

router.get('/deliver/:id', async (req,res)=>{
    const id = req.params.id;
    const requests = await Request.find({deliveryId: id});
    res.send(requests);
})

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
    let origin = {
        lat: request.origin.lat,
        lng: request.origin.lng
    }
    let destiny = {
        lat: request.destiny.lat,
        lng: request.destiny.lng
    }
    request.origin = request.origin.name; 
    request.destiny = request.destiny.name; 
    let matrix = await requestMatrixDistane(origin,destiny);
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
    const clientId = request.clientId;
    const billingList = await Billing.find({clientId});
    let tokens = await Token.find();
    let listTokens = organiceTokens(tokens);
    console.log(listTokens);
    let notificacion = await sendNotification(listTokens);
 

    if( billingList.length == 0){
        const newBilling = {
            client: request.client,
            clientId:request.clientId,
            services: [{
                product:request.product,
                value:request.value
            }],
            total:request.value,
            dateExp:new Date(),
            active:true,
            number:1,
            factureDeliver: false
        }
        const billingCreate = await Billing.create(newBilling)
    }else{
        let listBillings = billingList.filter( billing => billing.active == true );
        if(listBillings.length > 0){
            const billingActive = listBillings[0];
            billingActive.services.push({
                product:request.product,
                value:request.value
            })
            billingActive.total = billingActive.total + request.value;
            const billlingUpdate = await Billing.updateOne({_id : billingActive._id}, billingActive) 
        }else{
            const newBilling = {
                client: request.client,
                clientId:request.clientId,
                services: [{
                    product:request.product,
                    value:request.value
                }],
                total:request.value,
                dateExp:new Date(),
                active:true,
                number:billingList[billingList.length - 1].number + 1,
                factureDeliver: false
            }
            const billingCreate = await Billing.create(newBilling)
        }
    }
    res.send(create)
})

router.put('/select/:id', async (req, res)=>{
    const id = req.params.id;
    const status = req.body.status.status;
    const deliver = req.body.status.deliver;
    const updateRequest = await Request.updateOne({_id:id},{$set:{status: STATUS[status],deliveryId:deliver._id}});
    const request = await Request.findById({_id:id});
    if( status == 3){
        const billingList = await Billing.find({clientId:deliver._id});
        if( billingList.length == 0){
            const newBilling = {
                client: deliver.name,
                clientId:deliver._id,
                services: [{
                    product:request.product,
                    value:request.value
                }],
                total:request.value,
                dateExp:new Date(),
                active:true,
                number:1,
                factureDeliver: true
            }
            const billingCreate = await Billing.create(newBilling)
        }else{
            const billingActive = billingList.filter( billing => billing.active == true )[0]
            billingActive.services.push({
                product:request.product,
                value:request.value
            })
            billingActive.total = billingActive.total + request.value;
            const billlingUpdate = await Billing.updateOne({_id : billingActive._id}, billingActive) 
        }
    }
    
    res.json(request)
})

router.delete('/all', async(req,res)=>{
    const response = await Request.deleteMany();
    res.send(response)
})

router.delete('/delete/:id', async (req,res)=>{
    const id = req.params.id;
    const response = await Request.findByIdAndDelete({_id: id});
    res.json(response)
})


function organiceTokens(tokens){
    let list = [];
    tokens.forEach(token=>{
        list.push(token.token);
    })
    return list;
}

module.exports = router;