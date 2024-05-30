import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Currency from '../../../shared/account-currency';
import Category from '../categories/category-list/category.model';
import CashTransaction from './cash-transactions-list/cash-transaction.model';

export interface CreateCashTransactionDto {
  _id?: string;
  type: 'income' | 'expense';
  beneficiary: string;
  details: string;
  amount: number;
  currency?: Currency;
  postingDate: Date | string;
  account?: string;
  category?: string;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CashTransactionService {
  private apiUrl = 'http://localhost:3000/cash-transactions';

  constructor(private http: HttpClient) {}

  // Fetch all cash transactions
  getTransactions(
    page?: number,
    limit?: number,
    categoryId?: string
  ): Observable<CashTransaction[]> {
    return this.http.get<CashTransaction[]>(this.apiUrl, {
      params: {
        page: page !== undefined ? page.toString() : [],
        limit: limit !== undefined ? limit.toString() : [],
        categoryId: categoryId !== undefined ? categoryId : [],
      },
    });
  }

  // Add a new cash transaction
  addCashTransaction(
    cashTransaction: CashTransaction
  ): Observable<CashTransaction> {
    const newCashTransaction: CreateCashTransactionDto = {
      type: cashTransaction.type,
      beneficiary: cashTransaction.beneficiary,
      details: cashTransaction.details,
      amount: cashTransaction.amount,
      currency: cashTransaction.currency,
      postingDate: cashTransaction.postingDate,
      category: cashTransaction.category?._id,
      account: cashTransaction.account?._id,
    };
    return this.http.post<CashTransaction>(this.apiUrl, newCashTransaction);
  }

  // Update a transaction's details
  updateTransaction(
    cashTransaction: CashTransaction
  ): Observable<CashTransaction> {
    return this.http.patch<CashTransaction>(
      `${this.apiUrl}/${cashTransaction._id}`,
      {
        type: cashTransaction.type,
        beneficiary: cashTransaction.beneficiary,
        details: cashTransaction.details,
        amount: cashTransaction.amount,
        currency: cashTransaction.currency,
        postingDate: cashTransaction.postingDate,
        account: cashTransaction.account?._id,
      }
    );
  }

  // Update a transactions's category
  updateTransactionCategory(
    cashTransaction: CashTransaction,
    category?: Category
  ): Observable<CashTransaction> {
    return this.http.patch<CashTransaction>(
      `${this.apiUrl}/${cashTransaction._id}/category`,
      {
        category: category ? category._id : null,
        type: cashTransaction.cashBank,
      }
    );
  }

  // Delete a category
  deleteCashTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
