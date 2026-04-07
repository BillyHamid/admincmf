import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, tap, throwError} from "rxjs";
import {environment} from "../../environements/environement";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private dossierCountSubject = new BehaviorSubject<number | null>(null);
  public dossierCount = this.dossierCountSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  getAllClientPhysique(data: any, page: number = 0, size: number = 10, search: string = ""): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/physique/search?search=${search}&page=${page}&size=${size}`, data);
  }
  getAllClientAssociation(data: any,page: number, size: number) {
    return this.http.post<any>(`${environment.restBaseUrl}/api/v1/admin/clients/association/search?page=${page}&size=${size}`, data);
  }
  getAllClientMoral(data: any, page: number = 0, size: number = 10): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/moral/search?search&page=${page}&size=${size}`, data);
  }
  getClientPiecesJusticatif(clientId: string = ""): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/piece-justificatives/client/${clientId}`);
  }

  validateKyc(data: any): Observable<any> {
    return this.http.put(`${environment.restBaseUrl}/api/v1/admin/clients/dossiers/validate`, data);
  }

  rejectKyc(data: any): Observable<any> {
    return this.http.put(`${environment.restBaseUrl}/api/v1/admin/clients/dossiers/reject`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${environment.restBaseUrl}/api/v1/admin/clients/${id}/delete`);
  }

  saveClientPhysique(formData: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/physique/create`, formData);
  }

  activeClient(clientId: string): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/${clientId}/enable-mobile`, {});
  }

  updateClientPhysique(id: any, formData: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/physique/update/${id}`, formData);
  }

  saveClientMoral(formData: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/moral/create`, formData);
  }

  updateClientMoral(id: any, formData: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/moral/update/${id}`, formData);
  }

  saveClientAssociation(formData: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/association/create`, formData);
  }

  updateClientAssociation(id: any, formData: any): Observable<any> {
    return this.http.post(`${environment.restBaseUrl}/api/v1/admin/clients/association/update/${id}`, formData);
  }

  // downLoadPiece(url: string = ""): Observable<any> {
  //   return this.http.get(`${environment.restBaseUrl}/api/v1/admin/piece-justificatives/files?key=${url}`);
  // }

  downLoadPiece(key: string): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/piece-justificatives/files?key=${encodeURIComponent(key)}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }


  getDossier(): Observable<any> {
    return this.http
      .get<any>(`${environment.restBaseUrl}/api/v1/admin/clients/dossiers/pending`)
      .pipe(
        tap((res) => {
          const count = Array.isArray(res) ? res.length : 0;
          this.dossierCountSubject.next(count);
        }),
        catchError((err) => {
          this.dossierCountSubject.next(0);
          return throwError(() => err);
        })
      );
  }

  getDossierDetails(dossierId: any): Observable<any> {
    return this.http.get(`${environment.restBaseUrl}/api/v1/admin/clients/dossiers/${dossierId}`);
  }


}
