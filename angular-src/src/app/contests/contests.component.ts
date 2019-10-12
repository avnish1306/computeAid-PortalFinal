import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContestService } from '../services/contest.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css']
})
export class ContestsComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,
    private contestService: ContestService,
    private notificationsService: NotificationsService) { }

    contests;
    live = [];
    id; rules; index: number = -1;
    info = {
      cname: "",
      details: "",
      startTime: "",
      endTime: "",
      duration: ""
    };
    stats = {
      up: 0,
      on: 0,
      pa: 0
    }
    loading: boolean = true;

  ngOnInit() {
    this.live = [];
    this.contestService.getAllContests().subscribe(
      data => {
        this.contests = data.contests;
        // this.solved = new Array(this.contests.length).fill(false);
        // this.flags = new Array(this.contests.length).fill("");
        for(let i=0;i<this.contests.length;i++){
          var dt = new Date().getTime();
          let st = new Date(this.contests[i].startTime).getTime() <= dt;
          let end = new Date(this.contests[i].endTime).getTime() <= dt;
          this.live.push({
            "started": st,
            "ended": end,
            "enabled": st && !end
          });
          if(this.live[i].enabled)
            this.stats.on++;
          if(!this.live[i].started)
            this.stats.up++;
          if(this.live[i].ended)
            this.stats.pa++;
        }
        this.loading = false;
      },
      error => {
        this.notificationsService.create("", JSON.parse(error._body).error);
        this.loading = false;
      }
    );
  }

  goToContest(i: number) {
    var dt = new Date().getTime();
    let st = new Date(this.contests[i].startTime).getTime() <= dt;
    let end = new Date(this.contests[i].endTime).getTime() <= dt;
    if(st && !end) {
      localStorage.setItem('temp3',JSON.stringify(this.contests[i]));
      this.router.navigate(['/ques/contests/'+this.contests[i]._id]);
    }
    else {
      alert('This contest has now ended. Talk to the coordinators.');
      this.ngOnInit();
    }
  }

  editContest(i: number) {
    localStorage.setItem('temp',JSON.stringify(this.contests[i]));
    this.router.navigate(['/contests/add/'+this.contests[i]._id]);
  }

  addQuestion(i: number) {
    localStorage.setItem('temp3',JSON.stringify(this.contests[i]));
    this.router.navigate(['/ques/add/'+this.contests[i]._id]);
  }
  rankings(i: number) {
    this.router.navigate(['/contests/ranking/'+this.contests[i]._id]);
  }

  stageInfo(i: number) {
    this.info.cname = this.contests[i].name;
    this.info.details = this.contests[i].details;
    this.info.startTime = this.contests[i].startTime;
    this.info.endTime = this.contests[i].endTime;
    this.info.duration = this.contests[i].duration;
  }

  openRules(i: number) {
    this.rules = this.contests[i].rules.split('\n');
    this.id = this.contests[i].name;
    this.index = i;
  }
  
  deleteContest(i: string) {
    if(confirm('Sure to delete contest? This action can\'t be undone'))
    this.contestService.deleteContest(i).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

}
