import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Router } from "@angular/router";
import { tokenNotExpired } from "angular2-jwt";
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService{

    constructor(private http: Http,
    private router: Router){
    }

    getUser(id) {
        const headers = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return this.http.get(environment.apiUrl + 'user/profile/'+id, {headers: headers}).map(res => res.json());
    }

    loginUser(data){
        return this.http.post(environment.apiUrl + 'user/login', data).map(res => res.json());
    }

    registerUser(data){
        return this.http.post(environment.apiUrl + 'user/register', data).map(res => res.json());
    }

    logout(){
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['']);
    }

    storeUserData(token){
        const userData = token.split('.')[1];
        const user = atob(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
    }

    isAdmin(){
        return (JSON.parse(localStorage.getItem("user")).access === 121)||false;
    }

    isLoggedIn(){
        return tokenNotExpired();
    }  
}