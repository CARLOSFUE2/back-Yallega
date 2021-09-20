const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
    min:Number,
    forKm:Number
})
module.exports = mongoose.model('Rate', rateSchema);