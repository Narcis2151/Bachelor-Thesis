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

import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';
import CashFuturePayment from './cash-future-payment-model';
import CashRecurrentPayment from './cash-recurrent-payment-model';
import { CashPaymentsService } from '../cash-payments.service';
import { CategoryService } from '../../categories/category.service';
import { CashAccountService } from '../../accounts/cash-account.service';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss',
})
export class PaymentsListComponent {
  protected isLoading = false;
  protected cashFuturePayments: CashFuturePayment[] = [];
  protected cashRecurrentPayments: CashRecurrentPayment[] = [];
  protected selectedCashFuturePayment!: CashFuturePayment;
  protected selectedCashRecurrentPayment!: CashRecurrentPayment;
  protected currencies = Object.values(Currency);
  protected categories: Category[] = [];
  protected cashAccounts: CashAccount[] = [];
  protected newCashFuturePayment: CashFuturePayment = {
    beneficiary: '',
    details: '',
    amount: 0,
    currency: Currency.RON,
    postingDate: new Date(),
    account: this.cashAccounts[0],
    category: this.categories[0],
  };
  protected newCashRecurrentPayment: CashRecurrentPayment = {
    beneficiary: '',
    details: '',
    amount: 0,
    currency: Currency.RON,
    recurrence: 'monthly',
    recurrenceStart: new Date(),
    recurrenceEnd: new Date(),
    account: this.cashAccounts[0],
    category: this.categories[0],
  };

  ngOnInit() {
    this.fetchPaymentCategories();
    this.loadPayments();
  }

  protected fetchPaymentCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.categories;
      },
    });
  }

  protected loadPayments() {
    this.isLoading = true;
    forkJoin({
      categories: this.categoriesService.getCategories(),
      accounts: this.cashAccountsService.getCashAccounts(),
      payments: this.cashPaymentsService.getPayments(),
    }).subscribe(({ categories, accounts, payments }) => {
      this.categories = categories.categories;
      this.cashAccounts = accounts;
      this.cashFuturePayments = payments.futurePayments;
      this.cashRecurrentPayments = payments.recurrentPayments;
      this._CashFuturePayments.set([...this.cashFuturePayments]);
      this._CashRecurrentPayments.set([...this.cashRecurrentPayments]);
      this.resetNewCashFuturePayment();
      this.resetNewCashRecurrentPayment();
      this.isLoading = false;
    });
  }

  protected updateCashFuturePaymentCategory(category: Category) {
    this.cashPaymentsService
      .updateCashFuturePaymentCategory(this.selectedCashFuturePayment, category)
      .subscribe({
        next: (updatedPayment) => {
          const index = this.cashFuturePayments.findIndex(
            (t) => t._id === updatedPayment._id
          );
          if (index > -1) {
            this.cashFuturePayments[index] = { ...updatedPayment };
            this._CashFuturePayments.set([...this.cashFuturePayments]);
          }
        },
      });
  }

  protected updateCashRecurrentPaymentCategory(category: Category) {
    this.cashPaymentsService
      .updateCashRecurrentPaymentCategory(
        this.selectedCashRecurrentPayment,
        category
      )
      .subscribe({
        next: (updatedPayment) => {
          const index = this.cashRecurrentPayments.findIndex(
            (t) => t._id === updatedPayment._id
          );
          if (index > -1) {
            this.cashRecurrentPayments[index] = { ...updatedPayment };
            this._CashRecurrentPayments.set([...this.cashRecurrentPayments]);
          }
        },
      });
  }

  protected addCashFuturePayment() {
    this.cashPaymentsService
      .addCashFuturePayment(this.newCashFuturePayment)
      .subscribe({
        next: (payment) => {
          this.cashFuturePayments.push(payment);
          this._CashFuturePayments.set([...this.cashFuturePayments]);
          this.resetNewCashRecurrentPayment();
        },
      });
  }

  protected addCashRecurrentPayment() {
    this.cashPaymentsService
      .addCashRecurrentPayment(this.newCashRecurrentPayment)
      .subscribe({
        next: (payment) => {
          this.cashRecurrentPayments.push(payment);
          this._CashRecurrentPayments.set([...this.cashRecurrentPayments]);
          this.resetNewCashRecurrentPayment();
        },
      });
  }

  private resetNewCashFuturePayment() {
    this.newCashFuturePayment = {
      beneficiary: '',
      details: '',
      amount: 0,
      currency: Currency.RON,
      postingDate: new Date(),
      account: this.cashAccounts[0],
      category: this.categories[0],
    };
  }

  private resetNewCashRecurrentPayment() {
    this.newCashRecurrentPayment = {
      beneficiary: '',
      details: '',
      amount: 0,
      currency: Currency.RON,
      recurrence: 'monthly',
      recurrenceStart: new Date(),
      recurrenceEnd: new Date(),
      account: this.cashAccounts[0],
      category: this.categories[0],
    };
  }

  protected selectCashFuturePayment(payment: CashFuturePayment) {
    this.selectedCashFuturePayment = { ...payment };
    this.selectedCashFuturePayment.postingDate = formatDate(
      new Date(this.selectedCashFuturePayment.postingDate),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  protected selectCashRecurrentPayment(payment: CashRecurrentPayment) {
    this.selectedCashRecurrentPayment = { ...payment };
    this.selectedCashRecurrentPayment.recurrenceStart = formatDate(
      new Date(this.selectedCashRecurrentPayment.recurrenceStart),
      'yyyy-MM-dd',
      'en-US'
    );
    this.selectedCashRecurrentPayment.recurrenceEnd = formatDate(
      new Date(this.selectedCashRecurrentPayment.recurrenceEnd),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  protected saveCashFuturePayment() {
    this.cashPaymentsService
      .updateCashFuturePayment(this.selectedCashFuturePayment)
      .subscribe({
        next: (updatedPayment) => {
          const index = this.cashFuturePayments.findIndex(
            (t) => t._id === updatedPayment._id
          );
          if (index > -1) {
            this.cashFuturePayments[index] = { ...updatedPayment };
            this._CashFuturePayments.set([...this.cashFuturePayments]);
          }
        },
      });
  }

  protected saveCashRecurrentPayment() {
    this.cashPaymentsService
      .updateCashRecurrentPayment(this.selectedCashRecurrentPayment)
      .subscribe({
        next: (updatedPayment) => {
          const index = this.cashRecurrentPayments.findIndex(
            (t) => t._id === updatedPayment._id
          );
          if (index > -1) {
            this.cashRecurrentPayments[index] = { ...updatedPayment };
            this._CashRecurrentPayments.set([...this.cashRecurrentPayments]);
          }
        },
      });
  }

  protected deleteCashFuturePayment() {
    if (this.selectedCashFuturePayment && this.selectedCashFuturePayment._id) {
      this.cashPaymentsService
        .deleteCashFuturePayment(this.selectedCashFuturePayment._id)
        .subscribe({
          next: () => {
            this.cashFuturePayments = this.cashFuturePayments.filter(
              (t) => t._id !== this.selectedCashFuturePayment._id
            );
            this._CashFuturePayments.set([...this.cashFuturePayments]);
          },
        });
    }
  }

  protected deleteCashRecurrentPayment() {
    if (
      this.selectedCashRecurrentPayment &&
      this.selectedCashRecurrentPayment._id
    ) {
      this.cashPaymentsService
        .deleteCashRecurrentPayment(this.selectedCashRecurrentPayment._id)
        .subscribe({
          next: () => {
            this.cashRecurrentPayments = this.cashRecurrentPayments.filter(
              (t) => t._id !== this.selectedCashRecurrentPayment._id
            );
            this._CashRecurrentPayments.set([...this.cashRecurrentPayments]);
          },
        });
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _CashFuturePaymentsFilter = signal('');
  protected readonly _CashRecurrentPaymentsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _cashFuturePaymentsColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    postingDate: { visible: true, label: 'Posting Date' },
    beneficiary: { visible: true, label: 'Beneficiary' },
    details: { visible: true, label: 'Details' },
    amount: { visible: true, label: 'Amount' },
    currency: { visible: false, label: 'Currency' },
  });
  protected readonly _cashFuturePaymentsAllDisplayedColumns = computed(() => [
    ...this._cashFuturePaymentsColumnManager.displayedColumns(),
    'actions',
  ]);

  protected readonly _cashRecurrentPaymentsColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    nextPaymentDate: { visible: true, label: 'nextPaymentDate' },
    beneficiary: { visible: true, label: 'Beneficiary' },
    details: { visible: true, label: 'Details' },
    amount: { visible: true, label: 'Amount' },
    currency: { visible: false, label: 'Currency' },
  });
  protected readonly _cashRecurrentPaymensAllDisplayedColumns = computed(() => [
    ...this._cashRecurrentPaymentsColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _CashFuturePayments = signal(this.cashFuturePayments);
  private readonly _CashRecurrentPayments = signal(this.cashRecurrentPayments);
  private readonly _filteredCashFuturePayments = computed(() => {
    const filter = this._CashFuturePaymentsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._CashFuturePayments().filter(
        (u) =>
          u.category.name.toLowerCase().includes(filter) ||
          u.beneficiary.toLowerCase().includes(filter) ||
          u.details.toLowerCase().includes(filter) ||
          u.amount.toString().includes(filter) ||
          u.currency.toString().includes(filter)
      );
    }
    return this._CashFuturePayments();
  });

  private readonly _filteredCashRecurrentPayments = computed(() => {
    const filter = this._CashRecurrentPaymentsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._CashRecurrentPayments().filter(
        (u) =>
          u.category.name.toLowerCase().includes(filter) ||
          u.beneficiary.toLowerCase().includes(filter) ||
          u.details.toLowerCase().includes(filter) ||
          u.amount.toString().includes(filter)
      );
    }
    return this._CashRecurrentPayments();
  });

  private readonly _dateSort = signal<'ASC' | 'DESC' | null>(null);

  protected readonly _filteredSortedPaginatedFuturePayments = computed(() => {
    const sort = this._dateSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const Payments = this._filteredCashFuturePayments();
    if (!sort) {
      return Payments.slice(start, end);
    }
    return [...Payments]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) *
          (Number(p1.postingDate) - Number(p2.postingDate))
      )
      .slice(start, end);
  });

  protected readonly _filteredSortedPaginatedRecurrentPayments = computed(
    () => {
      const sort = this._dateSort();
      const start = this._displayedIndices().start;
      const end = this._displayedIndices().end + 1;
      const Payments = this._filteredCashRecurrentPayments();
      if (!sort) {
        return Payments.slice(start, end);
      }
      return [...Payments]
        .sort(
          (p1, p2) =>
            (sort === 'ASC' ? 1 : -1) *
            (Number(p1.nextPaymentDate) - Number(p2.nextPaymentDate))
        )
        .slice(start, end);
    }
  );

  protected readonly _trackByFuture: TrackByFunction<CashFuturePayment> = (
    _: number,
    p: CashFuturePayment
  ) => p._id;

  protected readonly _trackByRecurrent: TrackByFunction<CashRecurrentPayment> =
    (_: number, p: CashRecurrentPayment) => p._id;

  protected readonly _totalCashFuturePayments = computed(
    () => this._filteredCashFuturePayments().length
  );
  protected readonly _totalCashRecurrentPayments = computed(
    () => this._filteredCashRecurrentPayments().length
  );

  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor(
    private cashPaymentsService: CashPaymentsService,
    private categoriesService: CategoryService,
    private cashAccountsService: CashAccountService
  ) {
    effect(
      () => this._CashFuturePaymentsFilter.set(this._debouncedFilter() ?? ''),
      {
        allowSignalWrites: true,
      }
    );
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
