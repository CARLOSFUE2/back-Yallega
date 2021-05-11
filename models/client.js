const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
	name: String,
    numberPhone: String,
    email: {type:String,
        unique:true},
    password: String,
    address:String,
    identify: String  
})
module.exports = mongoose.model('Client', clientSchema);