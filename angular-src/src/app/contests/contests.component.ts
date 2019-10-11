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
    id;
    info = {
      cname: "",
      details: "",
      startTime: "",
      endTime: ""
    }
    loading: boolean = true;

  ngOnInit() {
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
    if(st && !end)
      this.router.navigate(['/ques/contests/'+this.contests[i].name]);
    else {
      alert('This contest has now ended. Talk to the coordinators.');
      this.ngOnInit();
    }
  }

  editContest(i: number) {
    localStorage.setItem('temp',JSON.stringify(this.contests[i]));
    this.router.navigate(['/contests/add']);
  }

  addQuestion(i: number) {
    this.router.navigate(['/ques/add/'+this.contests[i].name]);
  }

  stageInfo(i: number) {
    this.info.cname = this.contests[i].name;
    this.info.details = this.contests[i].details;
    this.info.startTime = this.contests[i].startTime;
    this.info.endTime = this.contests[i].endTime;
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
