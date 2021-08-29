const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	name: String,
    message:String,
    type:String,
    idTransmitter:String  
})
module.exports = mongoose.model('Message', messageSchema);