const mongoose = require('mongoose');
const Que=require('./que');
const Flaw=require('./flaw');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    access: {
        type: Number,
        required: true
    },
    lang:{
        type:String,
        default:"Z"
    },
    temp:{
        type:String,
        default:"webd"
    },
    contests:{
        cryptoquest:{
            isEligible:{
                type:Boolean,
                default:true
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            },
            endTime:{
                type:Date,
                default:null
            }
        },
        bughunt:{
            isEligible:{
                type:Boolean,
                default:true
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            },
            endTime:{
                type:Date,
                default:null
            }
        },
        flawless:{
            isEligible:{
                type:Boolean,
                default:true
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            },
            endTime:{
                type:Date,
                default:null
            }
        },
        webd:{
            isEligible:{
                type:Boolean,
                default:true
            },
            status:{
                type:Boolean,
                default:false
            },
            score:{
                type:Number,
                default:0
            },
            startTime:{
                type:Date,
                default:null
            },
            endTime:{
                type:Date,
                default:null
            }
        }
        
    },

    submission:[{
        queId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Que'
        },
        ans:[{
            type:String
        }],
        status:{
            type:Number,
            default:1
        },
        lang:{
            type:String
        }
    }],
    flawSubmission:[{
        qCode: {
            type:String,
            ref: 'Flaw'
        },
        code:[{
            type:String
        }],
        result:{
            type:String
        },
        status:{
            type:String,
            default:""
        },
        submissionTime:{
            type:Date
        }
    }]
});

module.exports = mongoose.model('User', userSchema);