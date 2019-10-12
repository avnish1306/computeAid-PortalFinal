const mongoose = require('mongoose');
const quizSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    createdTime: {
        type: Date,
        default: new Date()
    },
    secretKey: {
        type: String,
        required: true
    },
    scoreDisplay: {
        type:Boolean,
        default:false
    },
    duration: {
        type: Number,
        required: true
    },
    hasScoreBoard:{
        type:Boolean,
        default:false
    },
    details: {
        type:String,
        default:""
    },
    rules:{
        type:String,
        default:""
    }
    
});

module.exports = mongoose.model('Quiz', quizSchema);