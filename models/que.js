const mongoose = require('mongoose');
const Quiz = require('./quiz');

const queSchema = mongoose.Schema({
    quizId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'

    },
    lang: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    negPoint: {
        type: Number,
        required: true
    },
    sol:[ {
        type: String,
        required: true
    }],
    opt:[{
        type: String,
        required: true
    }],
    type:{
        type: Number,
        required:true,
        default:1  //1 for sigle correct and 2 for multicorrect
    }
});

module.exports = mongoose.model('Que', queSchema);