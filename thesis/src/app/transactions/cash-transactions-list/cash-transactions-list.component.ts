import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { ChartOptions, ChartType } from 'chart.js';
import { debounceTime, forkJoin } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';

import Category from '../../categories/category-list/category.model';
import Currency from '../../../../shared/account-currency';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';
import CashTransaction from './cash-transaction.model';
import { CategoryService } from '../../categories/category.service';
import { CashAccountService } from '../../accounts/cash-account.service';
import { CashTransactionService } from '../cash-transactions.service';

@Component({
  selector: 'app-cash-transactions-list',
  templateUrl: './cash-transactions-list.component.html',
  styleUrl: './cash-transactions-list.component.scss',
})
export class CashTransactionsListComponent {
  protected isLoading = false;
  protected cashTransactions: CashTransaction[] = [];
  protected selectedCashTransaction!: CashTransaction;
  protected currencies = Object.values(Currency);
  protected categories: Category[] = [];
  protected newTransactionCategories: Category[] = [];
  protected cashAccounts: CashAccount[] = [];
  protected transactionError: string | null = null;
  protected newTransaction!: CashTransaction;

  public pieChartOptionsExpenses: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Expense Transactions',
        fullSize: true,
      },
    },
  };
  public pieChartOptionsIncome: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Income Transactions',
        fullSize: true,
      },
    },
  };
  public pieChartLabelsExpenses: string[] = [];
  public pieChartLabelsIncome: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartDataExpenses: any[] = [];
  public pieChartDataIncome: any[] = [];
  public pieChartType: ChartType = 'pie';

  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartPlugins = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 4,
    plugins: {
      title: {
        display: true,
        text: 'Expenses Over Time',
        fullSize: true,
      },
    },
  };
  public lineChartColors: any[] = [
    {
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  ngOnInit() {
    this.loadCashTransactions();
  }

  protected loadCashTransactions() {
    this.isLoading = true;
    forkJoin({
      categories: this.categoryService.getCategories(),
      accounts: this.cashAccountService.getCashAccounts(),
      transactions: this.cashTransactionService.getTransactions(),
    }).subscribe(({ categories, accounts, transactions }) => {
      this.isLoading = false;
      this.categories = categories.categories;
      this.newTransactionCategories = this.categories;
      this.newTransactionCategories.push({
        name: 'Transfer',
        icon: 'lucideArrowLeftRight',
        type: 'income',
      });
      this.cashAccounts = accounts;
      this.cashTransactions = transactions;
      this._CashTransactions.set(transactions);
      this.resetNewTransaction();
      this.preparePieChartData();
      this.prepareLineChartData();
    });
  }

  protected preparePieChartData() {
    const expenseTransactions = this.cashTransactions.filter(
      (t) => t.category && t.type === 'expense'
    );
    const expenseCategories = this.categories.filter(
      (c) => c.type === 'expense'
    );
    this.pieChartLabelsExpenses = expenseCategories.map((c) => c.name);
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

    const incomeTransactions = this.cashTransactions.filter(
      (t) => t.category && t.type === 'income'
    );
    const incomeCategories = this.categories.filter((c) => c.type === 'income');
    this.pieChartLabelsIncome = incomeCategories.map((c) => c.name);
    const incomeTotals = incomeTransactions.reduce<Record<string, number>>(
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

  protected prepareLineChartData() {
    const expenseTransactions = this.cashTransactions
      .filter((t) => t.type === 'expense' && t.postingDate)
      .sort((a, b) =>
        String(b.postingDate).localeCompare(String(a.postingDate))
      );

    const lineChartData = expenseTransactions.reduce<{
      labels: string[];
      data: number[];
    }>(
      (data, transaction) => {
        const date = formatDate(
          new Date(transaction.postingDate),
          'yyyy-MM-dd',
          'en-US'
        );
        if (data.labels.includes(date)) {
          data.data[data.labels.indexOf(date)] +=
            transaction.amountEquivalent ?? 0;
        } else {
          data.labels.push(date);
          data.data.push(transaction.amountEquivalent ?? 0);
        }
        return data;
      },
      { labels: [], data: [] }
    );
    this.lineChartLabels = lineChartData.labels;
    this.lineChartData = [
      {
        data: lineChartData.data,
        label: 'Transactions',
      },
    ];
  }

  protected updateTransactionCategory(category?: Category) {
    if (this.selectedCashTransaction) {
      this.cashTransactionService
        .updateTransactionCategory(this.selectedCashTransaction, category)
        .subscribe((transaction) => {
          const index = this.cashTransactions.findIndex(
            (t) => t._id === transaction._id
          );
          if (index !== -1) {
            this.cashTransactions[index] = transaction;
            this._CashTransactions.set([
              ...this.cashTransactions.sort((a, b) =>
                String(b.postingDate).localeCompare(String(a.postingDate))
              ),
            ]);
          }
          this.preparePieChartData();
        });
    }
  }

  protected addTransaction(ctx: any) {
    this.cashTransactionService
      .addCashTransaction(this.newTransaction)
      .subscribe({
        next: (transaction) => {
          this.cashTransactions.push(transaction);
          this.resetNewTransaction();
          this._CashTransactions.set([
            ...this.cashTransactions.sort((a, b) =>
              String(b.postingDate).localeCompare(String(a.postingDate))
            ),
          ]);
          ctx.close();
          this.transactionError = null;
          this.preparePieChartData();
          this.prepareLineChartData();
        },
        error: (error) => {
          console.log(error);
          if (error.status === 400) {
            this.transactionError = error.error.message;
          } else {
            this.transactionError =
              error.error.message ||
              'An error occurred. Please try again later.';
          }
        },
      });
  }

  private resetNewTransaction() {
    this.newTransaction = {
      category: undefined,
      isTransfer: true,
      postingDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      beneficiary: '',
      details: '',
      amount: 0,
      cashBank: 'cash',
      type: 'expense',
      account: this.cashAccounts[0],
    };
  }

  protected selectTransaction(transaction: CashTransaction) {
    this.selectedCashTransaction = { ...transaction };
    this.selectedCashTransaction.postingDate = formatDate(
      new Date(this.selectedCashTransaction.postingDate),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  protected saveTransaction(ctx: any) {
    if (this.selectedCashTransaction) {
      this.cashTransactionService
        .updateTransaction(this.selectedCashTransaction)
        .subscribe({
          next: (transaction) => {
            const index = this.cashTransactions.findIndex(
              (t) => t._id === transaction._id
            );
            if (index !== -1) {
              this.cashTransactions[index] = transaction;
              this._CashTransactions.set([
                ...this.cashTransactions.sort((a, b) =>
                  String(b.postingDate).localeCompare(String(a.postingDate))
                ),
              ]);
            }
            ctx.close();
            this.transactionError = null;
            this.preparePieChartData();
            this.prepareLineChartData();
          },
          error: (error) => {
            console.log(error);
            if (error.status === 400) {
              this.transactionError = error.error.message;
            } else {
              this.transactionError =
                error.error.message ||
                'An error occurred. Please try again later.';
            }
          },
        });
    }
  }

  protected deleteTransaction() {
    if (this.selectedCashTransaction && this.selectedCashTransaction._id) {
      this.cashTransactionService
        .deleteCashTransaction(
          this.selectedCashTransaction._id,
          this.selectedCashTransaction.cashBank
        )
        .subscribe(() => {
          this.cashTransactions = this.cashTransactions.filter(
            (t) => t._id !== this.selectedCashTransaction!._id
          );
          this._CashTransactions.set([
            ...this.cashTransactions.sort((a, b) =>
              String(b.postingDate).localeCompare(String(a.postingDate))
            ),
          ]);
        });
      this.preparePieChartData();
      this.prepareLineChartData();
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _transactionsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _brnColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'Category' },
    postingDate: { visible: true, label: 'Posting Date' },
    beneficiary: { visible: true, label: 'Beneficiary' },
    details: { visible: true, label: 'Details' },
    amount: { visible: true, label: 'Amount' },
    currency: { visible: false, label: 'Currency' },
    account: { visible: true, label: 'Account' },
    isTransfer: { visible: false },
    type: { visible: false },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _CashTransactions = signal(this.cashTransactions);
  private readonly _filteredCashTransactions = computed(() => {
    const filter = this._transactionsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._CashTransactions().filter(
        (u) =>
          u.beneficiary.toLowerCase().includes(filter) ||
          u.details.toLowerCase().includes(filter) ||
          (u.category && u.category.name.toLowerCase().includes(filter)) ||
          u.amount.toString().includes(filter) ||
          (u.currency?.toString() ?? '').includes(filter)
      );
    }
    return this._CashTransactions();
  });

  private readonly _dateSort = signal<'ASC' | 'DESC' | null>(null);

  protected readonly _filteredSortedPaginatedCashTransactions = computed(() => {
    const sort = this._dateSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const CashTransactions = this._filteredCashTransactions();
    if (!sort) {
      return CashTransactions.slice(start, end);
    }
    return [...CashTransactions]
      .sort(
        (p1, p2) =>
          String(p1.postingDate).localeCompare(String(p2.postingDate)) *
          (sort === 'ASC' ? 1 : -1)
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<CashTransaction> = (
    _: number,
    p: CashTransaction
  ) => p._id;
  protected readonly _totalElements = computed(
    () => this._filteredCashTransactions().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor(
    private cashTransactionService: CashTransactionService,
    private categoryService: CategoryService,
    private cashAccountService: CashAccountService
  ) {
    effect(() => this._transactionsFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected handleDateSortChange() {
    const sort = this._dateSort();
    if (sort === 'ASC') {
      this._dateSort.set('DESC');
    } else if (sort === 'DESC') {
      this._dateSort.set(null);
    } else {
      this._dateSort.set('ASC');
    }
  }
}
