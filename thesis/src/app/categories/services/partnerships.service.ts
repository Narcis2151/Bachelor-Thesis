import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FetchPartnershipResponse {
  partnerName: string | null;
  partnershipStatus: string | null;
}

export interface CreatePartnershipDto {
  partnerEmail: string;
  sharedCategories: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PartnershipsService {
  private apiUrl = 'http://localhost:3000/partnerships';

  constructor(private http: HttpClient) {}

  findPartnership(): Observable<FetchPartnershipResponse> {
    return this.http.get<FetchPartnershipResponse>(this.apiUrl);
  }

  createPartnership(
    createPartnershipDto: CreatePartnershipDto
  ): Observable<FetchPartnershipResponse> {
    return this.http.post<FetchPartnershipResponse>(this.apiUrl, {
      partnerEmail: createPartnershipDto.partnerEmail,
      sharedCategories: createPartnershipDto.sharedCategories,
    });
  }

  acceptPartnershipChanges(): Observable<FetchPartnershipResponse> {
    return this.http.patch<FetchPartnershipResponse>(
      `${this.apiUrl}/accept`,
      {}
    );
  }

  rejectPartnershipChanges(): Observable<FetchPartnershipResponse> {
    return this.http.patch<FetchPartnershipResponse>(
      `${this.apiUrl}/reject`,
      {}
    );
  }

  deletePartnership(): Observable<FetchPartnershipResponse> {
    return this.http.delete<FetchPartnershipResponse>(this.apiUrl);
  }
}
