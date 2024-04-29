import Category from './category/category.model';
export const categories: Category[] = [
  {
    id: "1",
    name: 'Home',
    icon: 'lucideHome',
    isShared: true,
  },
  {
    id: "2",
    name: 'Food',
    icon: 'lucidePizza',
    isShared: false,
  },
  {
    id: "3",
    name: 'Transport',
    icon: 'lucideCar',
    isShared: false,
  },
  {
    id: "4",
    name: 'Shopping',
    icon: 'lucideShoppingCart',
    isShared: false,
  },
  {
    id: "5",
    name: 'Health',
    icon: 'lucideHeartPulse',
    isShared: true,
  },
  {
    id: "6",
    name: 'Entertainment',
    icon: 'lucideClapperboard',
    isShared: false,
  },
  {
    id: "7",
    name: 'Education',
    icon: 'lucideBookOpen',
    isShared: false,
  },
  {
    id: "8",
    name: 'Other',
    icon: 'lucideCircleEllipsis',
    isShared: false,
  },
];
