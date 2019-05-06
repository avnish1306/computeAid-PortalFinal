const express = require('express');
const router = express.Router();

const Chal = require('../models/chal');
const Que=require('../models/que');
const Answer = require('../models/answer');
const Auth = require('../middlewares/auth');

router.post('/add', Auth.authenticateAdmin, (req, res, next) => {
    console.log(" add in ");
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('desc', 'Description is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('points', 'Points is required').notEmpty();
    req.checkBody('flag', 'Flag is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        const chal = new Chal({
            title: req.body.title,
            desc: req.body.desc,
            author: req.body.author,
            points: req.body.points,
            flag: req.body.flag,
        });
        chal.save()
        .then(result => {
            res.status(201).json({
                status: 1,
                msg: "Challenge added successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 0,
                error: "Internal Server Error"
            });
        });
    }
    else{
        console.log(errors);
        res.status(500).json({
            status: 0,
            error: "All fields are required"
        });
    }
});

router.get('/', Auth.authenticateAll, (req, res, next) => {
    Chal.find({}, 'title desc points files author users').then(chals => {
        /*for(var i=0;i<chals.length;i++){
            for(var j=0;j<chals[i].users.length;j++){
                if(req.user.name === chals[i].users[j]){
                    chals[i].users = [chals[i].users[j]];
                    break;
                }
                else
                    chals[i].users = [];
            }
            chals[i].users;
        }*/
        res.status(200).json({
            status: 0,
            chals: chals
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal server error"
        });
    });
});

router.get('/rank', (req, res) => {
    Answer.find({$or: [{ user: '5ca7015d21eed03e0c32b113' }, { user: '5ca8423262b2595358b951ba' }, { user: '5ca842a6ba0e8a33c0d10856' }]}).exec()
    .then(answers => {
        let incredibles = 0;
        let illusion = 0;
        let turing = 0;
        console.log(answers);
        answers.forEach((answer) => {
            if(answer.user == '5ca7015d21eed03e0c32b113' && answer.status == 'correct') {
                const timestamp = answer._id.toString().substring(0, 8);
                const datetime = new Date( parseInt( timestamp, 16 ) * 1000 );
                incredibles += datetime.getTime();
            }
            if(answer.user == '5ca8423262b2595358b951ba' && answer.status == 'correct') {
                const timestamp = answer._id.toString().substring(0, 8);
                const datetime = new Date( parseInt( timestamp, 16 ) * 1000 );
                illusion += datetime.getTime();
            }
            if(answer.user == '5ca842a6ba0e8a33c0d10856' && answer.status == 'correct') {
                const timestamp = answer._id.toString().substring(0, 8);
                const datetime = new Date( parseInt( timestamp, 16 ) * 1000 );
                turing += datetime.getTime();
            }
        });
        return res.send({incredibles, illusion, turing});
    });
});

router.post('/:id', Auth.authenticateUser, (req, res, next) => {
    req.validate('flag', 'Flag is required').notEmpty();
    const errors = req.validationErrors();

    if(!errors){
        Chal.findById(req.params.id).exec()
        .then(chal => {
            if(chal.flag===req.body.flag){
                if(chal.users.indexOf(req.user.name)>-1){
                    const answer = new Answer({
                        chal: req.params.id,
                        user: req.user.id,
                        flag: req.body.flag,
                        status: "correct"
                    });
                    answer.save()
                    .then(result =>{
                        res.status(200).json({
                            status: 1,
                            solved: 1,
                            msg: "You have already solved the challenge :P"
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            status: 0,
                            error: "Internal Server Error"
                        });
                    });
                }
                else{
                    Chal.findByIdAndUpdate(req.params.id, {$push: {users: req.user.name}}).exec()
                    .then(chal => {
                        const answer = new Answer({
                            chal: req.params.id,
                            user: req.user.id,
                            flag: req.body.flag,
                            status: "correct"
                        });
                        answer.save()
                        .then(result =>{
                            res.status(200).json({
                                status: 1,
                                solved: 1,
                                msg: "Congratulations!! You have solved the challenge :)"
                            });
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                status: 0,
                                error: "Internal Server Error"
                            });
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 0,
                            error: "Internal server error"
                        });
                    });
                }
            }
            else{
                const answer = new Answer({
                    chal: req.params.id,
                    user: req.user.id,
                    flag: req.body.flag,
                    status: "wrong"
                });
                answer.save()
                .then(result =>{
                    res.status(200).json({
                        status: 1,
                        solved: 0,
                        msg: "That's not the correct flag :("
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        status: 0,
                        error: "Internal Server Error"
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        });
    }
    else{
        res.status(500).json({
            status: 0,
            error: "Flag is required"
        });
    }
});

router.get('/:id/flag', Auth.authenticateAdmin, (req, res, next) => {
    Chal.findById(req.params.id, 'flag').exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: result.flag
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

router.delete('/:id', Auth.authenticateAdmin, (req, res, next) => {
    Chal.remove({_id: req.params.id}).exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Chal deleted"
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