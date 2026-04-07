import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environements/environement";

@Injectable({
  providedIn: 'root'
})
export class CampagneService {

  constructor(
    private http: HttpClient
  ) {
  }

  sendNotification(data: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/admin/campagnes`, data);
  }

  getAllCampagne(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/admin/campagnes`);
  }

  deleteCampagne(id: number): Observable<any> {
    return this.http.delete(`${environment.restBaseUrl}/api/admin/campagnes/${id}`);
  }
}
