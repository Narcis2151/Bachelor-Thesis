import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Currency from '../../../../shared/account-currency';
import Category from '../../categories/components/category-list/category.model';
import CashTransaction from '../models/transaction.model';

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
  isTransfer?: boolean;
  isSelected?: boolean;
}

export interface FetchCategoryAmountsDto {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  spent: number;
  received: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  // Fetch all cash transactions
  getTransactions(categoryId?: string): Observable<CashTransaction[]> {
    return this.http.get<CashTransaction[]>(this.apiUrl, {
      params: {
        categoryId: categoryId !== undefined ? categoryId : [],
      },
    });
  }

  getPartnerTransactions(categoryId?: string): Observable<CashTransaction[]> {
    return this.http.get<CashTransaction[]>(`${this.apiUrl}/partner`, {
      params: {
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
      isTransfer: cashTransaction.category?._id ? false : true,
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
  deleteCashTransaction(id: string, type: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      body: { type: type },
    });
  }
}
