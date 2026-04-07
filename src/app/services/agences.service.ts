import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environements/environement";

@Injectable({
  providedIn: 'root'
})
export class AgencesService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllAgences(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/agences`);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${environment.restBaseUrl}/api/v1/agences/delete/${id}`);
  }


  toggleStatus(id: any): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/agences/toggle-status/${id}`);
  }

  saveAgence(agence: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/agences`, agence);
  }

  updateAgence(id: any, agence: any): Observable<any> {
    return this.http.put(`${environment.restBaseUrl}/api/v1/agences/update/${id}`, agence);
  }
}
