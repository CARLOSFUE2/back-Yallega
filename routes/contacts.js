let express = require('express');
let router = express.Router();
const Contact = require('../models/contacts');



router.get('/', async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
  });

router.post('/', async (req,res) => {
    const contact ={
        name: req.body.cliente,
        numberPhone: req.body.numero,
        email: req.body.email,
        message: req.body.mensaje
    };
    const create = await Contact.create(contact);
    console.log(create);
    res.json(create); 
})

module.exports = router;