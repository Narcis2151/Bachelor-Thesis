import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { debounceTime } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';

import Payment from './payment-model';
import { PaymentsService } from '../payments.service';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
import categories from '../../categories/category-list/categories-list';
import { CategoryService } from '../../categories/category.service';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss',
})
export class PaymentsListComponent {
  protected payments: Payment[] = [];
  protected selectedPayment!: Payment;
  protected readonly currencies = Object.values(Currency);
  protected categories: Category[] = categories;
  protected newPayment: Payment = {
    beneficiary: {
      name: '',
      account: '',
    },
    details: '',
    amount: 0,
    currency: Currency.RON,
    postingDate: new Date(),
    isRecurrent: false,
    recurrence: 'monthly',
    recurrenceStart: new Date(),
    recurrenceEnd: new Date(),
    account: {
      _id: '1',
      name: 'Personal',
      currency: Currency.RON,
      balance: 1000,
      balanceUpdatedAt: new Date('2024-01-01'),
    },
    category: categories[0],
  };

  ngOnInit() {
    this.fetchPaymentCategories();
    this.loadPayments();
  }

  protected fetchPaymentCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        console.log(categories);
        this.categories = categories.categories;
      },
    });
  }

  protected loadPayments() {
    this.paymentsService.getPayments().subscribe({
      next: (payments) => {
        console.log(payments);
        this.payments = payments;
        this._Payments.set(this.payments);
      },
    });
  }

  protected updatePaymentCategory(category: Category) {
    this.paymentsService
      .updatePaymentCategory(this.selectedPayment, category)
      .subscribe({
        next: (updatedPayment) => {
          const index = this.payments.findIndex(
            (t) => t._id === updatedPayment._id
          );
          if (index > -1) {
            this.payments[index] = { ...updatedPayment };
            this._Payments.set([...this.payments]);
          }
        },
      });
  }

  protected addPayment() {
    this.paymentsService.addPayment(this.newPayment).subscribe({
      next: (payment) => {
        this.payments.push(payment);
        this._Payments.set([...this.payments]);
        this.resetNewPayment();
      },
    });
  }

  private resetNewPayment() {
    this.newPayment = {
      _id: '',
      beneficiary: {
        name: '',
        account: '',
      },
      details: '',
      amount: 0,
      currency: Currency.RON,
      postingDate: new Date(),
      isRecurrent: false,
      recurrence: 'monthly',
      recurrenceStart: new Date(),
      recurrenceEnd: new Date(),
      account: {
        _id: '1',
        name: 'Personal',
        currency: Currency.RON,
        balance: 1000,
        balanceUpdatedAt: new Date('2024-01-01'),
      },
      category: categories[0],
    };
  }

  protected selectPayment(payment: Payment) {
    this.selectedPayment = { ...payment };
    this.selectedPayment.postingDate = formatDate(
      new Date(this.selectedPayment.postingDate),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  protected savePayment() {
    this.paymentsService.updatePayment(this.selectedPayment).subscribe({
      next: (updatedPayment) => {
        const index = this.payments.findIndex(
          (t) => t._id === updatedPayment._id
        );
        if (index > -1) {
          this.payments[index] = { ...updatedPayment };
          this._Payments.set([...this.payments]);
        }
      },
    });
  }

  protected deletePayment() {
    if (this.selectedPayment) {
      const index = this.payments.findIndex(
        (t) => t._id === this.selectedPayment!._id
      );
      if (index > -1) {
        this.payments.splice(index, 1);
        this._Payments.set([...this.payments]);
      }
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _paymentsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _oneTimePaymentsColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    postingDate: { visible: true, label: 'Posting Date' },
    beneficiary: { visible: true, label: 'Beneficiary' },
    details: { visible: true, label: 'Details' },
    amount: { visible: true, label: 'Amount' },
    currency: { visible: false, label: 'Currency' },
  });
  protected readonly _oneTimePaymentsAllDisplayedColumns = computed(() => [
    ...this._oneTimePaymentsColumnManager.displayedColumns(),
    'actions',
  ]);

  protected readonly _recurrentPaymentsColumnManager = useBrnColumnManager({
    category: { visible: true, label: 'category' },
    recurrenceEnd: { visible: true, label: 'Posting Date' },
    beneficiary: { visible: true, label: 'Beneficiary' },
    details: { visible: true, label: 'Details' },
    amount: { visible: true, label: 'Amount' },
    currency: { visible: false, label: 'Currency' },
  });
  protected readonly _recurrentPaymensAllDisplayedColumns = computed(() => [
    ...this._recurrentPaymentsColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _Payments = signal(this.payments);
  private readonly _filteredPayments = computed(() => {
    const filter = this._paymentsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._Payments().filter(
        (u) =>
          (typeof u.category === 'object' &&
            u.category.name &&
            u.category.name.toLowerCase().includes(filter)) ||
          (u.beneficiary.name &&
            u.beneficiary.name.toLowerCase().includes(filter)) ||
          (u.beneficiary.account &&
            u.beneficiary.account.toLowerCase().includes(filter)) ||
          u.details.toLowerCase().includes(filter) ||
          u.amount.toString().includes(filter) ||
          u.currency.toString().includes(filter)
      );
    }
    return this._Payments();
  });

  private readonly _oneTimePayments = computed(() =>
    this._filteredPayments().filter((p) => !p.isRecurrent)
  );

  private readonly _recurrentPayments = computed(() =>
    this._filteredPayments().filter((p) => p.isRecurrent)
  );
  private readonly _dateSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedOneTimePayments = computed(() => {
    const sort = this._dateSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const Payments = this._oneTimePayments();
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

  protected readonly _filteredSortedPaginatedRecurrentPayments = computed(() => {
    const sort = this._dateSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const Payments = this._recurrentPayments();
    if (!sort) {
      return Payments.slice(start, end);
    }
    return [...Payments]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) *
          (Number(p1.recurrenceEnd) - Number(p2.recurrenceEnd))
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<Payment> = (
    _: number,
    p: Payment
  ) => p._id;
  protected readonly _totalElements = computed(
    () => this._filteredPayments().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor(
    private paymentsService: PaymentsService,
    private categoriesService: CategoryService
  ) {
    effect(() => this._paymentsFilter.set(this._debouncedFilter() ?? ''), {
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
