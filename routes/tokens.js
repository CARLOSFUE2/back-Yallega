const express = require('express');
const router = express.Router();
const Token = require('../models/tokens');

router.get('/', async (req,res)=>{
    let tokens = await Token.find();
    res.send(tokens);
})

router.post('/', async (req,res)=>{
    let token = req.body;
    let tokens = await Token.find();
    let create = true;
    tokens.forEach(tok =>{
        if(tok.token == token.token){
            create = false;
        }
    })
    if(create == true){
        let tokenCreate = await Token.create(token);
    }
    res.send(token)
})

router.delete('/', async (req, res)=>{
    let id = req.params.id;
    let result = await Token.deleteMany();
    res.send(result)
})

module.exports = router;