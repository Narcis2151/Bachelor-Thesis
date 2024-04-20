import { Component, Input } from '@angular/core';

import Category from './category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  @Input() category!: Category;

  toggleEditName(category: Category): void {
    this.category.isEditing = !category.isEditing;
  }

  saveCategoryName(category: Category, newName: string): void {
    if (newName.trim() === '') {
      alert('Name cannot be empty.');
      return;
    }
    this.category.name = newName;
    this.category.isEditing = false;
    // Add any additional save logic here, such as updating the server or local storage
  }
}
