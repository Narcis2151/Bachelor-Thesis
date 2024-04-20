import Category from './category/category.model';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Home',
    icon: 'home',
    isShared: true,
  },
  {
    id: 2,
    name: 'Groceries',
    icon: 'food',
    isShared: false,
  },
  {
    id: 3,
    name: 'Childcare',
    icon: 'child',
    isShared: false,
  },
];
