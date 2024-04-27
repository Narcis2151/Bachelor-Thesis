import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { debounceTime } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';

import CashTransaction from './cash-transaction/cash-transaction.model';
import CashTransactions from './cash-transaction-list';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category/category.model';
import { categories } from '../../categories/category-list/categories-list';

@Component({
  selector: 'app-cash-transactions-list',
  templateUrl: './cash-transactions-list.component.html',
  styleUrl: './cash-transactions-list.component.scss',
})
export class CashTransactionsListComponent {
  protected cashTransactions: CashTransaction[] = CashTransactions;
  protected selectedCashTransaction!: CashTransaction;
  protected readonly currencies = Object.values(Currency);
  protected categories: Category[] = categories;
  protected newTransaction: CashTransaction = {
    id: '',
    category: categories[0],
    postingDate: new Date(),
    beneficiary: '',
    details: '',
    amount: 0,
    type: 'expense',
    currency: Currency.RON,
    status: 'success',
  };

  protected addTransaction() {
    this.newTransaction.id = this.generateUniqueId();
    this.newTransaction.postingDate = new Date(this.newTransaction.postingDate);
    this.cashTransactions.push({ ...this.newTransaction });
    this._CashTransactions.set([...this.cashTransactions]);
    console.log('New transaction added:', this.newTransaction)
    this.resetNewTransaction();
  }

  private resetNewTransaction() {
    this.newTransaction = {
      id: '',
      category: categories[0],
      postingDate: new Date(),
      beneficiary: '',
      details: '',
      amount: 0,
      type: 'income',
      currency: Currency.RON,
      status: 'success',
    };
  }

  private generateUniqueId(): string {
    return `id-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected selectTransaction(transaction: CashTransaction) {
    this.selectedCashTransaction = { ...transaction };
  }
  
  protected saveTransaction() {
    if (this.selectedCashTransaction) {
      const index = this.cashTransactions.findIndex((t) => t.id === this.selectedCashTransaction!.id);
      if (index > -1) {
        this.cashTransactions[index] = { ...this.selectedCashTransaction }; 
        this._CashTransactions.set([...this.cashTransactions]);
      }
    }
  }

  protected deleteTransaction() {
    if (this.selectedCashTransaction) {
      const index = this.cashTransactions.findIndex((t) => t.id === this.selectedCashTransaction!.id);
      if (index > -1) {
        this.cashTransactions.splice(index, 1);
        this._CashTransactions.set([...this.cashTransactions]);
      }
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
          u.currency.toString().includes(filter)
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
  ) => p.id;
  protected readonly _totalElements = computed(
    () => this._filteredCashTransactions().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
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
