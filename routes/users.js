let express = require('express');
let router = express.Router();
const User = require('../models/users');

router.get('/', async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});
router.get('/clients/:id', async (req, res, next) => {
  console.log('pasa')
  const id = req.params.id;
  const users = await User.find({clientId: id});
  res.send(users);
});

router.get('/:rut', async (req, res) => {
  const rut = req.params.rut;
  const usuario= await User.findOne({'rut': rut});
  res.json(usuario);
});

router.post('/', async (req,res) => {
  let user = req.body;
  console.log(user);
  const listUserForClient = await User.find({clientId: user.clientId});
  if(listUserForClient.length >0){
    let index = listUserForClient.indexOf(user.rut);
    if(index == -1){
      const create = await User.create(user);
      res.send(create); 
    }else{
      res.send({message:'este usuario ya fue creado'}) 
    }
  }else{
    const create = await User.create(user);
    res.send(create); 
  }
})

router.delete('/all', async(req,res)=>{
  const response = await User.deleteMany();
  res.send(response)
})

module.exports = router;
