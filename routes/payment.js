const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const Billing = require('../models/billing');

router.get('/', async(req, res)=>{
    const payments = await Payment.find();
    res.send(payments);
})

router.get('/:id', async(req, res)=>{
    const id = req.params.id;
    let payment = await Payment.find({ _id: id});
    res.send(payment);
})

router.post('/:idBilling', async (req, res)=>{
    let payment = req.body;
    let idBilling = req.params.idBilling;
    let create = await Payment.create(payment);
    let billingUpdate = await Billing.findOne({_id:idBilling})
    billingUpdate.payment.push(create);
    billingUpdate = await Billing.updateOne({_id:idBilling}, billingUpdate )
    billingUpdate = await Billing.findOne({_id:idBilling})
    res.send(billingUpdate);
})

module.exports = router;

