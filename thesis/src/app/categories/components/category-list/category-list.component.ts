import {
  Component,
  TrackByFunction,
  computed,
  effect,
  signal,
  OnInit,
  ViewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, forkJoin } from 'rxjs';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmAlertDialogComponent } from '@spartan-ng/ui-alertdialog-helm';

import Category from './category.model';
import { CategoriesService } from '../../services/categories.service';
import { CreatePartnershipDto, PartnershipsService } from '../../services/partnerships.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  protected partnershipStatus: string | null = null;
  protected partnerEmail = '';
  protected partnerName: string | null = null;
  protected partnershipError: string | null = null;
  protected categoryError: string | null = null;
  protected addedCategories: Category[] = [];
  protected removedCategories: Category[] = [];
  protected allCategories: Category[] = [];
  protected otherCategories: Category[] = [];
  protected availableIcons: string[] = [];
  protected selectedCategory!: Category;
  protected selectedCategoryReplacement!: Category;
  protected newCategory: Category = {
    name: '',
    icon: this.availableIcons[0],
    type: 'expense',
  };

  ngOnInit() {
    this.loadCategories();
    this.fetchCategoryIcons();
  }

  @ViewChild('invitedDialog') invitedDialog!: HlmAlertDialogComponent;

  protected loadCategories() {
    forkJoin({
      categories: this.categoriesService.getCategories(),
      partnership: this.partnershipsService.findPartnership(),
    }).subscribe(({ categories, partnership }) => {
      this.partnershipStatus = partnership.partnershipStatus;
      this.partnerName = partnership.partnerName;
      this.allCategories = categories;
      this._Categories.set(this.allCategories);
      this.addedCategories = categories.filter(
        (category) => category.isPending && category.isShared
      );
      this.removedCategories = categories.filter(
        (category) => category.isPending && !category.isShared
      );
      this.resetCategory();
      if (this.partnershipStatus === 'invited') {
        setTimeout(() => {
          this.invitedDialog.open();
        }, 0);
      }
    });
  }

  protected toggleEditName(category: Category): void {
    category.isEditing = !category.isEditing;
  }

  protected saveCategoryName(category: Category): void {
    this.categoriesService.updateCategoryName(category).subscribe({
      next: (updatedCategory) => {
        const index = this.allCategories.findIndex(
          (t) => t._id === updatedCategory._id
        );
        if (index > -1) {
          this.allCategories[index] = { ...updatedCategory };
          this._Categories.set([...this.allCategories]);
        }
      },
    });
  }

  protected addCategory(ctx: any) {
    this.categoriesService.addCategory(this.newCategory).subscribe({
      next: (category) => {
        this.allCategories.push(category);
        this._Categories.set([
          ...this.allCategories.sort((a, b) =>
            a._id && b._id ? b._id.localeCompare(a._id) : 0
          ),
        ]);
        this.fetchCategoryIcons();
        this.resetCategory();
        this.categoryError = null;
        ctx.close();
      },
      error: (error) => {
        console.error('Create category failed', error);
        if (error.status === 400) {
          this.categoryError = error.error.message;
        } else {
          this.categoryError =
            error.error.message || 'An error occurred. Please try again later.';
        }
      },
    });
  }

  protected resetCategory() {
    this.newCategory = {
      name: '',
      icon: this.availableIcons[0],
      type: 'expense',
    };
  }

  protected selectCategory(category: Category) {
    this.selectedCategory = { ...category };
    this.fetchCategoryIcons();
    this.otherCategories = this.allCategories.filter(
      (c) => c._id !== category._id
    );
  }

  protected updateShareCategory() {
    if (this.selectedCategory) {
      this.categoriesService
        .updateCategoryShareStatus(this.selectedCategory)
        .subscribe({
          next: (updatedCategory) => {
            const index = this.allCategories.findIndex(
              (t) => t._id === updatedCategory._id
            );
            if (index > -1) {
              this.allCategories[index] = { ...updatedCategory };
              this._Categories.set([...this.allCategories]);
            }
          },
        });
    }
  }

  protected deleteCategory() {
    if (this.selectedCategory && this.selectedCategory._id) {
      this.categoriesService
        .deleteCategory(
          this.selectedCategory._id,
          this.selectedCategoryReplacement._id!
        )
        .subscribe({
          next: () => {
            this.allCategories = this.allCategories.filter(
              (t) => t._id !== this.selectedCategory!._id
            );
            this._Categories.set([
              ...this.allCategories.sort((a, b) =>
                a._id && b._id ? b._id.localeCompare(a._id) : 0
              ),
            ]);
            this.fetchCategoryIcons();
          },
        });
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _allCategoriesFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );
  protected readonly _pageSize = signal(10000);
  protected _allCategories = signal(this.allCategories);
  protected _AvailableIcons = signal(this.availableIcons);

  protected readonly _brnColumnManager = useBrnColumnManager({
    icon: { visible: true, label: 'icon' },
    name: { visible: true, label: 'name' },
    isShared: { visible: true, label: 'isShared' },
    isPending: { visible: false, label: 'isPending' },
    isEditing: { visible: false, label: 'isEditing' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  protected _Categories = signal(this.allCategories);

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
    const categories = this._filteredCategories();
    if (!sort) {
      return categories.slice(0, this._pageSize());
    }
    return [...categories]
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
  ) => p._id;

  protected readonly _totalElements = computed(
    () => this._filteredCategories().length
  );

  constructor(private categoriesService: CategoriesService, private partnershipsService: PartnershipsService) {
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

  protected _hasSharedCategories = computed(() => {
    const categories = this._Categories();
    return categories.some((category) => category.isShared);
  });

  protected createPartnership(ctx: any) {
    if (this.emailIsValid()) {
      const createPartnershipDto: CreatePartnershipDto = {
        partnerEmail: this.partnerEmail,
        sharedCategories: this.allCategories
          .filter((category) => category.isSelected)
          .map((category) => category._id)
          .filter((id) => id !== undefined)
          .map((id) => id as string),
      };
      this.partnershipsService.createPartnership(createPartnershipDto).subscribe({
        next: (response) => {
          this.partnershipStatus = response.partnershipStatus;
          this.partnerEmail = '';
          this.loadCategories();
          ctx.close();
          this.partnershipError = null;
        },
        error: (error) => {
          console.error('Create partnership failed', error);
          if (error.status === 400) {
            this.partnershipError = error.error.message;
          } else {
            this.partnershipError =
              error.error.message ||
              'An error occurred. Please try again later.';
          }
        },
      });
    }
  }

  protected acceptPartnershipChanges() {
    this.partnershipsService.acceptPartnershipChanges().subscribe({
      next: () => {
        this.loadCategories();
      },
    });
  }

  protected rejectPartnershipChanges() {
    this.partnershipsService.rejectPartnershipChanges().subscribe({
      next: () => {
        this.loadCategories();
      },
    });
  }

  protected deletePartnership() {
    this.partnershipsService.deletePartnership().subscribe({
      next: () => {
        this.partnershipStatus = null;
        this.loadCategories();
      },
    });
  }

  protected emailIsValid(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(this.partnerEmail);
  }

  protected fetchCategoryIcons() {
    this.categoriesService.getCategoryIcons().subscribe({
      next: (icons) => {
        this.availableIcons = icons;
        this._AvailableIcons.set(icons);
      },
    });
  }

  protected updateCategoryIcon(category: Category, icon: string) {
    this.categoriesService.updateCategoryIcon(category, icon).subscribe({
      next: (updatedCategory) => {
        const index = this.allCategories.findIndex(
          (t) => t._id === updatedCategory._id
        );
        if (index > -1) {
          this.allCategories[index] = { ...updatedCategory };
          this._Categories.set([...this.allCategories]);
        }
        this.fetchCategoryIcons();
      },
    });
  }
}
