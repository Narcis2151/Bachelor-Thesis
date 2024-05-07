import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Payment from './payments-list/payment-model';
import Currency from '../../../shared/account-currency';
import Category from '../categories/category-list/category.model';

export interface CreatePaymentDto {
  _id?: string;
  beneficiary: {
    name: string;
    account?: string;
  };
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date | string;
  isRecurrent: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  recurrenceStart?: Date;
  recurrenceEnd?: Date;
  account?: string;
  category?: string;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private apiUrl = 'http://localhost:3000/payments';

  constructor(private http: HttpClient) {}

  // Fetch all payments
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  // Add a new payment
  addPayment(payment: Payment): Observable<Payment> {
    const newPayment: CreatePaymentDto = {
      beneficiary: payment.beneficiary,
      details: payment.details,
      amount: payment.amount,
      currency: payment.currency,
      postingDate: payment.postingDate,
      isRecurrent: payment.isRecurrent,
      recurrence: payment.recurrence,
      recurrenceStart: payment.recurrenceStart,
      recurrenceEnd: payment.recurrenceEnd,
      account: payment.account._id,
      category: payment.category._id,
    };
    return this.http.post<Payment>(this.apiUrl, newPayment);
  }

  // Update a payment's recurrence
  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/${payment._id}`, {
      isRecurrent: payment.isRecurrent,
      recurrence: payment.recurrence,
      recurrenceStart: payment.recurrenceStart,
      recurrenceEnd: payment.recurrenceEnd,
    });
  }

  // Update payment's category
  updatePaymentCategory(payment: Payment, category: Category): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/${payment._id}/category`, {
      category: category._id,
    });
  }

  // Delete a category
  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
