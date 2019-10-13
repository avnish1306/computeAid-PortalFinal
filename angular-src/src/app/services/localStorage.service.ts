import { Inject,Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';


@Injectable()
export class LocalStorageService {

  constructor(){
  }

  saveLogin(token) {
    const userData = token.split('.')[1];
    const userString = atob(userData);
    let user = JSON.parse(userString);
      if(localStorage.hasOwnProperty(user.id)){
        let data = JSON.parse(localStorage.getItem(user.id));
        data.token = token;
        localStorage.setItem( user.id,JSON.stringify(data));
         
      }else{
        let data = {'token':token};
        localStorage.setItem( user.id,JSON.stringify(data));
      }
  }
  startQuiz(userId,quizId){
      console.log("startQuiz",userId,quizId);
    if(localStorage.hasOwnProperty(userId)){
        let data = JSON.parse(localStorage.getItem(userId));
        console.log(data);
        if(!data.hasOwnProperty(quizId)){
            console.log("has");
            data[quizId] = [];
            localStorage.setItem( userId,JSON.stringify(data));
        }
        
    }
  }
  endQuiz(userId,quizId){
    if(localStorage.hasOwnProperty(userId)){
        let data = JSON.parse(localStorage.getItem(userId));
        if(data.hasOwnProperty(quizId)){
            delete data[quizId];
            localStorage.setItem( userId,JSON.stringify(data));
        }

        
    }
  }
  isStarted(userId,quizId){
    if(localStorage.hasOwnProperty(userId)){
        let data = JSON.parse(localStorage.getItem(userId));
        if(data.hasOwnProperty(quizId)){
            return true;
        }else{
            return false;
        }
    }
  }
  saveAns(userId,quizId,queId,sol){
    if(localStorage.hasOwnProperty(userId)){
        let data = JSON.parse(localStorage.getItem(userId));
        if(data.hasOwnProperty(quizId)){
            let newSubmission = data[quizId].filter(x=>{
                return x.queId!=queId;
            });
            newSubmission.push({
                'queId':queId,
                'ans':sol
            })
            data[quizId] = newSubmission;
            localStorage.setItem( userId,JSON.stringify(data));
            return {
                'status':1,
                'msg':"Saved"
            }
        }else{
            return {
                'status':0,
                'msg':"Browser Error"
            }
        }
    }else{
        return {
            'status':0,
            'msg':"Browser Error"
        }
    }
  }
  clearAns(userId,quizId,queId) {
    if(localStorage.hasOwnProperty(userId)){
        let data = JSON.parse(localStorage.getItem(userId));
        if(data.hasOwnProperty(quizId)){
            let newSubmission = data[quizId].filter(x=>{
                return x.queId!=queId;
            });
            data[quizId] = newSubmission;
            localStorage.setItem( userId,JSON.stringify(data));
            return {
                'status':1,
                'msg':"Cleared"
            }
        }else{
            return {
                'status':0,
                'msg':"Browser Error"
            }
        }
    }else{
        return {
            'status':0,
            'msg':"Browser Error"
        }
    }
  }
  getSubmissions(userId,quizId){
    if(localStorage.hasOwnProperty(userId)){
        let data = JSON.parse(localStorage.getItem(userId));
        if(data.hasOwnProperty(quizId)){
            return data[quizId];
        }
    }
    return [];
  }

}