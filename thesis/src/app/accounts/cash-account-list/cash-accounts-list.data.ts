import Currency from '../../../../shared/account-currency';
import CashAccount from './cash-account.model';

const cashAccounts: CashAccount[] = [
  {
    _id: '1',
    name: 'Personal',
    currency: Currency.RON,
    balance: 1000,
    balanceUpdatedAt: new Date('2024-05-01'),
  },
  {
    _id: '2',
    name: 'Savings',
    currency: Currency.EUR,
    balance: 2000,
    balanceUpdatedAt: new Date('2024-05-01'),
  },
];

export default cashAccounts;
