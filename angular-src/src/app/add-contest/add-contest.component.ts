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
      'details': new FormControl(this.data.editing ? this.data.content.details : ""),
      'rules': new FormControl(this.data.editing ? this.data.content.rules : null, [Validators.required]),
      'scoreDisplay': new FormControl(this.data.editing ? this.data.content.scoreDisplay : false),
      'hasScoreBoard': new FormControl(this.data.editing ? this.data.content.hasScoreBoard : false),
      'randomize': new FormControl(false),
      'nSCQ': new FormControl(0, [Validators.required]),
      'nMCQ': new FormControl(0, [Validators.required]),
      'posMarksSCQ': new FormControl(0, [Validators.required]),
      'negMarksSCQ': new FormControl(0, [Validators.required]),
      'posMarksMCQ': new FormControl(0, [Validators.required]),
      'negMarksMCQ': new FormControl(0, [Validators.required])
    });
  }

  addContest(navigate: boolean){
    const formData = this.addContestForm.value;
    const contest = {
      name: formData.contestName,
      startTime: formData.startTime,
      duration: formData.duration,
      endTime: formData.endTime,
      details: formData.details,
      rules: formData.rules,
      scoreDisplay: formData.scoreDisplay,
      hasScoreBoard: formData.hasScoreBoard,
      quizId: this.data.editing ? "hello" : null,
      random: formData.randomize,
      singleChoice: {
        count: formData.nSCQ,
        points: formData.posMarksSCQ,
        negPoints: formData.negMarksSCQ
      },
      multipleChoice: {
        count: formData.nMCQ,
        points: formData.posMarksMCQ,
        negPoints: formData.negMarksMCQ
      }
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
