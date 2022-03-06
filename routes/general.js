const express = require('express');
const router = express.Router();
const General = require('../models/general');
const Rate = require('../models/rates');

const typeCients =[
    'Estandar', 'Especial', 'Destacada'];

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
    let rates = await Rate.find();
    let ratesForSend =[];
    if(rates.length == 0){
        await createRate();
        rates = await Rate.find();
    }
    rates = rates;
    rates.forEach( rate =>{
        let rateForSend = {
            _id: rate._id,
            forKm: rate.forKm, forKmdistribution: rate.forKmdistribution, 
            min: rate.min,  minDistribution: rate.minDistribution, type: rate.type};
        ratesForSend.push(rateForSend)
    })
    res.send(ratesForSend)
})

router.put('/rate', async(req,res)=>{
    const body = req.body; 
    let update = await Rate.updateOne({_id:body._id},{$set:body});
    res.send(update)
})


router.get('/createRate', async(req,res)=>{

    let prevRates = await Rate.find()
    if(prevRates.length>0){
        res.send('ya hay tarifas creadas');
    }else{
        await createRate();
        res.send('tarifas creadas'); 
    }
    
})

router.get('/deleteRates', async (req,res)=>{
    let delet = await Rate.deleteMany();
    res.send(delet); 
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

async function createRate(){
    let rates = {
        min:1,
        minDistribution:10,
        forKm:1,
        forKmdistribution:10
    };
    for (let index = 0; index < typeCients.length; index++) {
        let element = {...rates, type: typeCients[index] }
        let create = await Rate.create(element)
        
      }
}

module.exports = router;