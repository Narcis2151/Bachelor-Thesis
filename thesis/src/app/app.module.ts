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
import { EditCategoryComponent } from './categories/pages/edit-category/edit-category.component';
import { HlmCaptionComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-caption.component';
import { HlmTableComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-table.component';
import { HlmTdComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-td.component';
import { HlmThComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-th.component';
import { HlmTrowComponent } from '../../components/libs/ui/ui-table-helm/src/lib/hlm-trow.component';

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
    EditCategoryComponent,
  ],
  imports: [
    HlmTableComponent,
    HlmTrowComponent,
    HlmThComponent,
    HlmTdComponent,
    HlmCaptionComponent,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
