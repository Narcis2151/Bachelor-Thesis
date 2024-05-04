import icons from '../../../../shared/icons/icons.names';
import Category from './category.model';

export const categories: Category[] = [
  {
    _id: '1',
    name: 'Home',
    icon: icons.lucideHome,
    isShared: true,
  },
  {
    _id: '2',
    name: 'Food',
    icon: icons.lucidePizza,
    isShared: false,
  },
  {
    _id: '3',
    name: 'Transport',
    icon: icons.lucideCar,
    isShared: false,
  },
  {
    _id: '4',
    name: 'Shopping',
    icon: icons.lucideShoppingCart,
    isShared: false,
  },
  {
    _id: '5',
    name: 'Health',
    icon: icons.lucideHeartPulse,
    isShared: true,
  },
  {
    _id: '6',
    name: 'Entertainment',
    icon: icons.lucideClapperboard,
    isShared: false,
  },
  {
    _id: '7',
    name: 'Education',
    icon: icons.lucideBookOpen,
    isShared: false,
  },
  {
    _id: '8',
    name: 'Other',
    icon: icons.lucideCircleEllipsis,
    isShared: false,
  },
  {
    _id: '9',
    name: 'Salary',
    icon: icons.lucideBanknote,
    isShared: false,
  },
  {
    _id: '10',
    name: 'Investments',
    icon: icons.lucideBadgeDollarSign,
    isShared: false,
  },
  {
    _id: '11',
    name: 'Subscriptions',
    icon: icons.lucidePodcast,
    isShared: true,
  }
];
