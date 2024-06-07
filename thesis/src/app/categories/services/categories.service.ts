import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Category from '../components/category-list/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getDefaultCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/default`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
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

  deleteCategory(id: string, replacementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      body: {
        replacementId: replacementId,
      },
    });
  }
}
