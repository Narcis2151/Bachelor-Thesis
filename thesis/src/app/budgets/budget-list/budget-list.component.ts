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

import CashTransaction from '../../transactions/cash-transactions-list/cash-transaction/cash-transaction.model';
import CashTransactions from '../../transactions/cash-transactions-list/cash-transaction-list';


@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent {
  protected cashTransactions: CashTransaction[] = CashTransactions;

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
