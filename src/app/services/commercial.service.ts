import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environements/environement';

@Injectable({ providedIn: 'root' })
export class CommercialService {
  private readonly BASE = `${environment.restBaseUrl}/api/v1/commercial`;

  constructor(private http: HttpClient) {}

  getMyProspects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/prospects`);
  }

  getDashboardStats(): Observable<{ total: number; pending: number; validated: number; rejected: number }> {
    return this.http.get<any>(`${this.BASE}/dashboard`);
  }

  getProspectDetail(dossierId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE}/prospects/${dossierId}`);
  }

  creerProspectPhysique(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.BASE}/prospects/physique`, formData);
  }

  creerProspectMoral(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.BASE}/prospects/moral`, formData);
  }

  creerProspectAssociation(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.BASE}/prospects/association`, formData);
  }
}
