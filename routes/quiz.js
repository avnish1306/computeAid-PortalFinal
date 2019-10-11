const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const router = express.Router();

const Quiz = require('../models/quiz');
const Auth = require('../middlewares/auth');

router.post('/create',Auth.authenticateUser,(req,res,next)=>{
    
    req.checkBody('name', 'Quiz name is required').notEmpty();
    req.checkBody('startTime', 'Start Time is required').notEmpty();
    req.checkBody('endTime', ' End Time is required').notEmpty();
    req.checkBody('secretKey', 'Secret is required').notEmpty();
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
    
    Quiz.findOne({'name':req.body.name},(err,Quiz)=>{
        if(err){
            return res.status(500).json({
                status: 0,
                err:err
            })
        }
        if(Quiz&&req.body.quizId==null){
            return res.status(200).json({
                status: 0,
                msg:'Quiz Already Exist'
            })
        }else{
            let quiz = new Quiz({
                'name':req.body.name,
                'startTime': new Date(req.body.startTime),
                'endTime':new Date(req.body.endTime),
                'duration':req.body.duration,
                'scoreDisplay':req.body.scoreDisplay,
                'hasScoreBoard': req.body.hasScoreBoard,
                'details':req.body.details,
                'rules':req.body.rules
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
                //console.log(err);
                res.status(500).json({
                    status: 0,
                    error: "Internal Server Error"
                });
            });
        }
    })
});

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