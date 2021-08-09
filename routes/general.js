const express = require('express');
const router = express.Router();
const General = require('../models/general')

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