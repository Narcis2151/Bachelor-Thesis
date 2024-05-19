import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Category from '../categories/category-list/category.model';
import CashFuturePayment from './payments-list/cash-future-payment-model';
import CashRecurrentPayment from './payments-list/cash-recurrent-payment-model';

export interface FetchPaymentsResponse {
  futurePayments: CashFuturePayment[];
  recurrentPayments: CashRecurrentPayment[];
}

@Injectable({
  providedIn: 'root',
})
export class CashPaymentsService {
  private apiUrl = 'http://localhost:3000/payments';

  constructor(private http: HttpClient) {}

  // Fetch all payments
  getPayments(): Observable<FetchPaymentsResponse> {
    return this.http.get<FetchPaymentsResponse>(this.apiUrl);
  }

  // Add a new recurrent payment
  addCashFuturePayment(
    payment: CashFuturePayment
  ): Observable<CashFuturePayment> {
    const newPayment = {
      beneficiary: payment.beneficiary,
      details: payment.details,
      amount: payment.amount,
      currency: payment.currency,
      postingDate: payment.postingDate,
      account: payment.account._id,
      category: payment.category._id,
    };
    return this.http.post<CashFuturePayment>(
      `${this.apiUrl}/future`,
      newPayment
    );
  }

  // Update a future payment
  updateCashFuturePayment(
    payment: CashFuturePayment
  ): Observable<CashFuturePayment> {
    const updatedPayment = {
      beneficiary: payment.beneficiary,
      details: payment.details,
      amount: payment.amount,
      currency: payment.currency,
      postingDate: payment.postingDate,
      account: payment.account._id,
      category: payment.category._id,
    };
    return this.http.patch<CashFuturePayment>(
      `${this.apiUrl}/future/${payment._id}`,
      updatedPayment
    );
  }

  // Add a new recurrent payment
  addCashRecurrentPayment(
    payment: CashRecurrentPayment
  ): Observable<CashRecurrentPayment> {
    const newPayment = {
      beneficiary: payment.beneficiary,
      details: payment.details,
      amount: payment.amount,
      currency: payment.currency,
      recurrence: payment.recurrence,
      recurrenceStart: payment.recurrenceStart,
      account: payment.account._id,
      category: payment.category._id,
    };
    return this.http.post<CashRecurrentPayment>(
      `${this.apiUrl}/recurrent`,
      newPayment
    );
  }

  // Update a recurrent payment
  updateCashRecurrentPayment(
    payment: CashRecurrentPayment
  ): Observable<CashRecurrentPayment> {
    const updatedPayment = {
      beneficiary: payment.beneficiary,
      details: payment.details,
      amount: payment.amount,
      currency: payment.currency,
      recurrence: payment.recurrence,
      recurrenceStart: payment.recurrenceStart,
      account: payment.account._id,
      category: payment.category._id,
    };
    return this.http.patch<CashRecurrentPayment>(
      `${this.apiUrl}/recurrent/${payment._id}`,
      updatedPayment
    );
  }

  // Update future payment's category
  updateCashFuturePaymentCategory(
    payment: CashFuturePayment,
    category: Category
  ): Observable<CashFuturePayment> {
    return this.http.patch<CashFuturePayment>(
      `${this.apiUrl}/future/category/${payment._id}`,
      {
        category: category._id,
      }
    );
  }

  // Update recurrent payment's category
  updateCashRecurrentPaymentCategory(
    payment: CashRecurrentPayment,
    category: Category
  ): Observable<CashRecurrentPayment> {
    return this.http.patch<CashRecurrentPayment>(
      `${this.apiUrl}/recurrent/category/${payment._id}`,
      {
        category: category._id,
      }
    );
  }

  // Delete a cash payment
  deleteCashFuturePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/future/${id}`);
  }
  deleteCashRecurrentPayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recurrent/${id}`);
  }
}
