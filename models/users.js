const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	rut: {type:String, unique:true},
	address: String,
	numberPhone: String,
	clientsId: Array
})
module.exports = mongoose.model('User', userSchema);