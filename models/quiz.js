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
    },
    users:[
    ],
    random:{
        isRandom: {
            type:Boolean,
            default:false
        },
        singleChoice:{
            count:{
                type:Number,
                default:0
            },
            points:{
                type:Number,
                default:0
            },
            negPoints: {
                type:Number,
                default:0
            }
        },
        multipleChoice:{
            count:{
                type:Number,
                default:0
            },
            points:{
                type:Number,
                default:0
            },
            negPoints: {
                type:Number,
                default:0
            }
        }
    }
    
});


module.exports = mongoose.model('Quiz', quizSchema);