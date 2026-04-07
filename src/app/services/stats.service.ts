import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environements/environement";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getDossierCount(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/stats/dossiers-count`);
  }

  getClientCount(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/stats/clients-count`);
  }

  getClientByTypeCount(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/stats/clients-count-by-type`);
  }

  getAgenceCount(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/stats/agences-count`);
  }



}
