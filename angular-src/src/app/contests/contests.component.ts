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
            "enabled": st && !end,
            "buttonText": !st ? 'Yet to start' : (st && !end ? 'Start The Contest' : (end ? 'Contest has end' : ''))
          });
        }
      },
      error => {
        this.notificationsService.create("", JSON.parse(error._body).error);
      }
    );
  }

  goToContest(i: number) {
    this.router.navigate(['/ques/'+this.contests[i].name]);
  }

}
