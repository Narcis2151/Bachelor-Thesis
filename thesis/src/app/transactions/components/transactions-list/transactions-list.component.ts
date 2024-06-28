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

import Category from '../../../categories/components/category-list/category.model';
import Currency from '../../../../../shared/account-currency';
import CashAccount from '../../../accounts/models/account.model';
import Transaction from '../../models/transaction.model';
import { CategoriesService } from '../../../categories/services/categories.service';
import { AccountsService } from '../../../accounts/services/accounts.service';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsListComponent {
  isLoading = false;
  cashTransactions: Transaction[] = [];
  partnerTransactions: Transaction[] = [];
  selectedCashTransaction!: Transaction;
  currencies = Object.values(Currency);
  categories: Category[] = [];
  newTransactionCategories: Category[] = [];
  cashAccounts: CashAccount[] = [];
  transactionError: string | null = null;
  newTransaction!: Transaction;

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

  loadCashTransactions() {
    this.isLoading = true;
    forkJoin({
      categories: this.categoriesService.getCategories(),
      accounts: this.accountsService.getAccounts(),
      transactions: this.transactionsService.getTransactions(),
    }).subscribe(({categories, accounts, transactions }) => {
      this.categories = categories;
      this.newTransactionCategories = this.categories;
      this.newTransactionCategories.push({
        name: 'Transfer',
        icon: 'lucideArrowLeftRight',
      });
      this.cashAccounts = accounts.filter((a) => a.cashBank === 'cash');
      this.cashTransactions = transactions;
      this.isLoading = false;
      this._CashTransactions.set(
        transactions.sort((a, b) =>
          String(b.postingDate).localeCompare(String(a.postingDate))
        )
      );
      this.resetNewTransaction();
      this.preparePieChartData();
      this.prepareLineChartData();
    });
  }

  preparePieChartData() {
    const expenseCategories = this.categories.filter(
      (c) => c.type === 'expense'
    );
    this.pieChartLabelsExpenses = expenseCategories.map((c) => c.name);
    const expenseTotals = expenseCategories.reduce<Record<string, number>>(
      (trn, category) => {
        trn[category.name] = this.cashTransactions
          .filter(
            (t) =>
              t.category &&
              t.category._id === category._id &&
              t.type === 'expense'
          )
          .reduce((total, t) => total + (t.amountEquivalent ?? 0), 0);
        return trn;
      },
      {}
    );

    this.pieChartDataExpenses = [
      {
        data: this.pieChartLabelsExpenses
          .filter((label) => expenseTotals[label] !== 0)
          .map((label) => expenseTotals[label] ?? 0),
      },
    ];
    this.pieChartLabelsExpenses = this.pieChartLabelsExpenses.filter(
      (label) => expenseTotals[label] !== 0
    );

    const incomeCategories = this.categories.filter((c) => c.type === 'income');
    this.pieChartLabelsIncome = incomeCategories.map((c) => c.name);
    const incomeTotals = incomeCategories.reduce<Record<string, number>>(
      (trn, category) => {
        trn[category.name] = this.cashTransactions
          .filter(
            (t) =>
              t.category &&
              t.category._id === category._id &&
              t.type === 'income'
          )
          .reduce((total, t) => total + (t.amountEquivalent ?? 0), 0);
        return trn;
      },
      {}
    );

    this.pieChartDataIncome = [
      {
        data: this.pieChartLabelsIncome
          .filter((label) => incomeTotals[label] !== 0)
          .map((label) => incomeTotals[label] ?? 0),
      },
    ];
    this.pieChartLabelsIncome = this.pieChartLabelsIncome.filter(
      (label) => incomeTotals[label] !== 0
    );
  }

  prepareLineChartData() {
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
    this.lineChartLabels = lineChartData.labels.reverse();
    this.lineChartData = [
      {
        data: lineChartData.data.reverse(),
        label: 'Transactions',
      },
    ].reverse();
  }

  updateTransactionCategory(category?: Category) {
    if (this.selectedCashTransaction) {
      this.transactionsService
        .updateTransactionCategory(this.selectedCashTransaction, category)
        .subscribe((updateTransaction) => {
          const index = this.cashTransactions.findIndex(
            (t) => t._id === updateTransaction._id
          );
          if (index !== -1) {
            this.cashTransactions[index] = updateTransaction;
            this._CashTransactions.set([
              ...this.cashTransactions.sort((a, b) =>
                String(b.postingDate).localeCompare(String(a.postingDate))
              ),
            ]);
          }
          this.categoriesService.getCategories().subscribe((categories) => {
            this.categories = categories;
            setTimeout(() => {
              this.preparePieChartData();
            }, 0);
          });
        });
    }
  }

  addTransaction(ctx: any) {
    this.transactionsService.addCashTransaction(this.newTransaction).subscribe({
      next: (transaction) => {
        this.cashTransactions.push(transaction);
        this.resetNewTransaction();
        this._CashTransactions.set([
          ...this.cashTransactions.sort((a, b) =>
            String(b.postingDate).localeCompare(String(a.postingDate))
          ),
        ]);
        this.prepareLineChartData();
        ctx.close();
        this.transactionError = null;
        this.categoriesService.getCategories().subscribe((categories) => {
          this.categories = categories;
          setTimeout(() => {
            this.preparePieChartData();
          }, 0);
        });
      },
      error: (error) => {
        console.log(error);
        if (error.status === 400) {
          this.transactionError = error.error.message;
        } else {
          this.transactionError =
            error.error.message || 'An error occurred. Please try again later.';
        }
      },
    });
  }

  private resetNewTransaction() {
    this.newTransaction = {
      category: this.categories[0],
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

  selectTransaction(transaction: Transaction) {
    this.selectedCashTransaction = { ...transaction };
    this.selectedCashTransaction.postingDate = formatDate(
      new Date(this.selectedCashTransaction.postingDate),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  saveTransaction(ctx: any) {
    if (this.selectedCashTransaction) {
      this.transactionsService
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
            this.prepareLineChartData();
            ctx.close();
            this.transactionError = null;
            this.categoriesService.getCategories().subscribe((categories) => {
              this.categories = categories;
              setTimeout(() => {
                this.preparePieChartData();
              }, 0);
            });
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

  deleteTransaction() {
    if (this.selectedCashTransaction && this.selectedCashTransaction._id) {
      this.transactionsService
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
          this.prepareLineChartData();
          this.categoriesService.getCategories().subscribe((categories) => {
            this.categories = categories;
            setTimeout(() => {
              this.preparePieChartData();
            }, 0);
          });
        });
    }
  }

  readonly _rawFilterInput = signal('');
  readonly _transactionsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  readonly _availablePageSizes = [5, 10, 20, 10000];
  readonly _pageSize = signal(this._availablePageSizes[0]);

  readonly _brnColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'Category' },
    postingDate: { visible: true, label: 'Posting Date' },
    details: { visible: true, label: 'Details' },
    amount: { visible: true, label: 'Amount' },
    currency: { visible: false, label: 'Currency' },
    account: { visible: true, label: 'Account' },
    cashBank: { visible: false },
    isTransfer: { visible: false },
    type: { visible: false },
  });
  readonly _allDisplayedColumns = computed(() => [
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

  readonly _filteredSortedPaginatedCashTransactions = computed(() => {
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

  readonly _trackBy: TrackByFunction<Transaction> = (
    _: number,
    p: Transaction
  ) => p._id;
  readonly _totalElements = computed(
    () => this._filteredCashTransactions().length
  );
  readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService,
  ) {
    effect(() => this._transactionsFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  handleDateSortChange() {
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
