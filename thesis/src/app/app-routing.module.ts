import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';
import { AccountsPageComponent } from './accounts/pages/accounts-page/accounts-page.component';
import { TransactionsPageComponent } from './transactions/pages/transactions-page/transactions-page.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'accounts', component: AccountsPageComponent },
  { path: 'transactions', component: TransactionsPageComponent },
  // { path: '', redirectTo: '/transactions', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
