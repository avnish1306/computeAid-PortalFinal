const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const router = express.Router();
const User=require('../models/user');
const Quiz = require('../models/quiz');
const Auth = require('../middlewares/auth');

router.post('/create',Auth.authenticateUser,(req,res,next)=>{
    
    req.checkBody('name', 'Quiz name is required').notEmpty();
    req.checkBody('startTime', 'Start Time is required').notEmpty();
    req.checkBody('endTime', ' End Time is required').notEmpty();
    req.checkBody('duration', 'Quiz Duration is required').notEmpty();
    req.checkBody('random','Random is required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
          messages.push(error);
        });
        return res.status(200).json({
            status: 0,
            msg: messages,

        });
      }
    
    Quiz.findOne({'name':req.body.name},(err,foundQuiz)=>{
        if(err){
            return res.status(500).json({
                status: 0,
                err:err
            })
        }
        if(foundQuiz){
            return res.status(200).json({
                status: 0,
                msg:'Quiz Already Exist'
            })
        }else{
            let random = {
                'isRandom':false
            };
            if(req.body.random==true){
                random.isRandom = true,
                random['singleChoice'] = req.body.singleChoice;
                random['multipleChoice'] = req.body.multipleChoice;
            }
            let quiz = new Quiz({
                'name':req.body.name,
                'startTime': new Date(req.body.startTime),
                'endTime':new Date(req.body.endTime),
                'duration':req.body.duration,
                'scoreDisplay':req.body.scoreDisplay,
                'hasScoreBoard': req.body.hasScoreBoard,
                'details':req.body.details,
                'rules':req.body.rules,
                'random':random
                });
                if(req.body.quizId!=null){
                    quiz['_id']= req.body.quizId;
                }
            quiz.save()
            .then(result => {
                res.status(201).json({
                    status: 1,
                    msg: "Quiz created :)",
                    data:result
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: 0,
                    error: "Internal Server Error"
                });
            });
        }
    })
});

router.post('/edit',Auth.authenticateUser,(req,res,next)=>{
    
    req.checkBody('name', 'Quiz name is required').notEmpty();
    req.checkBody('startTime', 'Start Time is required').notEmpty();
    req.checkBody('endTime', ' End Time is required').notEmpty();
    req.checkBody('duration', 'Quiz Duration is required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
          messages.push(error);
        });
        return res.status(200).json({
            status: 0,
            msg: messages,

        });
      }
    
    Quiz.findById({'_id':req.body.quizId},(err,foundQuiz)=>{
        if(err){
            return res.status(500).json({
                status: 0,
                err:err
            })
        }
        if(foundQuiz == null){
            return res.status(200).json({
                status: 0,
                msg:'Quiz Does Not Exist'
            })
        }else{
            foundQuiz.name = req.body.name;
            foundQuiz.startTime = new Date(req.body.startTime);
            foundQuiz.endTime = new Date(req.body.endTime);
            foundQuiz.duration = req.body.duration;
            foundQuiz.scoreDisplay = req.body.scoreDisplay;
            foundQuiz.hasScoreBoard = req.body.hasScoreBoard;
            foundQuiz.details = req.body.details;
            foundQuiz.rules = req.body.rules;
            foundQuiz.save()
            .then(result => {
                res.status(201).json({
                    status: 1,
                    msg: "Quiz saved :)",
                    data:result
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: 0,
                    error: "Internal Server Error"
                });
            });
        }
    })
});

router.get('/getRankList/:quizId',Auth.authenticateAll,(req,res)=>{
    let quizId = req.params.quizId;
    Quiz.findOne({'_id':quizId},(err,quiz)=>{
        if(err){
            return res.status(500).json({
                status:0,
                error:"Internal Server Error"
            })
        }
        if(quiz){
            User.find()
            .where('_id')
            .in(quiz.users)
            .exec(function (err, users) {
                if(err){
                    return res.status(500).json({
                        status: 0,
                        error: "Internal Server Error"
                    });
                }
                let result=[];
                users.forEach(x=>{
                    let fquiz = x.quizs.find(x=>{
                        return x.quizId==quizId;
                    });
                    let startTime = new Date(fquiz.startTime);
                    let endTime = new Date(fquiz.endTime);
                    let duration= Math.round((endTime-startTime)/1000);
                    result.push({
                        'userId':x._id,
                        'username':x.name,
                        'email':x.email,
                        'score':fquiz.score,
                        'status':fquiz.status,
                        'duration':duration,
                        'status':fquiz.status
                    });
                });
                result.sort((a,b) => (a.score < b.score) ? 1 : ((b.duration < a.duration) ? 0 : -1)); 
                return res.status(200).json({
                    'status':1,
                    'data':result
                })

            });
        }else{
            return res.status(200).json({
                status:0,
                msg:"Quiz Not Found"
            })
        }
    })
})

router.get('/register/:id',Auth.authenticateAll,(req,res)=>{
    Quiz.findOne({'_id':req.params.id},(err,quiz)=>{
        if(err){
            return res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        }else{
            if(quiz.users.indexOf(req.user.id) == -1)
                quiz.users.push(req.user.id);
            quiz.save().then(newQuiz=>{
                return res.status(200).json({
                    status:1,
                    msg:"User registered successfully"
                })
            })
            .catch(err=>{
                return res.status(500).json({
                    status: 0,
                    msg: "Failed to register",
                    error:err
                });
            })
        }
    })
})
router.get('/confirm/:id',Auth.authenticateAll,(req,res)=>{
    Quiz.findOne({'_id':req.params.id},(err,quiz)=>{
        if(err){
            return res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        }else{
            console.log(req.user.id);
            
            var userId = quiz.users.find(x=>{
                return x==req.user.id;
            });
            if(userId){
                User.findOne({'_id':userId},(err,user)=>{
                    if(err){
                        return res.status(500).json({
                            status: 0,
                            error: "Internal server error"
                        });
                    }else{
                        let fquiz = user.quizs.find(x => {
                            return x.quizId == req.params.id;
                        });                                             
                        let access = fquiz == undefined ? false : fquiz.status, isRegistered = quiz.users.indexOf(req.user.id) != -1;
                        let started = fquiz == undefined ? false : fquiz.startTime != null, status = 1; 
                        return res.status(200).json({
                            status, access, isRegistered, started
                        });
                    }
                })
            }else{
                return res.status(200).json({
                    status:0,
                    access:false,
                    isRegistered:false,
                    started: false
                })
            }
        }
    })
})
router.get('/access/:id',Auth.authenticateAll,(req,res)=>{
    User.findOne({'name':req.user.name},(err,user)=>{
        if(err){
            return res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        }
        if(user){
            let quiz = user.quizs.find(x=>{
                return x.quizId == req.params.id;
            })
            if(quiz&&quiz.status==true){
                return res.status(200).json({
                    status:0,
                    msg:'HOLA! Quiz already taken'
                })
            }else{
                return res.status(200).json({
                    status: 1,
                    msg:"Quiz Started"
                });
            }
        }else{
            res.status(200).json({
                status: 0,
                msg:"User not found"
            });
        }
    });
})
router.get('/',Auth.authenticateAll, (req, res) => {
    Quiz.find({},(err, quizzes) => {
        if(err){
            return res.status(500).json({
                status: 0,
                err:err
            })
        }
        if(quizzes){
            return res.status(200).json({
                status: 1,
                contests: quizzes
            })
        }
    })
});

router.get('/:id', Auth.authenticateUser, (req, res, next) => {
    Quiz.findById({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Quiz Found",
            data: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal Server Error"
        });
    });
});

router.delete('/:id', Auth.authenticateUser, (req, res, next) => {
    Quiz.remove({_id: req.params.id}).exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Quiz deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal Server Error"
        });
    });
});

module.exports = router;