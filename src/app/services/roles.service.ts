import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environements/environement";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllRoles(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/roles`);
  }

  getAllPermissions(): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/permissions`);
  }

  saveRole(role: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/roles`, role);
  }

  updateRole(id: String, role: any): Observable<any> {
    return this.http.patch(`${environment.restBaseUrl}/api/v1/roles/update/${id}`, role);
  }

  deleteRole(id: String): Observable<any> {
    return this.http.delete(`${environment.restBaseUrl}/api/v1/roles/delete/${id}`);
  }
}
