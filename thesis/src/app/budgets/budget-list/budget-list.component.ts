import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { debounceTime, forkJoin } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';

import Budget from './budget.model';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
import categories from '../../categories/category-list/categories-list';
import { BudgetsService } from '../budgets.service';
import { CategoryService } from '../../categories/category.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent {
  protected isLoading = false;
  protected budgets: Budget[] = [];
  protected selectedBudget!: Budget;
  protected newBudget!: Budget;
  protected currencies = Object.values(Currency);
  protected categories: Category[] = [];
  protected availableCategories: Category[] = [];

  ngOnInit() {
    this.loadBudgets();
  }

  protected loadBudgets() {
    this.isLoading = true;
    forkJoin({
      categories: this.categoryService.getCategories(),
      availableCategories: this.budgetsService.getAvailableCategories(),
      budgets: this.budgetsService.getBudgets(),
    }).subscribe(({ categories, availableCategories, budgets }) => {
      this.categories = categories.categories;
      this.availableCategories = availableCategories;
      this.budgets = budgets;
      this._Budgets.set(budgets);
      this.resetNewBudget();
      this.isLoading = false;
    });
  }

  protected getAvailableCategories() {
    this.budgetsService.getAvailableCategories().subscribe((categories) => {
      this.availableCategories = categories;
    });
  }

  protected addBudget() {
    this.budgetsService.addBudget(this.newBudget).subscribe((budget) => {
      this.budgets.push(budget);
      this._Budgets.set([
        ...this.budgets.sort((a, b) =>
          String(a.resetDate).localeCompare(String(b.resetDate))
        ),
      ]);
      this.resetNewBudget();
      this.getAvailableCategories();
    });
  }

  protected resetNewBudget() {
    this.newBudget = {
      category: this.availableCategories[0],
      startDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      amountAvailable: 0,
      currency: Currency.RON,
      userSpentAmount: 0,
      partnerSpentAmount: 0,
      resetDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };
  }

  protected selectBudget(budget: Budget) {
    this.selectedBudget = { ...budget };
    this.selectedBudget.startDate = formatDate(
      new Date(budget.startDate),
      'yyyy-MM-dd',
      'en-US'
    );
    this.selectedBudget.resetDate = formatDate(
      new Date(budget.resetDate),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  protected saveBudget() {
    if (this.selectedBudget && this.selectedBudget._id) {
      this.budgetsService
        .updateBudget(this.selectedBudget)
        .subscribe((budget) => {
          const index = this.budgets.findIndex((t) => t._id === budget._id);
          if (index !== -1) {
            this.budgets[index] = budget;
            this._Budgets.set([...this.budgets]);
          }
        });
    }
  }

  protected deleteBudget() {
    if (this.selectedBudget && this.selectedBudget._id) {
      this.budgetsService
        .deleteBudget(this.selectedBudget._id)
        .subscribe(() => {
          const index = this.budgets.findIndex(
            (t) => t._id === this.selectedBudget._id
          );
          if (index > -1) {
            this.budgets.splice(index, 1);
            this._Budgets.set([
              ...this.budgets.sort(
                (a, b) => String(a.resetDate).localeCompare(String(b.resetDate))
              ),
            ]);
          }
        });
      this.getAvailableCategories();
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
    userSpentAmount: { visible: false, label: 'amountSpent' },
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
          String(p1.resetDate).localeCompare(String(p2.resetDate)) *
          (sort === 'ASC' ? 1 : -1)
      )
      .slice(0, this._pageSize());
  });

  protected readonly _trackBy: TrackByFunction<Budget> = (
    _: number,
    p: Budget
  ) => p._id;
  protected readonly _totalElements = computed(
    () => this._filteredBudgets().length
  );

  constructor(
    private budgetsService: BudgetsService,
    private categoryService: CategoryService
  ) {
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
