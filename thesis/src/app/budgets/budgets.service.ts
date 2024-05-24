import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Currency from '../../../shared/account-currency';
import Budget from './budget-list/budget.model';
import Category from '../categories/category-list/category.model';

export interface CreateBudgetDto {
  _id?: string;
  category?: string;
  amountAvailable: number;
  currency: Currency;
  startDate: Date | string;
}

interface BudgetsResponse {
  totalBudgetedAmount: number;
  budgets: Budget[];
}

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  private apiUrl = 'http://localhost:3000/budgets';

  constructor(private http: HttpClient) {}

  // Fetch all cash transactions
  getBudgets(): Observable<BudgetsResponse> {
    return this.http.get<BudgetsResponse>(this.apiUrl);
  }

  getAvailableCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Add a new cash budget
  addBudget(budget: Budget): Observable<Budget> {
    const newBudget: CreateBudgetDto = {
      category: budget.category._id,
      amountAvailable: budget.amountAvailable,
      currency: budget.currency,
      startDate: budget.startDate,
    };
    return this.http.post<Budget>(this.apiUrl, newBudget);
  }

  // Update a budget's details
  updateBudget(budget: Budget): Observable<Budget> {
    return this.http.patch<Budget>(`${this.apiUrl}/${budget._id}`, {
      startDate: budget.startDate,
      amountAvailable: budget.amountAvailable,
      currency: budget.currency,
    });
  }

  // Delete a budget
  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
