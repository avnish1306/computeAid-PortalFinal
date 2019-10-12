import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { faPlusCircle, faTrash, faPencilAlt, faEye } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';

import { AuthService } from '../services/auth.service';
import { QuesService } from '../services/ques.service';
import { LocalStorageService } from '../services/localStorage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

fontawesome.library.add(faPlusCircle, faTrash, faPencilAlt, faEye);

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(private router: Router,
  private authService: AuthService,
  private quesService: QuesService,
  private localStorageService: LocalStorageService,
  private notificationsService: NotificationsService,
  private route: ActivatedRoute) { }

  ques;
  i;
  selected: boolean = false;
  type: number;
  points: number;
  desc: string = "<h2>Welcome</h2><h3>to</h3><h1>Bughunt</h1><br><br><p>Click on any question to begin</p>";
  negPoint: number;
  author: string;
  users = [];
  id: string;
  saved;
  isSaved: boolean = false;
  index: number;
  opt;
  sol;
  temp = [];
  isEligible=false;
  isAttempt=false;
  submission;
  submitted=[false,false,false,false];
  selectedOpt=[false,false,false,false];
  marked=[];

  optForm: FormGroup;
  addQueForm: FormGroup;
  startTime;
  currentTime;
  duration;
  interval;
  timeLeft;
  countTimer="";
  timeFlag=0; cid;
  loading: boolean = true;
  userid;
  quizData;

  
  ngOnInit() {
    this.cid = this.route.snapshot.paramMap.get('cid');
    this.userid = JSON.parse(localStorage.getItem('user')).id;
    this.localStorageService.startQuiz(this.userid,this.cid);
    this.quizData = JSON.parse(localStorage.getItem('temp3'));
    localStorage.removeItem('temp3');
    this.quesService.getAllQues(this.cid).subscribe(
      data => {
        this.startTime=new Date(data.startTime);
        this.currentTime=new Date();
        var diff=Math.round((this.currentTime-this.startTime)/1000);
        this.duration=environment.bughuntDuration*60;
        this.timeLeft=this.duration-diff;
        

        //this.endTime=new Date(this.startTime.getTime() + environment.bughuntDuration*60000);
        /*var tim=this.startTime.getTime();
        var year=Math.round(tim/(365*24*60*60*1000));
        //this.endTime=this.endTime+this.startTime.getYear()+"-"+this.startTime.getMonth()+"-"+this.startTime.getDate()+" "+this.startTime.getHour()+":"+this.startTime.getMinute()+":"+this.startTime.getSecond();
        console.log(this.startTime.getTime());*/
        //console.log(this.startTime);
         // console.log(this.currentTime);
        //console.log(diff);
        // this.startTimer();
        this.ques = data.ques;
        this.submission=this.localStorageService.getSubmissions(this.userid,this.cid)||[];
        this.isEligible=data.isEligible;
        this.isAttempt=data.isAttempt;
        this.saved = new Array(this.ques.length);
        this.sol = new Array(this.ques.length).fill([]);
        for(let i=0;i<this.ques.length;i++){
          this.marked.push(false);
          var sol;//=this.submission.find(que=>{ console.log(que.queId,"   ",this.ques[i]._id); if(que.queId==this.ques[i]._id) return que.sol});
          for(var j=0;j<this.submission.length;j++){
            //console.log(this.submission[j].queId,"  ",this.ques[i]._id);
            if(this.submission[j].queId==this.ques[i]._id) {
                sol=this.submission[j].ans;
                this.saved[i]=true;
                this.sol[i]=this.submission[j].ans;
                break;
            }
            
          }
          if(!this.saved[i]){
            this.saved[i]=false;
            this.sol[i]=[];
          }
         // console.log(sol);
          /*if(sol.length>0&&this.submission.length&&this.submission.length>0)
           {this.saved[i] = true
            this.sol[i] = sol
              } //(this.chals[i].users.indexOf(JSON.parse(localStorage.getItem('user')).name) > -1);
          else{this.saved[i] = false
            this.sol[i] = []
          }*/
             // console.log(this.saved); 

        }
        //console.log(this.submission);
        this.loading = false;
      },
      error => {
        this.notificationsService.create("", JSON.parse(error._body).error);
      }
    );
    this.optForm = new FormGroup({
      'opt': new FormControl(null, [Validators.required, Validators.required])
    });
    this.addQueForm = new FormGroup({
      'lang': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required, Validators.minLength(10)]),
      'opt': new FormControl(null, [Validators.required, Validators.required]),
      'points': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required]),

    });
  }

  markQuestion(i: number) {
    this.marked[i] = !this.marked[i];
  }

  movePrevious(i: number) {
    if(i > 0)
      this.displayQue(i-1);
  }

  moveNext(i: number) {
    if(i < this.ques.length-1)
      this.displayQue(i+1);
  }

  startTimer() {
    this.interval = setInterval(() => {
      //console.log(this.timeLeft);
      if(this.timeLeft > 0) {
        this.timeLeft--;
        var hr=0, min=0, scnd=0;
        var tempTimeLeft=this.timeLeft;
        if(tempTimeLeft > 3600)
          hr = Math.floor(tempTimeLeft/3600);
        tempTimeLeft %= 3600;
        if(tempTimeLeft > 60)
          min = Math.floor(tempTimeLeft/60);
        scnd = tempTimeLeft%60;
        
        // if(this.timeLeft>=3600)
        //   hr=Math.round(this.timeLeft/3600);
        // var min=0;
        // if((this.timeLeft-hr*60)>=60)
        //   min=Math.round((this.timeLeft-hr*60)/60);
        // var scnd=Math.round((this.timeLeft-hr*3600-min*60));
        // console.log(this.timeLeft," ",scnd);
        // if(scnd>=60){
        //   scnd=scnd+30;
        //   //this.timeLeft=59;
        // }
        
        //console.log(this.timeLeft," ",hr," ",min," ",scnd);
        this.countTimer=hr+":"+(min < 10 ? '0'+min : min)+":"+(scnd < 10 ? '0'+scnd : scnd);
        if(hr==0&&min<10){
          this.timeFlag=1;
          if(hr==0&&min<5)
          this.timeFlag=2;
        }
        if(!this.isAdmin()&&hr==0&&min==0&&scnd==1)
            this.submitSol();
      } else {
        clearInterval(this.interval);
      }
    },1000)
  }

  bindSol(i,que){
    this.selectedOpt[i]=!this.selectedOpt[i];
    this.saveSol(que,null)
  }

  bindSolR(i,que,val){
    this.selectedOpt[i]=!this.selectedOpt[i];
    for(var j=0;j<4;j++){
      if(i!=j&&this.selectedOpt[j]==true){
        this.selectedOpt[j]=false;
      }
    }
    this.saveSol(que,val);
  }

  displayQue(index){
    this.i=0;
    this.submitted=[false,false,false,false];
    this.index = index;
    this.selected = true;
    //console.log(this.submission);
    this.points = this.ques[index].points;
    this.negPoint = this.ques[index].negPoint;
    this.author = this.ques[index].author;
    this.desc = this.ques[index].desc;
    this.temp = this.desc.split("<embedded>");
    if(this.temp.length >= 2)
      this.temp[1] = this.temp[1].replace(/\t/ig,'    ');
    this.id = this.ques[index]._id;
    this.isSaved = (this.sol[index].length>0)?true:false;
    this.type=this.ques[index].type;
    this.opt=this.ques[index].opt;
    var sol=this.submission.find(que=>{ /*console.log(que.queId,"  ||  ", this.id);*/ if(que.queId==this.id) return que;});
    if(!this.isSaved){
      this.optForm.reset();
    }
    if(sol){
      sol=sol.ans;
    /*for(var i=0;i< sol.length;i++){
        for(var j=0;j<4;j++){
          if(sol[i]==this.opt[j]){
            this.submitted[j]=true;
            break;
          }
        }
    }}*/
    //console.log("  sol ",sol);
    for(var i=0;i<4;i++){
      for(var j=0;j<sol.length;j++){
        if(sol[j]==this.opt[i]){
          this.submitted[i]=true;
          //console.log(sol[j],"  ",i);
          break;
        }
      }
    }}
    //console.log(this.submitted);
    this.selectedOpt=this.submitted;
    if(this.isAdmin()){
      if(this.sol[index].length===0)
        this.viewSol();
    }
  }

  saveSol(que,val){
   // console.log(" saveSol   ",this.optForm.value.opt);
    var sol=[];
    if(que.type==1)
      sol.push(val);
    else if(que.type==2){
      for(var i=0;i<4;i++){
        var tempArray=[];
        if(this.selectedOpt[i]){
          sol.push(que.opt[i]);
        }
      }
    }
    let result = this.localStorageService.saveAns(this.userid,this.cid,que._id,sol); 
    //this.quesService.saveSol(this.id, sol).subscribe(
     if(result){
        if(result.status==1){
          this.notificationsService.success("", result.msg, {timeOut: 2000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
          if(que.type==1)
            this.sol[this.index] = this.optForm.value.opt;
          else{
            this.sol[this.index]=[];
            for(var j=0;j<sol.length;j++){
              this.sol[this.index].push(sol[j]);
            }
          }
          var s=0;
          for(var j=0;j<this.submission.length;j++){
            if(this.submission[j].queId==this.id){
              this.submission[j].ans=sol;
              s=1;
              break;
            }
          }
          if(s==0){
            var ss={
              'queId':this.id,
              'ans':sol,
              'status':1
            }
            this.submission.push(ss);
          }
         // console.log(this.submission);
          this.saved[this.index]=true;
          this.isSaved = true;
        }
        else
          this.notificationsService.error("", result.msg, {timeOut: 2000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }else{
        this.notificationsService.error("Oops!! This is a browser error", {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
  }

  clearSol(que){
    //console.log(" saveSol   ",this.optForm.value.opt);
    var sol=[];
    
    //this.quesService.clearSol(this.id).subscribe(
      let result = this.localStorageService.clearAns(this.userid,this.cid,que._id);
      if(result) {
        if(result.status==1){
          this.notificationsService.success("", result.msg, {timeOut: 2000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
          this.sol[this.index] = [];
          this.saved[this.index]=false;
          this.isSaved = false;
          this.submitted=[false,false,false,false];
          this.selectedOpt=this.submitted;
          for(var j=0;j<this.submission.length;j++){
            if(this.submission[j].queId==this.id){
              this.submission[j].ans=[];
              break;
            }
          }
          //console.log(this.submission[j].ans);

        }
        else
          this.notificationsService.error("", result.msg, {timeOut: 2000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }else{
        this.notificationsService.error("Oops!! Browser error" , {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
  }

  addQue(){
    const que = {
      lang: this.addQueForm.value.lang,
      desc: this.addQueForm.value.desc,
      opt: this.addQueForm.value.opt,
      optCheck:this.addQueForm.value.optCheck,
      points: this.addQueForm.value.points,
      author: this.addQueForm.value.author,
      sol:[],
      type:1
    }
    for(var i=0;i<que.opt.length;i++){
      if(que.optCheck[i]==1){
        que.sol.push(que.opt[i]);
      }
    }
    if(que.sol.length>1){
      que.type=2;
    }
    this.quesService.addQue(que).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.addQueForm.reset();
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }
  viewSol(){
    this.quesService.viewSol(this.id).subscribe(
      data => {
        this.sol[this.index] = data.sol;
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  deleteQue(){
    this.quesService.deleteQue(this.id).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
        if(this.index===0)
          this.router.navigate(['/ques/add']);
        else
          this.displayQue(this.index-1);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }
  confirmSubmission(){
    if(confirm('Are you sure to submit? You cannot go back once submitted'))
      this.submitSol();
  }
  submitSol(){
    this.quesService.submitSol().subscribe(
      data => {
        clearInterval(this.interval);
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
        this.router.navigate(['/welcome']);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  editQuestion(i: number) {
    localStorage.setItem('temp4',JSON.stringify(this.ques[i]));
    localStorage.setItem('temp3',JSON.stringify(this.quizData));
    this.router.navigate(['/ques/add/'+this.cid]);
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

}
