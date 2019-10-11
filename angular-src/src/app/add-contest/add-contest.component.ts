import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { ContestService } from '../services/contest.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contest',
  templateUrl: './add-contest.component.html',
  styleUrls: ['./add-contest.component.css']
})
export class AddContestComponent implements OnInit {

  constructor(private contestService: ContestService,
    private router: Router,
    private notificationsService: NotificationsService) { }
    addContestForm: FormGroup;
    data = {
      editing: false,
      content: null
    }

  ngOnInit() {
    if(localStorage.getItem('temp')) {
      this.data.content = JSON.parse(localStorage.getItem('temp'));
      this.data.editing = true;
      localStorage.removeItem('temp');
    }
    this.addContestForm = new FormGroup({
      'contestName': new FormControl(this.data.editing ? this.data.content.name : null, [Validators.required]),
      'startTime': new FormControl(this.data.editing ? new Date(this.data.content.startTime) : null, [Validators.required]),
      'duration': new FormControl(this.data.editing ? this.data.content.duration : null, [Validators.required]),
      'endTime': new FormControl(this.data.editing ? new Date(this.data.content.endTime) : null, [Validators.required]),
      'secretKey': new FormControl(this.data.editing ? this.data.content.secretKey : null, [Validators.required]),
      'scoreDisplay': new FormControl(this.data.editing ? this.data.content.scoreDisplay : false),
      'hasScoreBoard': new FormControl(this.data.editing ? this.data.content.hasScoreBoard : false)
    });
  }

  addContest(navigate: boolean){
    const contest = {
      name: this.addContestForm.value.contestName,
      startTime: this.addContestForm.value.startTime,
      duration: this.addContestForm.value.duration,
      endTime: this.addContestForm.value.endTime,
      secretKey: this.addContestForm.value.secretKey,
      scoreDisplay: this.addContestForm.value.scoreDisplay,
      hasScoreBoard: this.addContestForm.value.hasScoreBoard
    }
    this.contestService.addContest(contest).subscribe(
      data => {
        this.addContestForm.reset();
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
