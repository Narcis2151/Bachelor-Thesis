import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { HlmButtonDirective } from '../../components/ui-button-helm/src';
import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CategoryComponent } from './categories/category/category.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryNavigationComponent } from './categories/category-navigation/category-navigation.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, LoadingSpinnerComponent, NavigationComponent, CategoryComponent, CategoryListComponent, CategoryNavigationComponent, CategoriesPageComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HlmButtonDirective,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
