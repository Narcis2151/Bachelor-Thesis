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
import payments from './payment-data';
import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
import { categories } from '../../categories/category-list/categories-list';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss',
})
export class PaymentsListComponent {
  protected payments: Payment[] = payments;
  protected selectedPayment!: Payment;
  protected readonly currencies = Object.values(Currency);
  protected categories: Category[] = categories;
  protected newPayment: Payment = {
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
    account: '1',
  };

  protected addPayment() {
    this.newPayment._id = this.generateUniqueId();
    this.newPayment.postingDate = new Date(this.newPayment.postingDate);
    this.payments.push({ ...this.newPayment });
    this._Payments.set([...this.payments]);
    this.resetNewTransaction();
  }

  private resetNewTransaction() {
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
      account: '1',
    };
  }

  private generateUniqueId(): string {
    return `id-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected selectTransaction(payment: Payment) {
    this.selectedPayment = { ...payment };
    this.selectedPayment.postingDate = formatDate(
      new Date(this.selectedPayment.postingDate),
      'yyyy-MM-dd',
      'en-US'
    );
  }

  protected saveTransaction() {
    if (this.selectedPayment) {
      const index = this.payments.findIndex(
        (t) => t._id === this.selectedPayment!._id
      );
      if (index > -1) {
        this.selectedPayment.postingDate = new Date();
        this.payments[index] = { ...this.selectedPayment };
        this._Payments.set([...this.payments]);
      }
    }
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
  private readonly _dateSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedCashTransactions = computed(() => {
    const sort = this._dateSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const Payments = this._filteredPayments();
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

  constructor() {
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
