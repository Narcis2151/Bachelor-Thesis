import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';

import { BudgetsService } from '../../budgets/services/budgets.service';
import { CategoriesService } from '../../categories/services/categories.service';
import { TransactionsService } from '../../transactions/services/transactions.service';
import Budget from '../../budgets/components/budget-list/budget.model';
import Category from '../../categories/components/category-list/category.model';
import CashTransaction from '../../transactions/components/transactions-list/transaction.model';

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

  public pieChartOptionsExpenses: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Expenses',
        fullSize: true,
      },
    },
  };
  public pieChartOptionsBudgets: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Budgets',
        fullSize: true,
      },
    },
  };
  public pieChartLabelsExpenses: string[] = [];
  public pieChartLabelsBudgets: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartDataExpenses: any[] = [];
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
      this.categories = categories;
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
    const expenseTransactions = this.cashTransactions.filter(
      (t) => t.category && t.type === 'expense'
    );
    const expenseCategories = expenseTransactions.map((t) => t.category);
    const uniqueExpenseCategories = [...new Set(expenseCategories)];

    this.pieChartLabelsExpenses = uniqueExpenseCategories.map((c) => c!.name);
    const expenseTotals = expenseTransactions.reduce<Record<string, number>>(
      (trn, transaction) => {
        const amount = transaction.amountEquivalent ?? 0;
        if (amount > 0) {
          if (trn[transaction.category!.name]) {
            trn[transaction.category!.name] += amount;
          } else {
            trn[transaction.category!.name] = amount;
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
    private cashTransactionsService: TransactionsService,
    private budgetsService: BudgetsService,
    private categoriesService: CategoriesService
  ) {}
}
