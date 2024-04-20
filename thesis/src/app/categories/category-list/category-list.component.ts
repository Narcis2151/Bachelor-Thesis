import { Component } from '@angular/core';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '../../../../components/libs/ui/ui-table-helm/src';

import Category from './category/category.model';
import { categories } from './categories-list';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  categories: Category[] = categories;

  constructor() {}

}
