import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContestService } from '../services/contest.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-contest-rankings',
  templateUrl: './contest-rankings.component.html',
  styleUrls: ['./contest-rankings.component.css']
})
export class ContestRankingsComponent implements OnInit {

  constructor(
    private contestService: ContestService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute) { }

  users;
  cid;
  cname;
  loading: boolean = true;
  aTimeArray = [];
  appearedUsers = [];
  notAppearedUsers = [];

  ngOnInit() {
    this.cid = this.route.snapshot.paramMap.get('cid');
    this.contestService.getContest(this.cid).subscribe(
      result => {
        this.cname = result.data.name;
        this.contestService.getRanks(this.cid).subscribe(
          res => {
            if (res.status) {
              this.users = res.data;
              for (let i = 0; i < this.users.length; i++) {
                let time = {
                  hh: '',
                  mm: '',
                  ss: ''
                }
                if (this.users[i].status) {
                  let temp = this.users[i].duration;
                  time.ss = temp % 60 < 10 ? '0' + temp % 60 : temp % 60 + '';
                  temp = temp - (temp % 60);
                  time.mm = (temp % 3600) / 60 < 10 ? '0' + (temp % 3600) / 60 : '' + (temp % 3600) / 60;
                  temp = temp - (temp % 3600);
                  time.hh = temp / 3600 < 10 ? '0' + temp / 3600 : '' + temp / 3600;
                  this.aTimeArray.push(time);
                  this.appearedUsers.push(this.users[i]);
                }
                else 
                  this.notAppearedUsers.push(this.users[i]);
              }
            }
            else
              this.notificationsService.error("Oops", "Cannot Fetch Ranks Now !!!");
            this.loading = false;
          },
          err => {
            this.notificationsService.error("Oops", JSON.parse(err._body).error);
          }
        );
      },
      err => {
        this.notificationsService.error("Oops", "Internal Server Error !!!");
      }
    );
  }

}
