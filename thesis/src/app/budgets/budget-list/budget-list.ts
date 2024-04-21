import Currency from "../../../../shared/account-currency";
import Budget from "./budget/budget.model";

const BudgetData: Budget[] = [
  {
    id: '1',
    category: {
      id: '1',
      name: 'Home',
      icon: 'home',
    },
    amount: 2500,
    currency: Currency.RON,
    amountSpent: 2000,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31'),
    active: true,
  },
  {
    id: '2',
    category: {
      id: '2',
      name: 'Groceries',
      icon: 'food',
    },
    amount: 1000,
    currency: Currency.RON,
    amountSpent: 800,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31'),
    active: true,
  },
  {
    id: '3',
    category: {
      id: '3',
      name: 'Childcare',
      icon: 'child',
    },
    amount: 600,
    currency: Currency.RON,
    amountSpent: 500,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-12-31'),
    active: true,
  },
];

export default BudgetData;