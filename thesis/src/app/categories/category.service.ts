import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Category from './category-list/category.model';

export interface FetchCategoriesResponse {
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

  // Fetch all categories
  getCategories(): Observable<FetchCategoriesResponse> {
    return this.http.get<FetchCategoriesResponse>(this.apiUrl);
  }

  // Fetch available category icons
  getCategoryIcons(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/icons`);
  }

  // Add a new category
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  // Update a category's name
  updateCategoryName(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/name`, {
      name: category.name,
    });
  }

  // Update a category's name
  updateCategoryIcon(category: Category, icon: string): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/icon`, {
      icon: icon,
    });
  }

  // Update a category's shared status
  updateCategoryShareStatus(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/share`, {
      isShared: category.isShared,
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

  // Delete a category
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
