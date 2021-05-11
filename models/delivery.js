const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
	name: String,
    numberPhone: String,
    email: {type:String,
        unique:true},
    password: String,
    address:String,
    identify: String,
    vehicle: String
})
module.exports = mongoose.model('Delivery', deliverySchema);