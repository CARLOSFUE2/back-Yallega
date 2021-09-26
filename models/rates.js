const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
    min:Number,
    minDistribution: Number,
    forKm:Number,
    forKmdistribution: Number
})
module.exports = mongoose.model('Rate', rateSchema);