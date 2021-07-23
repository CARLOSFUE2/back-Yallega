const mongoose = require('mongoose');

const deliverSchema = new mongoose.Schema({
	name: String,
    numberPhone: String,
    email: {type:String,
        unique:true},
    password: String,
    address:String,
    identify: String,
    vehicle: String,
    authorized: Boolean
})
module.exports = mongoose.model('Deliver', deliverSchema);