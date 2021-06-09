let express = require('express');
let router = express.Router();
const Billing = require('../models/billing');

router.get('/', async (req,res)=>{
    const billingList = await Billing.find();
    res.send(billingList); 
})

router.get('/:clientId', async( req , res)=>{
    const clientId = req.params.clientId;
    console.log(clientId);
    const billingList = await Billing.find({clientId});
    res.send(billingList);
})

router.post('/', async(req, res)=>{
    let billing = req.body;
    const billingCreate = Billing.create(billing)
    res.send(billingCreate);
})
router.delete('/:id', async(req,res)=>{
    const _id = req.params.id;
    const response = await Billing.deleteOne({_id});
    res.send(response)
})

module.exports = router;