let express = require('express');
let router = express.Router();
const Billing = require('../models/billing');

router.get('/', async (req,res)=>{
    const billingList = await Billing.find();
    res.send(billingList); 
})

router.get('/:clientId', async( req , res)=>{
    const clientId = req.params.clientId;
    const billingList = await Billing.find({clientId});
    res.send(billingList);
})

router.post('/', async(req, res)=>{
    let billing = req.body;
    const billingCreate = Billing.create(billing)
    res.send(billingCreate);
})

router.delete('/all', async(req,res)=>{
    const response = await Billing.deleteMany();
    res.send(response)
})

router.delete('/:id', async(req,res)=>{
    const _id = req.params.id;
    const response = await Billing.deleteOne({_id});
    res.send(response)
})

router.put('/:id', async (req, res)=>{
    const id = req.params.id;
    //const update = await Billing.updateOne({_id:id},{$set:{factureDeliver: status}})
    res.send(id)
})


module.exports = router;