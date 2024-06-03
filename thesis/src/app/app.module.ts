import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryNavigationComponent } from './categories/category-navigation/category-navigation.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
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
  lucideUser,
  lucideUsers,
  lucideAlertCircle,
  lucideArrowLeftRight,
} from '@ng-icons/lucide';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
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
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

import {
  BrnHoverCardComponent,
  BrnHoverCardContentDirective,
  BrnHoverCardTriggerDirective,
} from '@spartan-ng/ui-hovercard-brain';

import { HlmHoverCardContentComponent } from '@spartan-ng/ui-hovercard-helm';

import { CalendarModule } from 'primeng/calendar';

import { AccountListComponent } from './accounts/account-list/cash-account-list.component';
import { AccountsPageComponent } from './accounts/pages/accounts-page/accounts-page.component';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { CashTransactionsListComponent } from './transactions/cash-transactions-list/cash-transactions-list.component';
import { TransactionsPageComponent } from './transactions/pages/transactions-page/transactions-page.component';
import { BudgetListComponent } from './budgets/budget-list/budget-list.component';
import { BudgetsPageComponent } from './budgets/pages/budgets-page/budgets-page.component';
import { JwtInterceptor } from './jwt.interceptor';
import {
  provideCharts,
  withDefaultRegisterables,
  BaseChartDirective,
} from 'ng2-charts';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { NordigenCallbackComponent } from './accounts/nordigen-callback/nordigen-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    NavigationComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoriesPageComponent,
    AccountListComponent,
    AccountsPageComponent,
    CashTransactionsListComponent,
    TransactionsPageComponent,
    BudgetListComponent,
    BudgetsPageComponent,
    DashboardPageComponent,
    DashboardComponent,
    NordigenCallbackComponent,
  ],
  imports: [
    BaseChartDirective,
    BrnSeparatorComponent,
    HlmSeparatorDirective,
    BrnHoverCardComponent,
    BrnHoverCardContentDirective,
    BrnHoverCardTriggerDirective,
    HlmHoverCardContentComponent,
    HlmBadgeDirective,
    BrnToggleDirective,
    HlmToggleDirective,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmSpinnerComponent,
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
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
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
      lucideUser,
      lucideUsers,
      lucideAlertCircle,
      lucideArrowLeftRight,
    }),
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
