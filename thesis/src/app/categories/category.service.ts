import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Category from './category-list/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'; 

  constructor(private http: HttpClient) {}

  // Fetch all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
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
      name: category.name
    });
  }

  // Update a category's name
  updateCategoryIcon(category: Category, icon: string): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/icon`, {
      icon: icon
    });
  }

  // Update a category's shared status
  updateCategoryShareStatus(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}/share`, {
      isShared: category.isShared
    });
  }

  // Delete a category
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
