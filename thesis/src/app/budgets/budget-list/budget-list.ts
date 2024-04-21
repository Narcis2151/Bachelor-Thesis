import Currency from "../../../../shared/account-currency";
import Budget from "./budget/budget.model";

const BudgetData: Budget[] = [
  {
    id: '1',
    category: {
      id: '1',
      name: 'Home',
      icon: 'home',
      isShared: true,
    },
    amountAvailable: 2500,
    currency: Currency.RON,
    amountSpent: 2000,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31'),
    resetDate: new Date('2022-01-01'),
    active: true,
  },
  {
    id: '2',
    category: {
      id: '2',
      name: 'Groceries',
      icon: 'food',
      isShared: true,
    },
    amountAvailable: 1000,
    currency: Currency.RON,
    amountSpent: 800,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31'),
    resetDate: new Date('2022-01-01'),
    active: true,
  },
  {
    id: '3',
    category: {
      id: '3',
      name: 'Childcare',
      icon: 'child',
      isShared: false,
    },
    amountAvailable: 600,
    currency: Currency.RON,
    amountSpent: 500,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31'),
    resetDate: new Date('2022-01-01'),
    active: true,
  },
];

export default BudgetData;