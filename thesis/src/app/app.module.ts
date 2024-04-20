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
} from '@ng-icons/lucide';

// import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { CashAccountListComponent } from './accounts/cash-account-list/cash-account-list.component';
import { CashAccountComponent } from './accounts/cash-account-list/cash-account/cash-account.component';
import { AccountsPageComponent } from './accounts/pages/accounts-page/accounts-page.component';

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
  ],
  imports: [
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
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HlmIconComponent,
  ],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideMoreHorizontal,
      lucideArrowUpDown,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
