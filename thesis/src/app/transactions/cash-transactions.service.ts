import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Currency from '../../../shared/account-currency';
import Category from '../categories/category-list/category.model';
import CashTransaction from './cash-transactions-list/cash-transaction.model';
import cashAccounts from '../accounts/cash-account-list/cash-accounts-list.data';

export interface CreateCashTransactionDto {
  _id?: string;
  type: 'income' | 'expense';
  beneficiary: string;
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date | string;
  account?: string;
  category?: string;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  // Fetch all cash transactions
  getTransactions(): Observable<CashTransaction[]> {
    return this.http.get<CashTransaction[]>(this.apiUrl);
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
    };
    return this.http.post<CashTransaction>(this.apiUrl, newCashTransaction);
  }

  // Update a transaction's details
  updatePayment(cashTransaction: CashTransaction): Observable<CashTransaction> {
    return this.http.patch<CashTransaction>(
      `${this.apiUrl}/${cashTransaction._id}`,
      {
        type: cashTransaction.type,
        beneficiary: cashTransaction.beneficiary,
        details: cashTransaction.details,
        amount: cashTransaction.amount,
        currency: cashTransaction.currency,
        postingDate: cashTransaction.postingDate,
      }
    );
  }

  // Update a transactions's category
  updatePaymentCategory(
    cashTransaction: CashTransaction,
    category: Category
  ): Observable<CashTransaction> {
    return this.http.patch<CashTransaction>(
      `${this.apiUrl}/${cashTransaction._id}/category`,
      {
        category: category._id,
      }
    );
  }

  // Delete a category
  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
