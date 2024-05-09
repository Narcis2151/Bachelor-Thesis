import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { debounceTime } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';

import Currency from '../../../../shared/account-currency';

import CashAccount from './cash-account.model';
import { CashAccountService } from '../cash-account.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-cash-account-list',
  templateUrl: './cash-account-list.component.html',
  styleUrl: './cash-account-list.component.scss',
})
export class CashAccountListComponent {
  isLoading = false;
  cashAccounts: CashAccount[] = [];
  selectedCashAccount!: CashAccount;
  protected readonly currencies = Object.values(Currency);
  protected newCashAccount: CashAccount = {
    name: '',
    currency: Currency.RON,
    balance: 0,
  };

  public pieChartOptions: ChartOptions = {
    responsive: false,
  };
  public pieChartLabels: string[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartData: any[] = [];
  public pieChartType: ChartType = 'pie';

  ngOnInit() {
    this.loadCashAccounts();
  }

  protected loadCashAccounts() {
    this.isLoading = true;
    this.cashAccountService.getCashAccounts().subscribe((accounts) => {
      this.cashAccounts = accounts;
      this._CashAccounts.set(accounts);
      this.prepareChartData();
    });
    this.isLoading = false;
  }

  protected addCashAccount() {
    this.cashAccountService
      .addCashAccount(this.newCashAccount)
      .subscribe((account) => {
        this.cashAccounts.push(account);
        this.resetNewCashAccount();
        this._CashAccounts.set([
          ...this.cashAccounts.sort((a, b) => b.balance - a.balance),
        ]);
        this.prepareChartData();
      });
  }

  private prepareChartData() {
    // Accumulate total balances for each currency present in cashAccounts
    const currencyTotals = this.cashAccounts.reduce<Record<string, number>>((acc, account) => {
        const balance = account.balanceEquivalent ?? 0;
        if (balance > 0) { // Ensure only to include accounts with a positive balance
            if (acc[account.currency]) {
                acc[account.currency] += balance;
            } else {
                acc[account.currency] = balance;
            }
        }
        return acc;
    }, {});

    // Update chart data and labels based on the accumulated results
    this.pieChartLabels = Object.keys(currencyTotals).filter(key => currencyTotals[key] > 0);
    this.pieChartData = [{
        data: this.pieChartLabels.map(label => currencyTotals[label])
    }];
}


  protected resetNewCashAccount() {
    this.newCashAccount = {
      name: '',
      balance: 0,
      currency: Currency.RON,
    };
  }

  protected selectCashAccount(cashAccount: CashAccount) {
    this.selectedCashAccount = { ...cashAccount };
  }

  protected toggleEditName(cashAccount: CashAccount): void {
    cashAccount.isEditing = !cashAccount.isEditing;
  }

  protected saveCashAccountName(cashAccount: CashAccount): void {
    this.cashAccountService
      .updateCashAccountName(cashAccount)
      .subscribe((account) => {
        const index = this.cashAccounts.findIndex(
          (acc) => acc._id === account._id
        );
        if (index !== -1) {
          this.cashAccounts[index] = account;
          this._CashAccounts.set([...this.cashAccounts]);
        }
      });
  }

  protected saveCashAccountBalance() {
    if (this.selectedCashAccount) {
      this.cashAccountService
        .updateCashAccountBalance(this.selectedCashAccount)
        .subscribe((account) => {
          const index = this.cashAccounts.findIndex(
            (acc) => acc._id === account._id
          );
          if (index !== -1) {
            this.cashAccounts[index] = account;
            this._CashAccounts.set([
              ...this.cashAccounts.sort((a, b) => b.balance - a.balance),
            ]);
          }
          this.prepareChartData();
        });
    }
  }

  protected deleteCashAccount() {
    if (this.selectedCashAccount && this.selectedCashAccount._id) {
      this.cashAccountService
        .deleteCashAccount(this.selectedCashAccount._id)
        .subscribe(() => {
          this.cashAccounts = this.cashAccounts.filter(
            (t) => t._id !== this.selectedCashAccount!._id
          );
          this._CashAccounts.set([
            ...this.cashAccounts.sort((a, b) => b.balance - a.balance),
          ]);
          this.prepareChartData();
        });
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
  ) => p._id;
  protected readonly _totalElements = computed(
    () => this._filteredCashAccounts().length
  );

  constructor(private cashAccountService: CashAccountService) {
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
