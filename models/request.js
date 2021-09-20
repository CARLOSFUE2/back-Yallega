const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
	product: String,
	userId: String,
	clientId: String,
	deliveryId: String,
	origin: String,
	originUrl: String,
	destiny: String,
	destinyUrl: String,
	distance: Number,
	value: Number,
	status: String,
	date: String,
	time: String,
	reference: String,
	factureId:String,
	productValue: Number,
	destinationCharge: Boolean
})
module.exports = mongoose.model('Request', requestSchema);