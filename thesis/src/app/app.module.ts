import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CategoryComponent } from './categories/category-list/category/category.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryNavigationComponent } from './categories/category-navigation/category-navigation.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCaptionComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-caption.component';
import { HlmTableComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-table.component';
import { HlmTdComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-td.component';
import { HlmThComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-th.component';
import { HlmTrowComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-trow.component';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';

import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';

import {
  BrnAlertDialogContentDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';

import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideMoreHorizontal,
  lucideHome,
  lucidePizza,
  lucideCar,
  lucideShoppingCart,
  lucideHeartPulse,
  lucideClapperboard,
  lucideBookOpen,
  lucideCircleEllipsis,
  lucideWallet,
  lucideBanknote,
  lucideBadgeDollarSign,
  lucidePodcast,
} from '@ng-icons/lucide';

import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import {
  HlmCheckboxCheckIconComponent,
  HlmCheckboxComponent,
} from '@spartan-ng/ui-checkbox-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnTableModule } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import {
  BrnProgressComponent,
  BrnProgressIndicatorComponent,
} from '@spartan-ng/ui-progress-brain';
import { HlmProgressIndicatorDirective } from '../../components/ui-progress-helm/src/lib/hlm-progress-indicator.directive';

import { CalendarModule } from 'primeng/calendar';

import { CashAccountListComponent } from './accounts/cash-account-list/cash-account-list.component';
import { CashAccountComponent } from './accounts/cash-account-list/cash-account/cash-account.component';
import { AccountsPageComponent } from './accounts/pages/accounts-page/accounts-page.component';
import { CashTransactionComponent } from './transactions/cash-transactions-list/cash-transaction/cash-transaction.component';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { CashTransactionsListComponent } from './transactions/cash-transactions-list/cash-transactions-list.component';
import { TransactionsPageComponent } from './transactions/pages/transactions-page/transactions-page.component';
import { BudgetListComponent } from './budgets/budget-list/budget-list.component';
import { BudgetComponent } from './budgets/budget-list/budget/budget.component';
import { BudgetsPageComponent } from './budgets/pages/budgets-page/budgets-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    NavigationComponent,
    CategoryComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoriesPageComponent,
    CashAccountListComponent,
    CashAccountComponent,
    AccountsPageComponent,
    CashTransactionsListComponent,
    CashTransactionComponent,
    TransactionsPageComponent,
    BudgetListComponent,
    BudgetComponent,
    BudgetsPageComponent,
  ],
  imports: [
    BrnToggleDirective,
    HlmToggleDirective,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    BrnProgressComponent,
    BrnProgressIndicatorComponent,
    HlmProgressIndicatorDirective,
    HlmButtonDirective,
    HlmTableComponent,
    HlmTrowComponent,
    HlmThComponent,
    HlmTdComponent,
    HlmCaptionComponent,
    HlmCardDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmInputDirective,
    HlmLabelDirective,
    BrnMenuTriggerDirective,
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,
    CalendarModule,
    TitleCasePipe,
    DecimalPipe,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HlmIconComponent,
    BrnMenuTriggerDirective,
    HlmMenuModule,
    BrnTableModule,
    HlmTableModule,
    HlmButtonModule,
    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,
    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,
    BrnSelectModule,
    HlmSelectModule,
  ],
  providers: [
    provideIcons({
      lucideWallet,
      lucideChevronDown,
      lucideMoreHorizontal,
      lucideArrowUpDown,
      lucideHome,
      lucidePizza,
      lucideCar,
      lucideShoppingCart,
      lucideHeartPulse,
      lucideClapperboard,
      lucideBookOpen,
      lucideCircleEllipsis,
      lucideBanknote,
      lucideBadgeDollarSign,
      lucidePodcast,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
