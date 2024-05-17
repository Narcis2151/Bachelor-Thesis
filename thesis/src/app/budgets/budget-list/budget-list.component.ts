import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, forkJoin } from 'rxjs';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';

import Budget from './budget.model';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
import { BudgetsService } from '../budgets.service';
import { CategoryService } from '../../categories/category.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent {
  protected isLoading = false;
  protected totalBudgetedAmount = 0;
  protected budgets: Budget[] = [];
  protected selectedBudget!: Budget;
  protected newBudget!: Budget;
  protected currencies = Object.values(Currency);
  protected categories: Category[] = [];
  protected availableCategories: Category[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartData: any[] = [];
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: any[] = [];
  public barChartType: ChartType = 'bar';

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
      this.isLoading = false;
      this.categories = categories.categories;
      this.availableCategories = availableCategories;
      this.budgets = budgets.budgets;
      this.totalBudgetedAmount = budgets.totalBudgetedAmount;
      this._Budgets.set(this.budgets);
      this.resetNewBudget();
      this.preparePieChartData();
      this.prepareBarChartData();
    });
  }

  protected preparePieChartData() {
    const activeBudgets = this.budgets.filter((b) => b.active);
    const budgetedCategories = this.categories.filter((c) =>
      activeBudgets.find((b) => b.category._id === c._id)
    );
    this.pieChartLabels = budgetedCategories.map((c) => c.name);
    this.pieChartLabels.push('Unbudgeted');
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

    this.pieChartLabels = this.pieChartLabels.filter(
      (label) => budgetedTotals[label]
    );
    this.pieChartData = [
      {
        data: this.pieChartLabels.map((label) => budgetedTotals[label] ?? 0),
      },
    ];
  }

  protected prepareBarChartData() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const month = currentMonth - i + 1;
      const year = month < 0 ? currentYear - 1 : currentYear;
      return { month, year };
    });
    console.log(last6Months);
    this.barChartLabels = last6Months.map(
      ({ month, year }) => `${month + 1}/${year}`
    );

    const spentAmounts = last6Months.map(({ month, year }) => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      const monthBudgets = this.budgets.filter(
        (budget) =>
          new Date(budget.resetDate) >= startDate &&
          new Date(budget.resetDate) <= endDate
      );
      return monthBudgets.reduce(
        (sum, budget) =>
          sum + budget.userSpentAmount + budget.partnerSpentAmount,
        0
      );
    });

    this.barChartData = [
      {
        data: spentAmounts,
        label: 'Spent amount',
      },
    ];

    this.barChartLabels.reverse();
    this.barChartData[0].data.reverse();
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
      this.preparePieChartData();
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
            this.preparePieChartData();
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
              ...this.budgets.sort((a, b) =>
                String(a.resetDate).localeCompare(String(b.resetDate))
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
          u.active &&
          (u.category.name.toLowerCase().includes(filter) ||
            u.amountAvailable.toString().includes(filter) ||
            u.currency.toString().includes(filter))
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
