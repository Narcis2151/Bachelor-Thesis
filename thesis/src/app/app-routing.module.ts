import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';
import { AccountsPageComponent } from './accounts/pages/accounts-page/accounts-page.component';
import { TransactionsPageComponent } from './transactions/pages/transactions-page/transactions-page.component';
import { BudgetsPageComponent } from './budgets/pages/budgets-page/budgets-page.component';
import { PaymentsPageComponent } from './payments/pages/payments-page/payments-page.component';
import { AuthGuard } from './auth.guard';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';

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
    path: 'payments',
    component: PaymentsPageComponent,
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
