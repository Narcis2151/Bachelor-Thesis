import {
  Component,
  OnInit,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, forkJoin } from 'rxjs';
import {
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';

import Budget from '../../models/budget.model';
import Currency from '../../../../../shared/account-currency';
import Category from '../../../categories/components/category-list/category.model';
import { BudgetsService } from '../../services/budgets.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent implements OnInit {
  protected isLoading = false;
  protected totalBudgetedAmount = 0;
  protected budgets: Budget[] = [];
  protected allBudgets: Budget[] = [];
  protected selectedBudget!: Budget;
  protected budgetError: string | null = null;
  protected newBudget!: Budget;
  protected currencies = Object.values(Currency);
  protected categories: Category[] = [];
  protected availableCategories: Category[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Budgeted amount',
        fullSize: true,
      },
    },
  };
  public pieChartLabels: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartData: any[] = [];
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 4,
    plugins: {
      title: {
        display: true,
        text: 'Spent amount',
        fullSize: true,
      },
    },
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
    forkJoin([
      this.budgetsService.getBudgets(),
      this.categoryService.getCategories(),
    ]).subscribe(([budgetsResponse, categories]) => {
      this.budgets = budgetsResponse.budgets.filter((b) => b.active);
      this.allBudgets = budgetsResponse.budgets;
      this.totalBudgetedAmount = budgetsResponse.totalBudgetedAmount;
      this.categories = categories;
      this._Budgets.set(
        this.budgets.sort((a, b) =>
          String(a.resetDate).localeCompare(String(b.resetDate))
        )
      );
      this.availableCategories = this.categories.filter(
        (c) =>
          !this.budgets.find((b) => b.category._id === c._id) &&
          c.type === 'expense'
      );
      this.isLoading = false;
      this.resetNewBudget();
      this.preparePieChartData();
      this.prepareBarChartData();
    });
  }

  protected preparePieChartData() {
    const budgetedCategories = this.categories.filter((c) =>
      this.budgets.find((b) => b.category._id === c._id)
    );
    this.pieChartLabels = budgetedCategories.map((c) => c.name);
    this.pieChartLabels.push('Unbudgeted');

    const budgetedTotals = this.budgets.reduce<Record<string, number>>(
      (bgt, budget) => {
        const budgetedAmount = budget.amountAvailable / budget.exchangeRate!;
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

    const last3Months = Array.from({ length: 3 }, (_, i) => {
      const month = currentMonth - i - 1;
      const year = month < 0 ? currentYear - 1 : currentYear;
      return { month: (month + 12) % 12, year };
    }).reverse(); // Reverse to get chronological order

    this.barChartLabels = last3Months.map(
      ({ month, year }) => `${month + 1}/${year}`
    );

    const budgetedAmounts = last3Months.map(({ month, year }) => {
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();
      const monthBudgets = this.allBudgets.filter(
        (budget) => budget.startDate >= startDate && budget.startDate <= endDate
      );
      return monthBudgets.reduce(
        (sum, budget) => sum + budget.amountAvailable / budget.exchangeRate!,
        0
      );
    });

    const spentAmounts = last3Months.map(({ month, year }) => {
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();
      const monthBudgets = this.allBudgets.filter(
        (budget) => budget.startDate >= startDate && budget.startDate <= endDate
      );
      return monthBudgets.reduce(
        (sum, budget) => sum + (budget.userSpentAmount! + budget.partnerSpentAmount!) / budget.exchangeRate!,
        0
      );
    });

    this.barChartData = [
      {
        data: spentAmounts,
        label: 'Spent Amount',
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // light red
        stack: 'Stack 0',
      },
      {
        data: budgetedAmounts.map(
          (total, index) => total - spentAmounts[index]
        ),
        label: 'Remaining Amount',
        backgroundColor: 'rgba(0, 123, 255, 0.5)', // light blue
        stack: 'Stack 0',
      },
    ];

    this.barChartLabels.reverse();
    this.barChartData.forEach((dataset) => dataset.data.reverse());

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };
  }

  protected getAvailableCategories() {
    this.budgetsService.getAvailableCategories().subscribe((categories) => {
      this.availableCategories = categories;
    });
  }

  protected addBudget(ctx: any) {
    this.budgetsService.addBudget(this.newBudget).subscribe({
      next: (budget) => {
        this.budgets.push(budget);
        this._Budgets.set([
          ...this.budgets.sort((a, b) =>
            String(a.resetDate).localeCompare(String(b.resetDate))
          ),
        ]);
        this.allBudgets.push(budget);
        this.budgetError = null;
        ctx.close();
        this.resetNewBudget();
        this.getAvailableCategories();
        this.preparePieChartData();
        this.prepareBarChartData();
      },
      error: (error) => {
        console.log(error);
        if (error.status === 400) {
          this.budgetError = error.error.message;
        } else {
          this.budgetError =
            error.error.message || 'An error occurred. Please try again later.';
        }
      },
    });
  }

  protected resetNewBudget() {
    this.newBudget = {
      category: this.availableCategories[0],
      startDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      amountAvailable: 0,
      currency: Currency.RON,
      userSpentAmount: 0,
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

  protected saveBudget(ctx: any) {
    if (this.selectedBudget && this.selectedBudget._id) {
      this.budgetsService.updateBudget(this.selectedBudget).subscribe({
        next: (budget) => {
          const index = this.budgets.findIndex((t) => t._id === budget._id);
          if (index !== -1) {
            this.budgets[index] = budget;
            this._Budgets.set(
              [...this.budgets].sort((a, b) =>
                String(a.resetDate).localeCompare(String(b.resetDate))
              )
            );
            ctx.close();
            this.budgetError = null;
            this.preparePieChartData();
          }
          const allBudgetsIndex = this.allBudgets.findIndex(
            (t) => t._id === budget._id
          );
          if (allBudgetsIndex !== -1) {
            this.allBudgets[allBudgetsIndex] = budget;
            this.prepareBarChartData();
          }
        },
        error: (error) => {
          console.log(error);
          if (error.status === 400) {
            this.budgetError = error.error.message;
          } else {
            this.budgetError =
              error.error.message ||
              'An error occurred. Please try again later.';
          }
        },
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
            this.preparePieChartData();
          }
          const allBudgetsIndex = this.allBudgets.findIndex(
            (t) => t._id === this.selectedBudget._id
          );
          if (allBudgetsIndex !== -1) {
            this.allBudgets.splice(allBudgetsIndex, 1);
            this.prepareBarChartData();
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
  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _brnColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    resetDate: { visible: true, label: 'resetDate' },
    progress: { visible: true, label: 'progress' },
    amountAvailable: { visible: true, label: 'amountAvailable' },
    userSpentAmount: { visible: false, label: 'amountSpent' },
    partnerSpentAmount: { visible: false, label: 'partnerSpentAmount' },
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
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const Budgets = this._filteredBudgets();
    if (!sort) {
      return Budgets.slice(start, end);
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
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor(
    private budgetsService: BudgetsService,
    private categoryService: CategoriesService
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
