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
  console.log(user)
  const listUserForClient = await User.find({clientId: user.clientId});
  if(listUserForClient.length >0){
    let index = listUserForClient.indexOf(user.numberPhone);
     console.log(index)
    if (index == -1) {
      try {
      const create = await User.create(user);
      res.send(create); 
      } catch (e) {
        console.log(e);
        res.send({message:'ha ocurrido un error'}) 
      }
    }else{
      res.send({message:'este usuario ya fue creado'}) 
    }
  }else{
    const create = await User.create(user);
    res.send(create); 
  }
})

router.get('delete', async(req,res)=>{
  const response = await User.deleteMany();
  res.send(response)
})

module.exports = router;
