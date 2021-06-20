const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
	client: String,
    clientId:String,
	services: Array,
    total:Number,
    dateExp:String,
    active:Boolean,
    number:Number
})
module.exports = mongoose.model('Billing', billingSchema);