const mongoose = require('mongoose')
const Flaw=require('./flaw');
const User=require('./user');
const subSchema = mongoose.Schema({
    code: {
        type: String
    },
    qCode: {
        type: String, ref: 'Flaw' 
    },
    name:{
        type: String,
        default:""
    },
    submittedOn:{
        type:Date,
        default:Date()
    },
    lang: {
        type: String
    },
    result:{
        type: String
    },
    points: {
        type: Number,
        default:0
    },
    status:{
        type:String,
        default:""
    },
    desc:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model('Sub', subSchema);