import { Inject,Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { environment } from '../../environments/environment';


@Injectable()
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService){
  }

  saveLogin(token) {
    const userData = token.split('.')[1];
    const userString = atob(userData);
    let user = JSON.parse(userString);
      if(this.storage.has(user.id)){
        let data = this.storage.get(user.id);
        data.token = token;
        this.storage.set( user.id, data );
         
      }else{
        let data = {'token':token};
        this.storage.set( user.id, data );
      }
  }
  startQuiz(userId,quizId){
    if(this.storage.has(userId)){
        let data = this.storage.get(userId);
        if(!data.hasOwnProperty(quizId)){
            data[quizId] = [];
            this.storage.set( userId, data );
        }
        
    }
  }
  endQuiz(userId,quizId){
    if(this.storage.has(userId)){
        let data = this.storage.get(userId);
        if(data.hasOwnProperty(quizId)){
            delete data.quizId;
            this.storage.set( userId, data );
        }

        
    }
  }
  saveAns(userId,quizId,queId,sol){
    if(this.storage.has(userId)){
        let data = this.storage.get(userId);
        if(data.hasOwnProperty(quizId)){
            let newSubmission = data.quizId.filter(x=>{
                return x.queId!=queId;
            });
            newSubmission.push({
                'queId':queId,
                'sol':sol
            })
            data.quizId = newSubmission;
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
    if(this.storage.has(userId)){
        let data = this.storage.get(userId);
        if(data.hasOwnProperty(quizId)){
            let newSubmission = data.quizId.filter(x=>{
                return x.queId!=queId;
            });
            data.quizId = newSubmission;
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

}