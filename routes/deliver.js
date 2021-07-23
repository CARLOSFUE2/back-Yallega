let express = require('express');
const { find } = require('../models/deliver');
let router = express.Router();
const Deliver = require('../models/deliver')

/* GET home page. */
router.get('/', async (req, res) => {
  const delivers = await Deliver.find();
  res.send(delivers)
});

router.post('/', async(req, res)=>{
    const deliver = req.body;
    console.log(deliver)
    const deliverCreate = await Deliver.create(deliver);
    res.send(deliverCreate);
})

router.post('/login', async(req,res)=>{
    const deliverLogin = req.body;
    let response={
        mensaje: 'usuario no autenticado',
        auth:false
    };
    const deliver = await Deliver.find({email: deliverLogin.email})
    if(deliver.length ==0){
        response={ 
            mensaje: 'no existe un usuario registrado con este email',
            auth:false
        }
    }else if(deliver[0].password !== deliverLogin.password){
        response={
            mensaje: 'contraseña incorrecta',
            auth:false
        }
    }else{
        response={
            mensaje: 'usuario autenticado',
            auth:true,
            user:deliver[0]
        }
    }
    res.send(response)
})

router.put('/change-status/:id', async (req, res)=>{
    const id = req.params.id;
    const authorized = req.body.authorized;
    console.log(authorized);
    const deliver = await Deliver.updateOne({_id:id},{$set:{authorized: authorized}});
    res.send(deliver);
})

router.delete('/delete', async(req,res)  =>  {
    const response = await Deliver.deleteMany();
    res.send(response);
})

module.exports = router;
