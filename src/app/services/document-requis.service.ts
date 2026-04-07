import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DocumentRequis} from "../pages/configuration/basic/document-requis.component";
import {environment} from "../../environements/environement";

@Injectable({ providedIn: 'root' })
export class DocumentRequisService {
  private api = environment.restBaseUrl + '/api/v1/documents-requis';

  constructor(private http: HttpClient) {}

  getByDestinator(destinator: string): Observable<DocumentRequis[]> {
    return this.http.get<DocumentRequis[]>(`${this.api}/by-destinator/${destinator}`);
  }


  create(doc: any): Observable<any> {
    return this.http.post<any>(this.api, doc);
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${uuid}`);
  }
}
