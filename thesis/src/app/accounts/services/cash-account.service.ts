import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import CashAccount from '../models/cash-account.model';

@Injectable({
  providedIn: 'root',
})
export class CashAccountService {
  private apiUrl = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) {}

  getCashAccounts(): Observable<CashAccount[]> {
    return this.http.get<CashAccount[]>(this.apiUrl);
  }

  addCashAccount(account: CashAccount): Observable<CashAccount> {
    return this.http.post<CashAccount>(this.apiUrl, account);
  }

  updateCashAccountBalance(account: CashAccount): Observable<CashAccount> {
    return this.http.patch<CashAccount>(
      `${this.apiUrl}/${account._id}/balance`,
      {
        balance: account.balance,
        currency: account.currency,
      }
    );
  }

  updateCashAccountName(account: CashAccount): Observable<CashAccount> {
    return this.http.patch<CashAccount>(`${this.apiUrl}/${account._id}/name`, {
      name: account.name,
    });
  }

  deleteCashAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
