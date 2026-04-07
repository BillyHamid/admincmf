import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environements/environement';

@Injectable({ providedIn: 'root' })
export class CompteBancaireService {
  private readonly BASE_URL = `${environment.restBaseUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  creerCompte(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/admin/comptes/create`, formData);
  }

  getByClient(id: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/admin/comptes/client/${id}`);
  }

  getReleveRequest(status: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/comptes-bancaires/releves/search`,status);
  }

  submitReleve(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.BASE_URL}/comptes-bancaires/releves/${id}/submit`, formData);
  }

  rejectReleve(id: string, comment: String): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/comptes-bancaires/releves/${id}/reject?reason=${comment}`, {});
  }
}
