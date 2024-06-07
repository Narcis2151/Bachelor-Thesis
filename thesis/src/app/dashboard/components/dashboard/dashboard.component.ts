import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';

import { BudgetsService } from '../../../budgets/services/budgets.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import Budget from '../../../budgets/components/budget-list/budget.model';
import Category from '../../../categories/components/category-list/category.model';
import CashTransaction from '../../../transactions/models/transaction.model';

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

  pieChartOptionsExpenses: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Expenses',
        fullSize: true,
      },
    },
  };
  pieChartOptionsBudgets: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Budgets',
        fullSize: true,
      },
    },
  };
  pieChartLabelsExpenses: string[] = [];
  pieChartLabelsBudgets: string[] = [];
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartDataExpenses: any[] = [];
  pieChartDataBudgets: any[] = [];
  pieChartType: ChartType = 'pie';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    forkJoin({
      transactions: this.transactionsService.getTransactions(),
      budgets: this.budgetsService.getBudgets(),
    }).subscribe(({ transactions, budgets }) => {
      this.budgets = budgets.budgets;
      this.cashTransactions = transactions;
      this.tableCashTransactions = transactions.slice(0, 5);
      this.categoriesService.getCategories().subscribe((categories) => {
        this.isLoading = false;
        this.categories = categories;
        this.budgets.map((b) => {
          const category = this.categories.find(
            (c) => c._id === b.category._id
          );
          if (category) {
            b.userSpentAmount = category.userSpentAmount! * b.exchangeRate!;
          }
        });
        this.tableBudgets = this.budgets.slice(0, 5);
        this.totalBudgetedAmount = budgets.totalBudgetedAmount;
        this.preparePieChartDataBudgets();
        this.preparePieChartDataTransactions();
      });
    });
  }

  preparePieChartDataTransactions() {
    const expenseCategories = this.categories.filter(
      (c) => c.type === 'expense' && c.userSpentAmount! > 0
    );
    this.pieChartLabelsExpenses = expenseCategories.map((c) => c.name);
    const expenseTotals = expenseCategories.reduce<Record<string, number>>(
      (trn, category) => {
        if (category.userSpentAmount! > 0) {
          trn[category.name] = category.userSpentAmount!;
        }
        return trn;
      },
      {}
    );

    this.pieChartDataExpenses = [
      {
        data: this.pieChartLabelsExpenses.map(
          (label) => expenseTotals[label] ?? 0
        ),
      },
    ];
  }

  preparePieChartDataBudgets() {
    const activeBudgets = this.budgets.filter((b) => b.active);
    const budgetedCategories = this.categories.filter((c) =>
      activeBudgets.find((b) => b.category._id === c._id)
    );
    this.pieChartLabelsBudgets = budgetedCategories.map((c) => c.name);
    this.pieChartLabelsBudgets.push('Unbudgeted');
    console.log(activeBudgets);

    const budgetedTotals = activeBudgets.reduce<Record<string, number>>(
      (bgt, budget) => {
        const budgetedAmount = budget.amountAvailableEquivalent ?? 0;
        if (budgetedAmount > 0) {
          if (bgt[budget.category.name]) {
            bgt[budget.category.name] += budgetedAmount;
          } else {
            bgt[budget.category.name] = budgetedAmount;
          }
        }
        return bgt;
      },
      {}
    );
    const budgetedTotalsSum = Object.values(budgetedTotals).reduce(
      (sum, amount) => sum + amount,
      0
    );
    budgetedTotals['Unbudgeted'] = this.totalBudgetedAmount - budgetedTotalsSum;

    this.pieChartLabelsBudgets = this.pieChartLabelsBudgets.filter(
      (label) => budgetedTotals[label]
    );
    this.pieChartDataBudgets = [
      {
        data: this.pieChartLabelsBudgets.map(
          (label) => budgetedTotals[label] ?? 0
        ),
      },
    ];
  }

  constructor(
    private transactionsService: TransactionsService,
    private budgetsService: BudgetsService,
    private categoriesService: CategoriesService
  ) {}
}
