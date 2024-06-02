import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Category from './category-list/category.model';

export interface FetchCategoriesResponse {
  partnerName: string | null;
  partnershipStatus: string | null;
  categories: Category[];
}

export interface CreatePartnershipDto {
  partnerEmail: string;
  sharedCategories: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getDefaultCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/default`);
  }

  getCategories(): Observable<FetchCategoriesResponse> {
    return this.http.get<FetchCategoriesResponse>(this.apiUrl);
  }

  getCategoryIcons(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/icons`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategoryName(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/name`, {
      name: category.name,
    });
  }

  updateCategoryIcon(category: Category, icon: string): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/icon`, {
      icon: icon,
    });
  }

  updateCategoryShareStatus(category: Category): Observable<Category> {
    console.log(category);
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/share`, {
      isShared: !category.isShared,
    });
  }

  createPartnership(
    createPartnershipDto: CreatePartnershipDto
  ): Observable<{ partnershipStatus: string }> {
    return this.http.post<{ partnershipStatus: string }>(
      `${this.apiUrl}/partnership`,
      {
        partnerEmail: createPartnershipDto.partnerEmail,
        sharedCategories: createPartnershipDto.sharedCategories,
      }
    );
  }

  acceptPartnershipChanges(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/partnership/accept`, {});
  }

  rejectPartnershipChanges(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/partnership/reject`, {});
  }

  deleteCategory(id: string, replacementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      body: {
        replacementId: replacementId,
      },
    });
  }

  deletePartnership(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/partnership/`);
  }
}
