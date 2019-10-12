import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { QuesService } from '../services/ques.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,private quesService: QuesService,private notificationService: NotificationsService) { }

  ngOnInit() {
    // this.quesService.getAllQues().subscribe(
    //   data => {
    //     if(data.startTime != null)
    //       this.router.navigate['/ques'];
    //   },
    //   error => {
    //     this.notificationService.create("", JSON.parse(error._body).error);
    //     this.router.navigate['/welcome'];
    //   }
    // );
  }

}
