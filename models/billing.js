const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
	client: String,
    clientId:String,
	services: Array,
    total:String,
    dateExp:String,
    active:Boolean
})
module.exports = mongoose.model('Billing', billingSchema);