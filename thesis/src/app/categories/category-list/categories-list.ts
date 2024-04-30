import icons from '../../common/icons/icons.names';
import Category from './category/category.model';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Home',
    icon: icons.lucideHome,
    isShared: true,
  },
  {
    id: '2',
    name: 'Food',
    icon: icons.lucidePizza,
    isShared: false,
  },
  {
    id: '3',
    name: 'Transport',
    icon: icons.lucideCar,
    isShared: false,
  },
  {
    id: '4',
    name: 'Shopping',
    icon: icons.lucideShoppingCart,
    isShared: false,
  },
  {
    id: '5',
    name: 'Health',
    icon: icons.lucideHeartPulse,
    isShared: true,
  },
  {
    id: '6',
    name: 'Entertainment',
    icon: icons.lucideClapperboard,
    isShared: false,
  },
  {
    id: '7',
    name: 'Education',
    icon: icons.lucideBookOpen,
    isShared: false,
  },
  {
    id: '8',
    name: 'Other',
    icon: icons.lucideCircleEllipsis,
    isShared: false,
  },
  {
    id: '9',
    name: 'Salary',
    icon: icons.lucideBanknote,
    isShared: false,
  },
  {
    id: '10',
    name: 'Investments',
    icon: icons.lucideBadgeDollarSign,
    isShared: false,
  },
  {
    id: '11',
    name: 'Subscriptions',
    icon: icons.lucidePodcast,
    isShared: true,
  }
];
