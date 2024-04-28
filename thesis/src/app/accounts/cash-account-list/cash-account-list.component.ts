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

import Currency from '../../../../shared/account-currency';

import CashAccount from '../cash-account-list/cash-account/cash-account.model';
import { cashAccounts } from './cash-account-list';

@Component({
  selector: 'app-cash-account-list',
  templateUrl: './cash-account-list.component.html',
  styleUrl: './cash-account-list.component.scss',
})
export class CashAccountListComponent {
  cashAccounts: CashAccount[] = cashAccounts;
  selectedCashAccount!: CashAccount;
  protected readonly currencies = Object.values(Currency);
  protected newCashAccount: CashAccount = {
    id: '',
    name: '',
    balance: 0,
    currency: Currency.RON,
    balanceUpdatedAt: new Date(),
  };

  protected toggleEditName(cashAccount: CashAccount): void {
    cashAccount.isEditing = !cashAccount.isEditing;
  }
  
  protected saveAccountName(cashAccount: CashAccount): void {
    if (cashAccount.name.trim() === '') {
      alert('Account name cannot be empty.');
      return;
    }
  
    // Find and update the specific cash account in your list
    const index = this.cashAccounts.findIndex((account) => account.id === cashAccount.id);
    if (index !== -1) {
      this.cashAccounts[index] = { ...cashAccount, isEditing: false }; // Save changes
      this._CashAccounts.set([...this.cashAccounts]); // Update the signal
    }
  }
  
  protected addCashAccount() {
    this.newCashAccount.id = this.generateUniqueId();
    this.newCashAccount.balanceUpdatedAt = new Date(
      this.newCashAccount.balanceUpdatedAt
    );
    this.cashAccounts.push({ ...this.newCashAccount });
    this._CashAccounts.set([...this.cashAccounts]);
    this.resetNewCashAccount();
  }

  protected resetNewCashAccount() {
    this.newCashAccount = {
      id: '',
      name: '',
      balance: 0,
      currency: Currency.RON,
      balanceUpdatedAt: new Date(),
    };
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected selectCashAccount(cashAccount: CashAccount) {
    this.selectedCashAccount = { ...cashAccount };
  }

  protected saveCashAccount() {
    if (this.selectedCashAccount) {
      const index = this.cashAccounts.findIndex(
        (t) => t.id === this.selectedCashAccount!.id
      );
      if (index > -1) {
        this.cashAccounts[index] = { ...this.selectedCashAccount };
        this._CashAccounts.set([...this.cashAccounts]);
      }
    }
  }

  protected deleteCashAccount() {
    if (this.selectedCashAccount) {
      const index = this.cashAccounts.findIndex(
        (t) => t.id === this.selectedCashAccount!.id
      );
      if (index > -1) {
        this.cashAccounts.splice(index, 1);
        this._CashAccounts.set([...this.cashAccounts]);
      }
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _cashAccountsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );
  protected readonly _pageSize = signal(10000);

  protected readonly _brnColumnManager = useBrnColumnManager({
    icon: { visible: true, label: 'icon' },
    name: { visible: true, label: 'name' },
    balance: { visible: true, label: 'balance' },
    currency: { visible: true, label: 'currency' },
    isEditing: { visible: false, label: 'isEditing' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _CashAccounts = signal(this.cashAccounts);
  private readonly _filteredCashAccounts = computed(() => {
    const filter = this._cashAccountsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._CashAccounts().filter(
        (u) =>
          u.name.toLowerCase().includes(filter) ||
          u.currency.toLowerCase().includes(filter) ||
          u.balance.toString().includes(filter)
      );
    }
    return this._CashAccounts();
  });
  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedBudgets = computed(() => {
    const sort = this._nameSort();
    const CashAccounts = this._filteredCashAccounts();
    if (!sort) {
      return CashAccounts.slice(0, this._pageSize());
    }
    return [...CashAccounts]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) *
          p1.name.localeCompare(p2.name, undefined, { sensitivity: 'base' })
      )
      .slice(0, this._pageSize());
  });

  protected readonly _trackBy: TrackByFunction<CashAccount> = (
    _: number,
    p: CashAccount
  ) => p.id;
  protected readonly _totalElements = computed(
    () => this._filteredCashAccounts().length
  );

  constructor() {
    effect(() => this._cashAccountsFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected handleNameSortChange() {
    const sort = this._nameSort();
    if (sort === 'ASC') {
      this._nameSort.set('DESC');
    } else if (sort === 'DESC') {
      this._nameSort.set(null);
    } else {
      this._nameSort.set('ASC');
    }
  }
}
