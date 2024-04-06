import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoriesPageComponent } from './categories/pages/categories-page/categories-page.component';

const routes: Routes = [{ path: 'auth', component: AuthComponent }, { path: 'categories', component: CategoriesPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
