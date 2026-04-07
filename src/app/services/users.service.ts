import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environements/environement";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/users`);
  }

  toggleStatus(id: any): Observable<any> {
    return this.http.put(`${environment.restBaseUrl}/api/v1/users/toggle-status/${id}`, {});
  }

  changePassword(payload: any): Observable<any> {
    return this.http.put(`${environment.restBaseUrl}/api/v1/users/reinitialize-password`, payload);
  }

  saveUser(user: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/users/save`, user);
  }

  updateUser(id: any, user: any): Observable<any> {
    return this.http.put(`${environment.restBaseUrl}/api/v1/users/update/${id}`, user);
  }
}
