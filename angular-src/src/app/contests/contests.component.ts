import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContestService } from '../services/contest.service';
import { NotificationsService } from 'angular2-notifications';
import { LocalStorageService } from '../services/localStorage.service';
import { QuesService } from '../services/ques.service';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css']
})
export class ContestsComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,
    private contestService: ContestService,
    private quesService: QuesService,
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService) { }

    contests; interval; currDate;
    live = [];
    id; rules; index: number = -1;
    userid;
    info = {
      cname: "",
      details: "",
      startTime: "",
      endTime: "",
      duration:{'hours':0,'minutes':0}
    };
    stats = {
      up: 0,
      on: 0,
      pa: 0
    }
    loading: boolean = true;
    agree: boolean = false;
    registering: boolean = false;
    starting: boolean = false;
    success: boolean = false;

  ngOnInit() {
    this.live = [];
    this.userid = JSON.parse(localStorage.getItem('user')).id;
    this.syncServerDate(true);
  }

  fetchContests() {
    this.contestService.getAllContests().subscribe(
      data => {
        this.contests = data.contests;
        if (this.contests.length > 0)
          this.fetchRegister(0);
      },
      error => {
        this.notificationsService.create("", JSON.parse(error._body).error);
        this.loading = false;
      }
    );
  }

  fetchRegister(i: number) {
    this.contestService.isRegistered(this.contests[i]._id).subscribe(
      data => {
        this.contests[i].registered = data.isRegistered;
        this.contests[i].attempted = data.access;
        this.contests[i].started = this.localStorageService.isStarted(this.userid, this.contests[i]._id);// data.started;
        if (i < this.contests.length - 1)
          this.fetchRegister(i + 1);
        else {
          for (let i = 0; i < this.contests.length; i++) {
            let st = new Date(this.contests[i].startTime).getTime() <= this.currDate;
            let end = new Date(this.contests[i].endTime).getTime() <= this.currDate;
            this.live.push({
              "started": st,
              "ended": end,
              "enabled": st && !end
            });
            if (st && !end)
              this.stats.on++;
            if (!st)
              this.stats.up++;
            if (end)
              this.stats.pa++;
          }
          this.loading = false;
        }
      }, error => {
        this.notificationsService.create("", JSON.parse(error._body).error);
        this.loading = false;
      }
    );
  }

  register(i: number) {
    this.registering = true;
    this.loading = true;
    this.contestService.register(this.contests[i]._id).subscribe(
      data => {
        if (data.status == 1) {
          this.notificationsService.success("Done", "Registered Successfully !!!");
          this.ngOnInit();
        }
        else
          this.notificationsService.error("Oops", "Registration Failure !!!");
      }, error => {
        this.notificationsService.error("", JSON.parse(error._body).error);
      }
    );
  }

  syncServerDate(callFetch: boolean, i: number = -1) {
    if(this.starting == true)
      return;
    if(i != -1)
      this.starting = true;
    this.quesService.getCurrDate().subscribe(
      res => {
        if(res.status == 1)
          this.currDate = new Date(res.currTime).getTime();
        else
          this.currDate = new Date().getTime();
        if(callFetch)
          this.fetchContests();
        else
          this.goToContest(i);
      },
      err => {
          this.currDate = new Date().getTime();
      }
    );
  }

  goToContest(i: number) {
    let st = new Date(this.contests[i].startTime).getTime() <= this.currDate;
    let end = new Date(this.contests[i].endTime).getTime() <= this.currDate;
    if (st && !end) {
      this.success = true;
      this.router.navigate(['/ques/contests/' + this.contests[i]._id]);
    }
    else {
      alert('This contest has now ended. Talk to the coordinators.');
      this.starting = false;
    }
  }

  editContest(i: number) {
    this.router.navigate(['/contests/add/' + this.contests[i]._id]);
  }

  addQuestion(i: number) {
    this.router.navigate(['/ques/add/' + this.contests[i]._id + '/new']);
  }

  rankings(i: number) {
    this.router.navigate(['/contests/ranking/' + this.contests[i]._id]);
  }

  stageInfo(i: number) {
    this.info.cname = this.contests[i].name;
    this.info.details = this.contests[i].details;
    this.info.startTime = this.contests[i].startTime;
    this.info.endTime = this.contests[i].endTime;
    this.info.duration.hours =(this.contests[i].duration)/60;
    this.info.duration.minutes=(this.contests[i].duration)%60;
  }

  openRules(i: number) {
    this.rules = this.contests[i].rules.split('\n');
    this.id = this.contests[i].name;
    this.index = i;
  }

  deleteContest(i: string) {
    if (confirm('Sure to delete contest? This action can\'t be undone')) {
      this.loading = true;
      this.contestService.deleteContest(i).subscribe(
        data => {
          this.notificationsService.success("Success", data.msg, { timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight' });
          this.ngOnInit();
        },
        error => {
          this.notificationsService.error("Oops!!", JSON.parse(error._body).error, { timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight' });
        }
      );
    }
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

}
