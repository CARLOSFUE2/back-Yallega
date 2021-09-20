const express = require('express');
const router = express.Router();
const General = require('../models/general');
const Rate = require('../models/rates')

router.get('/', async(req,res)=>{
    let general = await General.find();
    if(general.length == 0){
        let data={
            political:{
                title:'titulo de Politicas de Ya LLega',
                body:'Contenido de Politicas de Ya LLega'
            },
            privacy:{
                title:'titulo de Politicas de privacidad',
                body:'Contenido de Politicas de privacidad'
            },
            methodsPayment:[
                {
                    title:'Nombre del banco 1',
                    name:'Nombre del usuario',
                    email:'ejemplo@ejemplo.com',
                    account: '12345678901234567890',
                    identification: 'Rut',
                    type:'corriente',
                    publicated:false          
                },
                {
                    title:'Nombre del banco 2',
                    name:'Nombre del usuario',
                    email:'ejemplo@ejemplo.com',
                    account: '12345678901234567890',
                    identification: 'Rut',
                    type:'corriente',
                    publicated:false          
                },
                {
                    title:'Nombre del banco 3',
                    name:'Nombre del usuario',
                    email:'ejemplo@ejemplo.com',
                    account: '12345678901234567890',
                    identification: 'Rut',
                    type:'corriente',
                    publicated:false          
                },
            ]
        }
        general = await General.create(data);
    }
    res.send(general);
})

router.get('/rate', async(req,res)=>{
    let rates = await Rate.find()
    rates = rates[0]
    res.send(rates)
})

router.put('/rate/min', async(req,res)=>{
    let rates = await Rate.find()
    rates = rates[0]
    const min = req.body.min;
    let update = await Rate.updateOne({_id:rates._id},{$set:{min:min}});
    res.send(min)
})

router.put('/rate/forKm', async(req,res)=>{
    let rates = await Rate.find()
    rates = rates[0]
    const forKm = req.body.rateForKm;
    let update = await Rate.updateOne({_id:rates._id},{$set:{forKm:forKm}});
    res.send(forKm)
})

router.get('/createRate', async(req,res)=>{
    const rates = {
        min:1,
        forKm:1
    }
    const create = await Rate.create(rates)
    res.send(create); 
})

router.get('/paymentmethods', async(req,res)=>{
    let data = await General.find();
    let methods = data[0].methodsPayment;
    data = methods.filter(method => method.publicated == true);
    res.send(data);
})

router.put('/', async(req,res)=>{
    let general = req.body;
    const id = general._id;
    console.log(general);
    general = await General.updateOne({_id:id, $set:general});
    res.send(general);
})


router.delete('/', async(req,res)=>{
    let deleted =  await General.deleteMany();
    res.send(deleted);
})

module.exports = router;