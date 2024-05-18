import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';

import { BudgetsService } from '../../budgets/budgets.service';
import { CategoryService } from '../../categories/category.service';
import { CashTransactionService } from '../../transactions/cash-transactions.service';
import Budget from '../../budgets/budget-list/budget.model';
import Category from '../../categories/category-list/category.model';
import CashTransaction from '../../transactions/cash-transactions-list/cash-transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isLoading = false;
  totalBudgetedAmount = 0;
  budgets: Budget[] = [];
  tableBudgets: Budget[] = []; 
  categories: Category[] = [];
  tableCashTransactions: CashTransaction[] = [];
  cashTransactions: CashTransaction[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: false,
  };
  public pieChartLabelsExpenses: string[] = [];
  public pieChartLabelsIncome: string[] = [];
  public pieChartLabelsBudgets: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartDataExpenses: any[] = [];
  public pieChartDataIncome: any[] = [];
  public pieChartDataBudgets: any[] = [];
  public pieChartType: ChartType = 'pie';

  ngOnInit() {
    this.loadData();
  }

  protected loadData() {
    this.isLoading = true;
    forkJoin({
      categories: this.categoriesService.getCategories(),
      transactions: this.cashTransactionsService.getTransactions(),
      budgets: this.budgetsService.getBudgets(),
    }).subscribe(({ categories, transactions, budgets }) => {
      this.isLoading = false;
      this.categories = categories.categories;
      this.budgets = budgets.budgets;
      this.tableBudgets = budgets.budgets.slice(0, 5);
      this.totalBudgetedAmount = budgets.totalBudgetedAmount;
      this.cashTransactions = transactions;
      this.tableCashTransactions = transactions.slice(0, 5);
      this.preparePieChartDataTransactions();
      this.preparePieChartDataBudgets();
    });
  }

  protected preparePieChartDataTransactions() {
    const expenseCategories = this.categories.filter(
      (c) => c.type === 'expense'
    );
    this.pieChartLabelsExpenses = expenseCategories.map((c) => c.name);
    const expenseTransactions = this.cashTransactions.filter(
      (t) => t.type === 'expense'
    );
    const expenseTotals = expenseTransactions.reduce<Record<string, number>>(
      (trn, transaction) => {
        const amount = transaction.amountEquivalent ?? 0;
        if (amount > 0) {
          if (trn[transaction.category.name]) {
            trn[transaction.category.name] += amount;
          } else {
            trn[transaction.category.name] = amount;
          }
        }
        return trn;
      },
      {}
    );

    this.pieChartLabelsExpenses = this.pieChartLabelsExpenses.filter(
      (label) => expenseTotals[label]
    );
    this.pieChartDataExpenses = [
      {
        data: this.pieChartLabelsExpenses.map(
          (label) => expenseTotals[label] ?? 0
        ),
      },
    ];

    const incomeCategories = this.categories.filter((c) => c.type === 'income');
    this.pieChartLabelsIncome = incomeCategories.map((c) => c.name);
    const incomeTransactions = this.cashTransactions.filter(
      (t) => t.type === 'income'
    );
    const incomeTotals = incomeTransactions.reduce<Record<string, number>>(
      (trn, transaction) => {
        const amount = transaction.amountEquivalent ?? 0;
        if (amount > 0) {
          if (trn[transaction.category.name]) {
            trn[transaction.category.name] += amount;
          } else {
            trn[transaction.category.name] = amount;
          }
        }
        return trn;
      },
      {}
    );
    this.pieChartLabelsIncome = this.pieChartLabelsIncome.filter(
      (label) => incomeTotals[label]
    );
    this.pieChartDataIncome = [
      {
        data: this.pieChartLabelsIncome.map(
          (label) => incomeTotals[label] ?? 0
        ),
      },
    ];
  }

  protected preparePieChartDataBudgets() {
    this.pieChartLabelsBudgets = ['Available', 'Spent'];
    this.pieChartDataBudgets = [
      {
        data: [
          this.totalBudgetedAmount -
            this.cashTransactions
              .filter((t) => t.type === 'expense')
              .reduce((acc, t) => acc + (t.amountEquivalent ?? 0), 0),
          this.cashTransactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => acc + (t.amountEquivalent ?? 0), 0),
        ],
      },
    ];
  }

  constructor(
    private cashTransactionsService: CashTransactionService,
    private budgetsService: BudgetsService,
    private categoriesService: CategoryService
  ) {}
}
