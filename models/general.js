const mongoose = require('mongoose');

const generalSchema = mongoose.Schema({
    political:Object,
    privacy:Object,
    methodsPayment:Array
})

module.exports = mongoose.model('General', generalSchema)