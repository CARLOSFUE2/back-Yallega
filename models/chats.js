const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
	name: String,
    messages:Array,
    type:String,
    idTransmitter:String  
})
module.exports = mongoose.model('Chat', chatSchema);