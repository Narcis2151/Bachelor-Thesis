import { Component, Input } from '@angular/core';

import CashAccount from './cash-account.model';

@Component({
  selector: 'app-cash-account',
  templateUrl: './cash-account.component.html',
  styleUrl: './cash-account.component.scss',
})
export class CashAccountComponent {
  @Input() cashAccount!: CashAccount;

  toggleEdit(cashAccount: CashAccount): void {
    this.cashAccount.isEditing = !cashAccount.isEditing;
  }
  
  saveAccount(account: CashAccount, newName: string): void {
    if (newName.trim() === '') {
      alert('Name cannot be empty.');
      return;
    }
    this.cashAccount.name = newName;
    this.cashAccount.isEditing = false;
    // Add any additional save logic here, such as updating the server or local storage
  }
}
