import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { debounceTime, forkJoin } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';

import CashTransaction from './cash-transaction.model';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
import { CashTransactionService } from '../cash-transactions.service';
import { CategoryService } from '../../categories/category.service';
import { CashAccountService } from '../../accounts/cash-account.service';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';

@Component({
  selector: 'app-cash-transactions-list',
  templateUrl: './cash-transactions-list.component.html',
  styleUrl: './cash-transactions-list.component.scss',
})
export class CashTransactionsListComponent {
  isLoading = false;
  protected cashTransactions: CashTransaction[] = [];
  protected selectedCashTransaction!: CashTransaction;
  protected readonly currencies = Object.values(Currency);
  protected categories: Category[] = [];
  protected cashAccounts: CashAccount[] = [];
  protected newTransaction!: CashTransaction;

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
      this.categories = categories.categories;
      this.cashAccounts = accounts;
      this.cashTransactions = transactions;
      this._CashTransactions.set(transactions);
      this.resetNewTransaction();
      this.isLoading = false;
    });
  }

  protected updateTransactionCategory(category: Category) {
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
              ...this.cashTransactions.sort(
                (a, b) => Number(b.postingDate) - Number(a.postingDate)
              ),
            ]);
          }
        });
    }
  }

  protected addTransaction() {
    this.cashTransactionService
      .addCashTransaction(this.newTransaction)
      .subscribe((transaction) => {
        this.cashTransactions.push(transaction);
        this.resetNewTransaction();
        this._CashTransactions.set([
          ...this.cashTransactions.sort(
            (a, b) => Number(b.postingDate) - Number(a.postingDate)
          ),
        ]);
      });
  }

  private resetNewTransaction() {
    this.newTransaction = {
      category: this.categories[0],
      postingDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      beneficiary: '',
      details: '',
      amount: 0,
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

  protected saveTransaction() {
    if (this.selectedCashTransaction) {
      this.cashTransactionService
        .updateTransaction(this.selectedCashTransaction)
        .subscribe((transaction) => {
          const index = this.cashTransactions.findIndex(
            (t) => t._id === transaction._id
          );
          if (index !== -1) {
            this.cashTransactions[index] = transaction;
            this._CashTransactions.set([
              ...this.cashTransactions.sort(
                (a, b) => Number(b.postingDate) - Number(a.postingDate)
              ),
            ]);
          }
        });
    }
  }

  protected deleteTransaction() {
    if (this.selectedCashTransaction && this.selectedCashTransaction._id) {
      this.cashTransactionService
        .deleteCashTransaction(this.selectedCashTransaction._id)
        .subscribe(() => {
          this.cashTransactions = this.cashTransactions.filter(
            (t) => t._id !== this.selectedCashTransaction!._id
          );
          this._CashTransactions.set([
            ...this.cashTransactions.sort(
              (a, b) => Number(b.postingDate) - Number(a.postingDate)
            ),
          ]);
        });
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
          u.category.name.toLowerCase().includes(filter) ||
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
          (sort === 'ASC' ? 1 : -1) *
          (Number(p1.postingDate) - Number(p2.postingDate))
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
