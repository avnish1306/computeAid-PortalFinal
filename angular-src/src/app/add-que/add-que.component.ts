import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuesService } from '../services/ques.service';
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-add-que',
  templateUrl: './add-que.component.html',
  styleUrls: ['./add-que.component.css']
})
export class AddQueComponent implements OnInit {
  constructor(private queService: QuesService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService) { }

  addQueForm: FormGroup;
  sol=[false,false,false,false];
  type: number = 2;
  opt=[];
  cid;
  data;

  ngOnInit() {
    this.cid = this.route.snapshot.paramMap.get('cid');
    this.data = JSON.parse(localStorage.getItem('temp3'));
    localStorage.removeItem('temp3');
    this.addQueForm = new FormGroup({
      'lang': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required]),
      'type': new FormControl(null, [Validators.required]),
      'points': new FormControl(null, [Validators.required]),
      'negPoint': new FormControl(null),
      'author': new FormControl(null, [Validators.required]),
      'opt1':new FormControl(null),
      'opt2':new FormControl(null),
      'opt3':new FormControl(null),
      'opt4':new FormControl(null)
    });
  }

  bindSol(k: number){
    this.sol[k]=!this.sol[k];
    if(this.type==1)
      for(let i=0;i<4;i++){
        if(i==k)
          continue;
      this.sol[i]=false;}
    console.log(this.sol);
  }

  bindOpt(e: any,i:number){
      this.opt[i]=e.target.value;
  }

  addQue(navigate: boolean){
    const que = {
      lang: this.addQueForm.value.lang,
      desc: this.addQueForm.value.desc,
      type: Number(this.addQueForm.value.type),
      points: this.addQueForm.value.points,
      negPoint: this.addQueForm.value.negPoint ? this.addQueForm.value.negPoint : 0,
      author: this.addQueForm.value.author,
      quizId: this.cid,
      opt:[],
      sol:[]
    }
    que.opt=this.opt;
    
    console.log(que.opt);
    for(var i=0;i<4;i++){
      if(this.sol[i]==true){
        que.sol.push(que.opt[i]);
      }
    }
    console.log(que);
    
    this.queService.addQue(que).subscribe(
      data => {
        this.addQueForm.reset();
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        if(navigate)
          this.router.navigate(['/contests']);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

}
