const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    name: String,
    ref: String,
    metodo: String,
    value: Number,
    passed: Boolean
})

module.exports = mongoose.model('Payment', paymentSchema);