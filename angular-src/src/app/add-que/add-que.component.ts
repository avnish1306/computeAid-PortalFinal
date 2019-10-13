import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuesService } from '../services/ques.service';
import { NotificationsService } from 'angular2-notifications';
import { ContestService } from '../services/contest.service';
@Component({
  selector: 'app-add-que',
  templateUrl: './add-que.component.html',
  styleUrls: ['./add-que.component.css']
})
export class AddQueComponent implements OnInit {
  constructor(private queService: QuesService,
    private router: Router,
    private route: ActivatedRoute,
    private contestService: ContestService,
    private notificationsService: NotificationsService) { }

  addQueForm: FormGroup;
  sol = [false, false, false, false];
  type: number = 2;
  opt = [];
  cid; qid;
  data;
  quesData = {
    editing: false,
    content: null
  };
  loading: boolean = true;

  ngOnInit() {
    this.cid = this.route.snapshot.paramMap.get('cid');
    this.qid = this.route.snapshot.paramMap.get('qid');
    this.contestService.getContest(this.cid).subscribe(result => {
      this.data = result.data;
      if (this.qid != 'new') {
        this.quesData.editing = true;
        this.queService.getQues(this.qid).subscribe(result => {
          this.quesData.content = result.data;
          this.type = this.quesData.content.type;
          this.initialize();
        }, error => {
          this.notificationsService.create("", JSON.parse(error._body).error);
        })
      }
      else
        this.initialize();
    }, error => {
      this.notificationsService.create("", JSON.parse(error._body).error);
    });
  }

  initialize() {

    this.addQueForm = new FormGroup({
      'lang': new FormControl(this.quesData.editing ? this.quesData.content.lang : null,null),
      'desc': new FormControl(this.quesData.editing ? this.quesData.content.desc : null, [Validators.required]),
      'type': new FormControl(this.quesData.editing ? this.quesData.content.type : null,[Validators.required]),
      'points': new FormControl({ value: this.quesData.editing ? this.quesData.content.points : null, disabled: this.data.random.isRandom }, [Validators.required]),
      'negPoint': new FormControl({ value: this.quesData.editing ? this.quesData.content.negPoint : null, disabled: this.data.random.isRandom }, [Validators.required]),
      'author': new FormControl(this.quesData.editing ? this.quesData.content.author : null, [Validators.required]),
      'opt1': new FormControl(null),
      'opt2': new FormControl(null),
      'opt3': new FormControl(null),
      'opt4': new FormControl(null)
    });
    this.loading = false;
  }

  bindSol(k: number) {
    // if(this.type == 2) 
    this.sol[k] = !this.sol[k];
    if (this.type == 1)
      for (let i = 0; i < 4; i++) {
        if (i == k)
          continue;
        this.sol[i] = false;
      }
    // console.log(this.sol);
  }

  bindOpt(e: any, i: number) {
    this.opt[i] = e.target.value;
  }

  addQue(navigate: boolean) {
    const que = {
      lang: this.addQueForm.value.lang||'NONE',
      desc: this.addQueForm.value.desc,
      type: Number(this.addQueForm.value.type),
      points: this.quesData.editing ? this.quesData.content.points : (this.data.random.isRandom ? (this.type == 1 ? this.data.random.singleChoice.points : this.data.random.multipleChoice.points) : this.addQueForm.value.points),
      negPoint: this.quesData.editing ? this.quesData.content.negPoints : (this.data.random.isRandom ? (this.type == 1 ? this.data.random.singleChoice.negPoints : this.data.random.multipleChoice.negPoints) : this.addQueForm.value.negPoint),
      author: this.addQueForm.value.author,
      quizId: this.cid,
      opt: [],
      sol: []
    }
    que.opt = this.opt;

    // console.log(que.opt);
    for (var i = 0; i < 4; i++) {
      if (this.sol[i] == true) {
        que.sol.push(que.opt[i]);
      }
    }
    // console.log(que);

    this.queService.addQue(que).subscribe(
      data => {
        this.addQueForm.reset();
        this.notificationsService.success("Success", data.msg, { timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight' });
        if (navigate)
          this.router.navigate(['/contests']);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, { timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight' });
      }
    );
  }

}
