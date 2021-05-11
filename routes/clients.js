let express = require('express');
let router = express.Router();
const Client = require('../models/client');

router.get('/', async (req, res)=>{
    const clients = await Client.find();
    res.json(clients);
});

router.post('/register',async (req, res)=>{
     const client = await Client.create(req.body);
     res.json(client);
 }) 
router.post('/login', async (req, res)=>{
     const client = await Client.findOne({ 'email': req.body.email});
     if(client == null){
        res.json({message:'no existe un usuario registrado con este email'});
    }else if( client.password !== req.body.password){
         res.json({message:'la clave es incorrecta'});
     }else{
         res.json(client);
     }
 }) 

 module.exports = router;