import { Component, OnInit } from '@angular/core';
import { faSignOutAlt, faSignInAlt, faUserPlus, faUser, faInfoCircle, faListOl, faSignal } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { QuesService } from '../services/ques.service';
import { NotificationsService } from 'angular2-notifications';

fontawesome.library.add(faSignOutAlt, faSignInAlt, faUserPlus, faUser, faInfoCircle, faListOl, faSignal);

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
    private data: DataService,private router: Router,private quesService: QuesService,private notificationService: NotificationsService) { }
  
  user: string;
  contest;
  flagBughunt=false;
  flagCrypto=false;
  resume = true;
  isAttempt = false;
  lang=false;

  ngOnInit() {
    this.data.currentName.subscribe(message => this.user = message);
    this.contest=this.router.url;
    console.log(this.contest);
    // this.quesService.getAllQues().subscribe(
    //   data => {
    //     this.isAttempt = data.isAttempt;
    //     if(data.startTime != null)
    //       this.resume = true;
    //     else
    //       this.resume = false;
    //   },
    //   error => {
    //     this.notificationService.create("", JSON.parse(error._body).error);
    //     this.router.navigate['/welcome'];
    //   }
    // );
    
  }
  setFlagBughunt(){
    this.flagBughunt=true;
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout(){
    this.authService.logout();
    this.flagBughunt=false;
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

}
