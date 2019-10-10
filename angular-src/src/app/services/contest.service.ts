import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContestService {

  constructor(private http: Http) { }

  addContest(contest){
    const headers = new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(environment.apiUrl+'contests/add', contest, {headers: headers}).map(res => res.json());
}

}
