import { Component } from '@angular/core';

import { BudgetsService } from '../../budgets/budgets.service';
import { CashTransactionService } from '../../transactions/cash-transactions.service';
import CashTransaction from '../../transactions/cash-transactions-list/cash-transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isLoading = false;
  tableCashTransactions: CashTransaction[] = [];
  cashTransactions: CashTransaction[] = [];

  ngOnInit() {
    this.loadCashTransactions();
  }

  protected loadCashTransactions() {
    this.isLoading = true;
    this.cashTransactionsService
      .getTransactions()
      .subscribe((cashTransactions) => {
        this.isLoading = false;
        this.cashTransactions = cashTransactions;
        this.tableCashTransactions = cashTransactions.slice(0, 5);
      });
  }

  constructor(
    private cashTransactionsService: CashTransactionService,
    private budgetsService: BudgetsService
  ) {}
}
