import CashAccount from './cash-account/cash-account.model';
import Currency from '../../../../shared/account-currency';

export const cashAccounts: CashAccount[] = [
  {
    id: '1',
    name: 'Cont Curent',
    balance: 1000,
    currency: Currency.RON,
    balanceUpdatedAt: new Date('2024-04-15'),
  },
  {
    id: '2',
    name: 'Cont Economii',
    balance: 2000,
    currency: Currency.RON,
    balanceUpdatedAt: new Date('2021-04-10'),
  },
  {
    id: '3',
    name: 'Cont Depozit',
    balance: 3000,
    currency: Currency.EUR,
    balanceUpdatedAt: new Date('2022-04-05'),
  },
];
