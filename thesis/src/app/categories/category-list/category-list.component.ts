import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
} from '@angular/core';
import { debounceTime } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';

import Category from './category/category.model';
import { categories } from './categories-list';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  allCategories: Category[] = categories;

  selectedCategory!: Category;
  protected newCategory: Category = {
    id: '',
    name: '',
    icon: '',
    isShared: false,
  };

  protected toggleEditName(category: Category): void {
    category.isEditing = !category.isEditing;
  }

  protected saveCategoryName(category: Category): void {
    if (category.name.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }

    const index = this.allCategories.findIndex(
      (category) => category.id === category.id
    );
    if (index !== -1) {
      this.allCategories[index] = { ...category, isEditing: false };
      this._Categories.set([...this.allCategories]); // Update the signal
    }
  }

  protected addCategory() {
    this.newCategory.id = this.generateUniqueId();

    this.allCategories.push({ ...this.newCategory });
    this._Categories.set([...this.allCategories]);
    this.resetCategory();
  }

  protected resetCategory() {
    this.newCategory = {
      id: '',
      name: '',
      icon: '',
      isShared: false,
    };
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected selectCategory(category: Category) {
    this.selectedCategory = { ...category };
  }

  protected saveCategory() {
    if (this.selectedCategory) {
      const index = this.allCategories.findIndex(
        (t) => t.id === this.selectedCategory!.id
      );
      if (index > -1) {
        this.allCategories[index] = { ...this.selectedCategory };
        this._Categories.set([...this.allCategories]);
      }
    }
  }

  protected deleteCategory() {
    if (this.selectedCategory) {
      const index = this.allCategories.findIndex(
        (t) => t.id === this.selectedCategory!.id
      );
      if (index > -1) {
        this.allCategories.splice(index, 1);
        this._Categories.set([...this.allCategories]);
      }
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _allCategoriesFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );
  protected readonly _pageSize = signal(10000);

  protected readonly _brnColumnManager = useBrnColumnManager({
    icon: { visible: true, label: 'icon' },
    name: { visible: true, label: 'name' },
    isShared: { visible: true, label: 'isShared' },
    isEditing: { visible: false, label: 'isEditing' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _Categories = signal(this.allCategories);
  private readonly _filteredCategories = computed(() => {
    const filter = this._allCategoriesFilter()?.trim()?.toLowerCase();
    if (filter && filter.length > 0) {
      return this._Categories().filter((u) =>
        u.name.toLowerCase().includes(filter)
      );
    }
    return this._Categories();
  });

  protected readonly _sharedCategories = computed(() => {
    return this._filteredCategories().filter((category) => category.isShared);
  });
  
  protected readonly _personalCategories = computed(() => {
    return this._filteredCategories().filter((category) => !category.isShared);
  });

  protected readonly _personalCategoriesFiltered = computed(() => {
    const filter = this._allCategoriesFilter()?.trim()?.toLowerCase();
    return this._personalCategoriesSorted().filter((category) =>
      category.name.toLowerCase().includes(filter)
    );
  });
  
  protected readonly _sharedCategoriesFiltered = computed(() => {
    const filter = this._allCategoriesFilter()?.trim()?.toLowerCase();
    return this._sharedCategoriesSorted().filter((category) =>
      category.name.toLowerCase().includes(filter)
    );
  });
  

  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedCategories = computed(() => {
    const sort = this._nameSort();
    const Categories = this._filteredCategories();
    if (!sort) {
      return Categories.slice(0, this._pageSize());
    }
    return [...Categories]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) *
          p1.name.localeCompare(p2.name, undefined, { sensitivity: 'base' })
      )
      .slice(0, this._pageSize());
  });

  protected readonly _personalCategoriesSorted = computed(() => {
    const sort = this._nameSort();
    const categories = this._personalCategories();
    if (!sort) {
      return categories;
    }
    return [...categories].sort(
      (a, b) =>
        (sort === 'ASC' ? 1 : -1) *
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  });
  
  protected readonly _sharedCategoriesSorted = computed(() => {
    const sort = this._nameSort();
    const categories = this._sharedCategories();
    if (!sort) {
      return categories;
    }
    return [...categories].sort(
      (a, b) =>
        (sort === 'ASC' ? 1 : -1) *
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  });

  protected readonly _trackBy: TrackByFunction<Category> = (
    _: number,
    p: Category
  ) => p.id;
  protected readonly _totalElements = computed(
    () => this._filteredCategories().length
  );

  constructor() {
    effect(() => this._allCategoriesFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected handleNameSortChange() {
    const sort = this._nameSort();
    if (sort === 'ASC') {
      this._nameSort.set('DESC');
    } else if (sort === 'DESC') {
      this._nameSort.set(null);
    } else {
      this._nameSort.set('ASC');
    }
  }
}
