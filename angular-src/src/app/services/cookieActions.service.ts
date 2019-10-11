import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';


@Injectable()
export class CookieActionsService {

  constructor(private cookieService: CookieService){
  }

  saveLogin(token) {
    const userData = token.split('.')[1];
    const userString = atob(userData);
    let user = JSON.parse(userString);
      if(!this.cookieService.check(user.id)){
          let data = {'token':token};
          let unparsedData = JSON.stringify(data);
        this.cookieService.set( user.id, unparsedData );
      }else{
          let unparsedData = this.cookieService.get(user.id);
          let parsedData = JSON.parse(unparsedData);
          parsedData.token = token;
          unparsedData = JSON.stringify(parsedData);
          this.cookieService.set( user.id, unparsedData );
      }
  }
  startQuiz(userId,quizId){
    if(this.cookieService.check(userId)){
        let unparsedData = this.cookieService.get(userId);
        let parsedData = JSON.parse(unparsedData);
        if(!parsedData.hasOwnProperty(quizId)){
            parsedData[quizId] = [];
        }
        unparsedData = JSON.stringify(parsedData);
        this.cookieService.set( userId, unparsedData );
    }
  }
  endQuiz(userId,quizId){
    if(this.cookieService.check(userId)){
        let unparsedData = this.cookieService.get(userId);
        let parsedData = JSON.parse(unparsedData);
        if(parsedData.hasOwnProperty(quizId)){
            delete parsedData.quizId;
        }
        unparsedData = JSON.stringify(parsedData);
        this.cookieService.set( userId, unparsedData );
    }
  }
  saveAns(userId,sol){
   
  }

}