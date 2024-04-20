import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, map } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';

import Currency from '../../../../shared/account-currency';

export type CashTransaction = {
  id: string;
  amount: number;
  currency?: Currency;
  status: 'pending' | 'processing' | 'success' | 'failed';
  beneficiary: string;
};

const CashTransaction_DATA: CashTransaction[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    beneficiary: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    beneficiary: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    beneficiary: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    beneficiary: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    beneficiary: 'carmella@hotmail.com',
  },
  {
    id: 'p0r8sd2f',
    amount: 123,
    status: 'failed',
    beneficiary: 'john.doe@example.com',
  },
  {
    id: '8uyv3n1x',
    amount: 589,
    status: 'processing',
    beneficiary: 'emma.smith@gmail.com',
  },
  {
    id: '2zqo6ptr',
    amount: 456,
    status: 'success',
    beneficiary: 'jackson78@hotmail.com',
  },
  {
    id: 'l7we9a3m',
    amount: 632,
    status: 'success',
    beneficiary: 'grace_22@yahoo.com',
  },
  {
    id: 'o9p2v3qk',
    amount: 987,
    status: 'failed',
    beneficiary: 'robert.adams@gmail.com',
  },
  {
    id: 'q1o8r7mz',
    amount: 321,
    status: 'processing',
    beneficiary: 'alexander34@gmail.com',
  },
  {
    id: 'i5n3s0tv',
    amount: 555,
    status: 'failed',
    beneficiary: 'olivia_morris@hotmail.com',
  },
  {
    id: '3xr7s2nl',
    amount: 789,
    status: 'success',
    beneficiary: 'michael_cole@yahoo.com',
  },
  {
    id: 'u9v2p1qy',
    amount: 234,
    status: 'success',
    beneficiary: 'lily.jones@gmail.com',
  },
  {
    id: 'b4q0e1cp',
    amount: 876,
    status: 'failed',
    beneficiary: 'ryan_14@hotmail.com',
  },
  {
    id: 's1z8m7op',
    amount: 456,
    status: 'success',
    beneficiary: 'sophia.green@gmail.com',
  },
  {
    id: 'n5a3v0lt',
    amount: 987,
    status: 'failed',
    beneficiary: 'david.miller@yahoo.com',
  },
  {
    id: '2qr7v9sm',
    amount: 654,
    status: 'processing',
    beneficiary: 'emma_jones@hotmail.com',
  },
  {
    id: 'y9b2h8qq',
    amount: 789,
    status: 'success',
    beneficiary: 'jacob_89@gmail.com',
  },
  {
    id: 'c4a0r1xp',
    amount: 123,
    status: 'failed',
    beneficiary: 'samantha.richards@yahoo.com',
  },
];

@Component({
  selector: 'app-cash-transactions-list',
  templateUrl: './cash-transactions-list.component.html',
  styleUrl: './cash-transactions-list.component.scss',
})
export class CashTransactionsListComponent {
  protected readonly _rawFilterInput = signal('');
  protected readonly _transactionsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<CashTransaction>(true);
  protected readonly _isCashTransactionSelected = (CashTransaction: CashTransaction) =>
    this._selectionModel.isSelected(CashTransaction);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map((change) => change.source.selected)),
    {
      initialValue: [],
    }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    status: { visible: true, label: 'Status' },
    beneficiary: { visible: true, label: 'beneficiary' },
    amount: { visible: true, label: 'Amount ($)' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _CashTransactions = signal(CashTransaction_DATA);
  private readonly _filteredCashTransactions = computed(() => {
    const beneficiaryFilter = this._transactionsFilter()?.trim()?.toLowerCase();
    if (beneficiaryFilter && beneficiaryFilter.length > 0) {
      return this._CashTransactions().filter((u) =>
        u.beneficiary.toLowerCase().includes(beneficiaryFilter)
      );
    }
    return this._CashTransactions();
  });
  private readonly _beneficiarySort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedCashTransactions = computed(() => {
    const sort = this._beneficiarySort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const CashTransactions = this._filteredCashTransactions();
    if (!sort) {
      return CashTransactions.slice(start, end);
    }
    return [...CashTransactions]
      .sort(
        (p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.beneficiary.localeCompare(p2.beneficiary)
      )
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedCashTransactionsSelected = computed(() =>
    this._filteredSortedPaginatedCashTransactions().every((CashTransaction) =>
      this._selected().includes(CashTransaction)
    )
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate =
      this._allFilteredPaginatedCashTransactionsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
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
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
    effect(() => this._transactionsFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected toggleCashTransaction(CashTransaction: CashTransaction) {
    this._selectionModel.toggle(CashTransaction);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedCashTransactions());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedCashTransactions());
    }
  }

  protected handleBeneficiarySortChange() {
    const sort = this._beneficiarySort();
    if (sort === 'ASC') {
      this._beneficiarySort.set('DESC');
    } else if (sort === 'DESC') {
      this._beneficiarySort.set(null);
    } else {
      this._beneficiarySort.set('ASC');
    }
  }
}
