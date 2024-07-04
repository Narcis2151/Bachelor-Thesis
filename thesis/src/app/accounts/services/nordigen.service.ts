import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Requisition from '../models/requisition.model';
import Institution from '../models/institution.model';

@Injectable({
  providedIn: 'root',
})
export class NordigenService {
  private nordigenUrl = 'http://localhost:3000/nordigen';

  constructor(private http: HttpClient) {}

  getInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>(`${this.nordigenUrl}/institutions`);
  }

  createRequisition(
    redirectUrl: string,
    institutionId: string,
    bankLogo: string
  ): Observable<Requisition> {
    return this.http.post<Requisition>(`${this.nordigenUrl}/requisitions`, {
      redirectUrl,
      institutionId,
      bankLogo,
    });
  }

  getRequisition(requisitionId: string): Observable<Requisition> {
    return this.http.get<Requisition>(
      `${this.nordigenUrl}/requisitions/${requisitionId}`
    );
  }

  importData(requisitionId: string): Observable<Requisition> {
    return this.http.post<Requisition>(`${this.nordigenUrl}/import`, {
      requisitionId,
    });
  }
}
