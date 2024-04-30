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
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';

import BudgetData from './budget-list';
import Budget from './budget/budget.model';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category/category.model';
import { categories } from '../../categories/category-list/categories-list';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent {
  protected budgets: Budget[] = BudgetData.filter((b) => b.active);
  protected selectedBudget!: Budget;
  protected readonly currencies = Object.values(Currency);
  protected availableCategories: Category[] = categories.filter(
    (c) => !this.budgets.some((b) => b.category.id === c.id)
  );
  protected newBudget: Budget = {
    id: '',
    category: categories[0],
    startDate: new Date(),
    progress: 0,
    amountAvailable: 0,
    amountSpent: 0,
    currency: Currency.RON,
    active: true,
  };

  protected addBudget() {
    this.newBudget.id = this.generateUniqueId();
    this.newBudget.startDate = new Date(this.newBudget.startDate);
    const oneMonthLater = new Date(this.newBudget.startDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    this.newBudget.resetDate = oneMonthLater;
    this.budgets.push({ ...this.newBudget });
    this._Budgets.set([...this.budgets]);
    this.resetNewBudget();
  }

  protected resetNewBudget() {
    this.newBudget = {
      id: '',
      category: categories[0],
      startDate: new Date(),
      resetDate: new Date(),
      progress: 0,
      amountAvailable: 0,
      amountSpent: 0,
      currency: Currency.RON,
      active: true,
    };
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected selectBudget(budget: Budget) {
    this.selectedBudget = { ...budget };
  }

  protected saveBudget() {
    if (this.selectedBudget) {
      const index = this.budgets.findIndex(
        (t) => t.id === this.selectedBudget!.id
      );
      if (index > -1) {
        this.budgets[index] = { ...this.selectedBudget };
        this._Budgets.set([...this.budgets]);
      }
    }
  }

  protected deleteBudget() {
    if (this.selectedBudget) {
      const index = this.budgets.findIndex(
        (t) => t.id === this.selectedBudget!.id
      );
      if (index > -1) {
        this.budgets.splice(index, 1);
        this._Budgets.set([...this.budgets]);
      }
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _budgetsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );
  protected readonly _pageSize = signal(10000);

  protected readonly _brnColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    resetDate: { visible: true, label: 'resetDate' },
    progress: { visible: true, label: 'progress' },
    amountAvailable: { visible: true, label: 'amountAvailable' },
    amountSpent: { visible: false, label: 'amountSpent' },
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
          u.currency.toString().includes(filter)
      );
    }
    return this._Budgets();
  });
  private readonly _dateSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedBudgets = computed(() => {
    const sort = this._dateSort();
    const Budgets = this._filteredBudgets();
    if (!sort) {
      return Budgets.slice(0, this._pageSize());
    }
    return [...Budgets]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) *
          (Number(p1.resetDate) - Number(p2.resetDate))
      )
      .slice(0, this._pageSize());
  });

  protected readonly _trackBy: TrackByFunction<Budget> = (
    _: number,
    p: Budget
  ) => p.id;
  protected readonly _totalElements = computed(
    () => this._filteredBudgets().length
  );

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
