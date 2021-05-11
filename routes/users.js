let express = require('express');
let router = express.Router();
const User = require('../models/users');

router.get('/', async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});
router.get('/clients/:id', async (req, res, next) => {
  const id = req.params.id;
  listReturn = [];
  const users = await User.find();
  users.forEach(user => {
    let index = user.clientsId.indexOf(id);
      if(index>-1){
        listReturn.push(user);
      }
  });
  res.send(listReturn);
});

router.get('/:rut', async (req, res) => {
  const rut = req.params.rut;
  const usuario= await User.findOne({'rut': rut});
  res.json(usuario);
});

router.post('/', async (req,res) => {
  console.log(req.body)
  let user = req.body;
  const cliendtId = req.body.id;
  const usuario= await User.findOne({'rut':user.rut});
  if(usuario){
    usuario.clientsId.push(cliendtId);
    const userRegister = await User.updateOne({'rut':user.rut}, usuario);
    res.json(usuario);
  }else{
    user = {
      clientsId: [cliendtId],
      ...user
    };
    const create = await User.create(user); 
    res.json(create); 
  }
})

module.exports = router;
