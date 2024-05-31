import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthComponent } from './auth/auth.component';
import { BudgetsPageComponent } from './budgets/pages/budgets-page/budgets-page.component';
import { AccountsPageComponent } from './accounts/pages/accounts-page/accounts-page.component';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';
import { TransactionsPageComponent } from './transactions/pages/transactions-page/transactions-page.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    component: AccountsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    component: TransactionsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'budgets',
    component: BudgetsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
