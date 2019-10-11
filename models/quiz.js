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
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    hasScoreBoard:{
        type:Boolean,
        default:true
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