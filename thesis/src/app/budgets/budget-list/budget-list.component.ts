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

import BudgetData from './budget-list';
import Budget from './budget/budget.model';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent {
  protected budgets: Budget[] = BudgetData;

  protected readonly _rawFilterInput = signal('');
  protected readonly _budgetsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _brnColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    resetDate: { visible: true, label: 'resetDate' },
    progress: { visible: true, label: 'progress' },
    amountAvailable: { visible: true, label: 'amountAvailable' },
    amountSpent: { visible: true, label: 'amountSpent' },
    isShared: { visible: true, label: 'isShared' },
    currency: { visible: false },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _Budgets = signal(this.budgets);
  private readonly _filteredBudgets = computed(() => {
    const filter = this._budgetsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._Budgets().filter(
        (u) =>
          u.category.name.toLowerCase().includes(filter) ||
          u.amountAvailable.toString().includes(filter) ||
          u.amountSpent.toString().includes(filter) ||
          u.currency.toString().includes(filter)
      );
    }
    return this._Budgets();
  });
  private readonly _dateSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedBudgets = computed(() => {
    const sort = this._dateSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const Budgets = this._filteredBudgets();
    if (!sort) {
      return Budgets.slice(start, end);
    }
    return [...Budgets]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) *
          (Number(p1.resetDate) - Number(p2.resetDate))
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<Budget> = (
    _: number,
    p: Budget
  ) => p.id;
  protected readonly _totalElements = computed(
    () => this._filteredBudgets().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    effect(() => this._budgetsFilter.set(this._debouncedFilter() ?? ''), {
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
