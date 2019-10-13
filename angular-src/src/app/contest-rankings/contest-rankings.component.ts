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
  loading: boolean = true;
  ngOnInit() {
    this.cid = this.route.snapshot.paramMap.get('cid');
    this.contestService.getRanks(this.cid).subscribe(
      res => {
        if(res.status)
          this.users = res.data;
        else
          this.notificationsService.error("Oops","Cannot Fetch Ranks Now !!!");
          this.loading = false;
      },
      err => {
        this.notificationsService.error("Oops",JSON.parse(err._body).error);
      }
    );
  }

}
