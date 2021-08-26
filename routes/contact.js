const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router.get('/', async (req,res)=>{
    let contacts = await Contact.find();
    res.send(contacts)
})

router.post('/', async(req,res)=>{
    let contact = req.body;
    let response = await Contact.create(contact); 
    res.send(response)
})


module.exports = router;