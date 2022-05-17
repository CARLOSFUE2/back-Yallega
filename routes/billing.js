let express = require('express');
let router = express.Router();
const Billing = require('../models/billing');
const Payment = require('../models/payment');

router.get('/', async (req,res)=>{
    const billingList = await Billing.find();
    res.send(billingList); 
})


router.get('/delivers', async( req , res)=>{
    const clientId = req.params.clientId;
    const billingList = await Billing.find({ factureDeliver: true });
    billingList.reverse();
    billingList.splice(100);
    res.send(billingList);
})

router.get('/clients', async( req , res)=>{
    const clientId = req.params.clientId;
    const billingList = await Billing.find({ factureDeliver: false });
    billingList.reverse();
    billingList.splice(100);
    res.send(billingList);
})

router.get('/payments/:id', async( req, res)=>{
    const id = req.params.id;
    const billingList = await Billing.find();
    const billing = await Billing.findById({_id:id});
    res.send(billing);
})

router.get('/:clientId', async( req , res)=>{
    const clientId = req.params.clientId;
    const billingList = await Billing.find({ clientId });
    res.send(billingList);
})

router.put('/aprobatePayment/:idBilling/:idPayment', async (req, res)=>{
    const billingId = req.params.idBilling;
    const paymentId = req.params.idPayment;
    let payment;
    let billing = await Billing.findOne({_id:billingId});
    console.log(paymentId, billing.payment[0]._id);
    billing.payment.forEach(payment => {
        if( payment._id == paymentId){
             payment.passed = true;
         }
    });
    billing = await Billing.updateOne({_id:billingId},billing);
    payment = await Payment.updateOne({_id:paymentId},{$set:{passed: true}});
    billing = await Billing.findOne({_id:billingId})
    res.send(billing)
})

router.put('/closedBilling/:id', async (req, res)=>{
    const id =  req.params.id;
    let billing = await Billing.updateOne({_id:id},{$set:{active: false}});
    billing = await Billing.findOne({_id:id});
    res.send(billing);
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