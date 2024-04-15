import { Component } from '@angular/core';
import CashAccount from '../cash-account-list/cash-account/cash-account.model';

import { cashAccounts } from './cash-account-list';

@Component({
  selector: 'app-cash-account-list',
  templateUrl: './cash-account-list.component.html',
  styleUrl: './cash-account-list.component.scss'
})
export class CashAccountListComponent {
  constructor() {}

  cashAccounts: CashAccount[] = cashAccounts
}
