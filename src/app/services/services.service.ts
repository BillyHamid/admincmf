import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environements/environement";

@Injectable({ providedIn: 'root' })
export class ServicesService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${environment.restBaseUrl}/api/v1/services`)
  }

  create(data: any) {
    return this.http.post<any>(`${environment.restBaseUrl}/api/v1/services`, data)
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${environment.restBaseUrl}/api/v1/services/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete(`${environment.restBaseUrl}/api/v1/services/${id}`)
  }
}
