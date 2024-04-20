import { Component } from '@angular/core';

import Category from './category/category.model';
import { categories } from './categories-list';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  allCategories: Category[] = categories;

  personalCategories: Category[] = categories.filter(
    (category) => !category.isShared
  );

  sharedCategories: Category[] = categories.filter(
    (category) => category.isShared
  );

  constructor() {}
}
