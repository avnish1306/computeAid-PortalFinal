const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Auth = require('../middlewares/auth');

router.post('/login', (req, res, next) => {
    req.checkBody('name', 'Team name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();
    //console.log("req body "+req.body);
    if(!errors){
        User.findOne({name: req.body.name}).exec()
        .then(user => {
            //console.log("User "+user);
            if(user){
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if(err){
                        return res.status(500).json({
                            status: 0,
                            error: "Internal server error"
                        });
                    }
                    //console.log(process.env.SECRET);
                    if(result){
                        jwt.sign({
                            email: user.email,
                            id: user._id,
                            name: user.name,
                            access: user.access,
                            lang:user.lang,
                            temp:user.temp
                        }, process.env.SECRET, {
                            expiresIn: "24d",
                        }, function(err, token){
                            if(err){
                                //console.log(err);
                                return res.status(500).json({
                                    status: 0,
                                    error: "Problem signing in"
                                });
                            }
                            else{
                                return res.status(200).json({
                                    status: 1,
                                    msg: "Logged in successfully",
                                    token: token
                                });
                            }
                        });
                    }
                    else{
                        return res.status(401).json({
                            status: 0,
                            error: "Invalid name & password"
                        });
                    }
                });
            }
            else{
                return res.status(401).json({
                    status: 0,
                    error: "Invalid name & password"
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        });
    }
    else{
        res.status(500).json({
            status: 0,
            error: "All fields should be filled correctly"
        });
    }
});

router.post('/register', (req, res, next) => {
    req.checkBody('name', 'Team name is required').notEmpty();
    req.checkBody('email', 'Valid email is required').isEmail();
    req.checkBody('contact', 'Enter a valid number').isMobilePhone('en-IN');
    req.checkBody('password1', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);
    req.checkBody('college', 'University/College is required').notEmpty();
    req.checkBody('lang', 'language is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        User.findOne({name: req.body.name}).exec()
        .then(user => {
            if(user){
                return res.status(409).json({
                    status: 0,
                    error: "Team Name already taken"
                });
            }
            else{
                User.findOne({email: req.body.email}).exec()
                .then(user => {
                    if(user){
                        return res.status(409).json({
                            status: 0,
                            error: "Email exists"
                        });
                    }
                    else{
                        User.findOne({contact: req.body.contact}).exec()
                        .then(user => {
                            if(user){
                                return res.status(409).json({
                                    status: 0,
                                    error: "Number exists"
                                });
                            }
                            else{
                                bcrypt.hash(req.body.password1, 10, function(err, hash) {
                                    if(err){
                                        //console.log(err);
                                        res.status(500).json({
                                            status: 0,
                                            error: "Internal Server Error"
                                        });
                                    }
                                    else{
                                        const user = new User({
                                            name: req.body.name,
                                            email: req.body.email,
                                            contact: req.body.contact,
                                            password: hash,
                                            college: req.body.college,
                                            access: 3,
                                            lang:req.body.lang,
                                            temp:'webd'
                                        });
                                        user.save()
                                        .then(result => {
                                            res.status(201).json({
                                                status: 1,
                                                msg: "You have been successfully registered :)"
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
                                });
                            }
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
                .catch(err => {
                    //console.log(err);
                    res.status(500).json({
                        status: 0,
                        error: "Internal Server Error"
                    });
                });
            }
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                status: 0,
                error: "Internal Server Error"
            });
        });
    }
    else{
        //console.log(errors);
        res.status(500).json({
            status: 0,
            error: "All fields should be filled correctly"
        });
    }
});

router.post('/profile', Auth.authenticateUser, (req, res, next) => {
    res.status(200).json({});
});

router.delete('/:id', Auth.authenticateAdmin, (req, res, next) => {
    User.remove({_id: req.param.id}).exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "User deleted"
        });
    })
    .catch(err => {
        //console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal Server Error"
        });
    });
});

router.get('/switchContest/:key',(req,res)=>{
    //console.log()
    if(req.params.key=="mummy"){
        User.find({},(err,users)=>{
            if(err){
                res.status(500).json({
                    status:0,
                    error:err
                })
            }
            if(users.length>0){
                var promises=[];
                for(var i=0;i<users.length;i++){
                    var pr=new Promise((resolve,reject)=>{
                        User.findOne({name:users[i].name},(err,user)=>{
                            if(err){
                                reject(err);
                            }
                            console.log(user.lang,"  ", user.temp);
                            var t=user.lang;
                           /* if(user.lang!="webd"){
                                user.contests.webd.isEligible=true;
                            }else{
                                user.contests.bughunt.isEligible=true;
                            }*/
                            user.lang=user.temp;
                            user.temp=t;
                            
                            user.save().then(user=>{
                                resolve(1);
                            }).catch((err)=>{
                                reject(err);
                            })
                        })
                    })
                    promises.push(pr);
                }
                Promise.all(promises).then((val)=>{
                    res.status(200).json({
                        status:1,
                        msg:"Swaped Success"
                    })
                }).catch((err)=>{
                    res.status(500).json({
                        status:0,
                        error:err
                    })
                })
            }else{
                res.status(200).json({
                    status:0,
                    msg:"No user found"
                })
            }
        })
    }else{
        res.status(200).json({
            status:0,
            msg:"Opps you are not Authorize..."
        })
    }
})

module.exports = router;