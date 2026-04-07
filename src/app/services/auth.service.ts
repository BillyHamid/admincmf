import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../environements/environement";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService();

  // BehaviorSubject to store the user data
  user = new BehaviorSubject<any>({});

  constructor(
    private http: HttpClient
  ) {

    // Get the user data from the local storage
    const cache = localStorage.getItem(environment.sessionKey);
    if (cache !== null) {
      try {
        const parsed = JSON.parse(cache);
        this.user.next(typeof parsed === 'string' ? JSON.parse(parsed) : parsed);
      } catch {
        this.user.next({});
      }
    }

  }


  getToken(): string | null{
    return localStorage.getItem(environment.jwtKey)??'';
  }

  getTokenData(){
    let token = this.getToken();
    if (token === null) return null;
    return  this.helper.decodeToken(token);
  }

  isAuthenticated(){
    const token = this.getToken();
    if (token === undefined || token === null) return false;
    return !this.helper.isTokenExpired(token);
  }


  hasAuthority(role: string){
    if (!this.isAuthenticated()) return false;
    const data = this.helper.decodeToken(this.getToken()!);
    return data.roles?.includes(role);
  }


  login(data: any){
    return this.http.post<any>(environment.restBaseUrl+'/api/v1/public/auth/admin/login', data);
  }

  resetPass(data: any){
    return this.http.post<any>(environment.restBaseUrl+'/api/v1/public/auth/admin/reset-password/' + data, {});
  }

  logout() {

    let uname: string | null = null;
    let cache = localStorage.getItem(environment.sessionKey);
    if (cache === null) uname = null;

    localStorage.removeItem(environment.jwtKey);
    localStorage.removeItem(environment.sessionKey);
    location.href = '/auth/login';
  }
}
