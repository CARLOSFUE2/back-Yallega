const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
	name: String,
    numberPhone: String,
    email:String,
    message:String  
})
module.exports = mongoose.model('Contact', contactSchema);