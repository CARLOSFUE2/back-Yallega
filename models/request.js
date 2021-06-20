const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
	product: String,
	userId: String,
	clientId: String,
	deliveryId: String,
	origin: String,
	destiny: String,
	distance: Number,
	value: Number,
	status: String,
	date: String,
	time: String,
	factureId:String
})
module.exports = mongoose.model('Request', requestSchema);