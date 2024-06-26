import {
  Component,
  TrackByFunction,
  ViewChild,
  computed,
  effect,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmDialogComponent } from '@spartan-ng/ui-dialog-helm';

import Currency from '../../../../../shared/account-currency';
import Account from '../../models/account.model';
import Institution from '../../models/institution.model';
import { AccountsService } from '../../services/accounts.service';
import { NordigenService } from '../../services/nordigen.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent {
  isLoading = false;
  institutions: any[] = [];
  connectError: string | null = null;
  accounts: Account[] = [];
  cashAccounts: Account[] = [];
  selectedAccount!: Account;
  accountError: string | null = null;
  readonly currencies = Object.values(Currency);
  newCashAccount: Account = {
    name: '',
    cashBank: 'cash',
    currency: Currency.RON,
    balance: 0,
  };

  pieChartOptions: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Account Balances',
        fullSize: true,
      },
    },
  };
  pieChartLabels: string[] = [];
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartData: any[] = [];
  pieChartType: ChartType = 'pie';

  @ViewChild('connectDialog') connectDialog!: HlmDialogComponent;
  @ViewChild('loadingDialog') loadingDialog!: HlmDialogComponent;

  ngOnInit() {
    this.loadAccounts();
    this.loadInstitutions();
    this.route.queryParams.subscribe((params) => {
      const requisitionId = params['requisition_id'];
      if (requisitionId) {
        this.checkRequisitionStatus(requisitionId);
      }
    });
  }

  loadInstitutions() {
    this.nordigenService.getInstitutions().subscribe({
      next: (institutions) => {
        this.institutions = institutions;
      },
      error: (err) => {
        console.error('Failed to load institutions', err);
        this.connectError = 'Failed to load institutions';
      },
    });
  }

  connectBank(institution: Institution, ctx: any) {
    this.nordigenService
      .createRequisition(
        'http://localhost:4200/callback',
        institution.id,
        institution.logo
      )
      .subscribe({
        next: (requisition) => {
          ctx.close();
          window.location.href = requisition.link;
          this.connectError = null;
        },
        error: (err) => {
          console.error('Failed to create requisition', err);
          this.connectError = 'Failed to create requisition';
        },
      });
  }

  checkRequisitionStatus(requisitionId: string) {
    this.nordigenService.getRequisition(requisitionId).subscribe({
      next: (requisition) => {
        this.loadingDialog.open();
        if (requisition.status === 'LN') {
          this.importInitialData(requisition._id!);
        } else {
          this.loadingDialog.close({});
          this.connectError = 'Requisition is not active';
        }
      },
      error: (err) => {
        console.error('Failed to check requisition status', err);
        this.loadingDialog.close({});
        this.connectError = 'Failed to check requisition status';
      },
    });
  }

  importInitialData(requisitionId: string) {
    this.nordigenService.importData(requisitionId).subscribe({
      next: () => {
        this.loadingDialog.close({});
        this.loadAccounts();
        this.loadInstitutions();
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        console.error('Failed to import data', err);
        this.loadingDialog.close({});
        this.connectError = 'Failed to import data';
      },
    });
  }

  loadAccounts() {
    this.isLoading = true;
    this.accountsService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      this.cashAccounts = accounts.filter((a) => a.cashBank === 'cash');
      this._Accounts.set(accounts);
      this.prepareChartData();
    });
    this.isLoading = false;
  }

  addCashAccount(ctx: any) {
    this.accountsService.addCashAccount(this.newCashAccount).subscribe({
      next: (account) => {
        this.accounts.push(account);
        this.resetNewCashAccount();
        this._Accounts.set([
          ...this.accounts.sort((a, b) => b.balance - a.balance),
        ]);
        this.prepareChartData();
        ctx.close();
        this.accountError = null;
      },
      error: (error) => {
        console.error('Account creation failed', error);
        if (error.status === 400) {
          this.accountError = error.error.message;
        } else {
          this.accountError =
            error.error.message || 'An error occurred. Please try again later.';
        }
      },
    });
  }

  private prepareChartData() {
    const currencyTotals = this.accounts.reduce<Record<string, number>>(
      (acc, account) => {
        const balance = account.balanceEquivalent ?? 0;
        if (balance > 0) {
          if (acc[account.currency]) {
            acc[account.currency] += balance;
          } else {
            acc[account.currency] = balance;
          }
        }
        return acc;
      },
      {}
    );

    // Update chart data and labels based on the accumulated results
    this.pieChartLabels = Object.keys(currencyTotals).filter(
      (key) => currencyTotals[key] > 0
    );
    this.pieChartData = [
      {
        data: this.pieChartLabels.map((label) => currencyTotals[label]),
      },
    ];
  }

  resetNewCashAccount() {
    this.newCashAccount = {
      name: '',
      cashBank: 'cash',
      balance: 0,
      currency: Currency.RON,
    };
  }

  selectAccount(Account: Account) {
    this.selectedAccount = { ...Account };
  }

  toggleEditName(Account: Account): void {
    Account.isEditing = !Account.isEditing;
  }

  saveCashAccountName(Account: Account): void {
    this.accountsService.updateCashAccountName(Account).subscribe((account) => {
      const index = this.accounts.findIndex((acc) => acc._id === account._id);
      if (index !== -1) {
        this.accounts[index] = account;
        this._Accounts.set([...this.accounts]);
      }
    });
  }

  saveCashAccountBalance(ctx: any) {
    if (this.selectedAccount) {
      this.accountsService
        .updateCashAccountBalance(this.selectedAccount)
        .subscribe({
          next: (account) => {
            const index = this.accounts.findIndex(
              (acc) => acc._id === account._id
            );
            if (index !== -1) {
              this.accounts[index] = account;
              this._Accounts.set([
                ...this.accounts.sort((a, b) => b.balance - a.balance),
              ]);
            }
            ctx.close();
            this.accountError = null;
            this.prepareChartData();
          },
          error: (error) => {
            console.error('Update account balance failed', error);
            if (error.status === 400) {
              this.accountError = error.error.message;
            } else {
              this.accountError =
                error.error.message ||
                'An error occurred. Please try again later.';
            }
          },
        });
    }
  }

  deleteAccount() {
    if (this.selectedAccount && this.selectedAccount._id) {
      this.accountsService
        .deleteAccount(this.selectedAccount._id, this.selectedAccount.cashBank)
        .subscribe(() => {
          this.accounts = this.accounts.filter(
            (t) => t._id !== this.selectedAccount!._id
          );
          this._Accounts.set([
            ...this.accounts.sort((a, b) => b.balance - a.balance),
          ]);
          this.prepareChartData();
        });
    }
  }

  readonly _rawFilterInput = signal('');
  readonly _accountsFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );
  readonly _pageSize = signal(10000);

  readonly _brnColumnManager = useBrnColumnManager({
    logo: { visible: true, label: 'logo' },
    name: { visible: true, label: 'name' },
    balance: { visible: true, label: 'balance' },
    currency: { visible: true, label: 'currency' },
    isEditing: { visible: false, label: 'isEditing' },
    cashBank: { visible: false },
  });
  readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _Accounts = signal(this.accounts);
  private readonly _filteredAccounts = computed(() => {
    const filter = this._accountsFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._Accounts().filter(
        (u) =>
          u.name.toLowerCase().includes(filter) ||
          u.currency.toLowerCase().includes(filter) ||
          u.balance.toString().includes(filter)
      );
    }
    return this._Accounts();
  });
  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);
  readonly _filteredSortedPaginatedBudgets = computed(() => {
    const sort = this._nameSort();
    const accounts = this._filteredAccounts();
    if (!sort) {
      return accounts.slice(0, this._pageSize());
    }
    return [...accounts]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.balance - p2.balance)
      .slice(0, this._pageSize());
  });

  readonly _trackBy: TrackByFunction<Account> = (_: number, p: Account) =>
    p._id;
  readonly _totalElements = computed(() => this._filteredAccounts().length);

  constructor(
    private router: Router,
    private accountsService: AccountsService,
    private nordigenService: NordigenService,
    private route: ActivatedRoute
  ) {
    effect(() => this._accountsFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  handleNameSortChange() {
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
