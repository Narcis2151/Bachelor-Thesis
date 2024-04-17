import { Component, Input } from '@angular/core';

import CashAccount from './cash-account.model';

@Component({
  selector: 'app-cash-account',
  templateUrl: './cash-account.component.html',
  styleUrl: './cash-account.component.scss',
})
export class CashAccountComponent {
  @Input() cashAccount!: CashAccount;
}
