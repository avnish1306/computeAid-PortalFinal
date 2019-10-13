import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { ContestService } from '../services/contest.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService,
    private contestService: ContestService,
    private notificationsService: NotificationsService) { }

  userData;
  quizzes = [];
  loading: boolean = true;

  ngOnInit() {
    this.authService.getUser(JSON.parse(localStorage.getItem('user')).id).subscribe(
      res => {
        this.userData = res.user;
        if(this.userData.quizs.length > 0)
          this.fetchContests(0);
        else
          this.loading = false;
      },
      err => {
        this.notificationsService.error("Oops !!!", JSON.parse(err._body).error);
      }
    )
  }

  fetchContests(i: number) {
    this.contestService.getContest(this.userData.quizs[i].quizId).subscribe(
      quiz => {
        this.quizzes.push(quiz.data);
        // this.quizzes[i].status );
        if(i < this.userData.quizs.length-1)
          this.fetchContests(i+1);
        else
          this.loading = false;
      },
      err => {
        this.notificationsService.error("Oops !!!", JSON.parse(err._body).error);
      }
    )
  }

}
