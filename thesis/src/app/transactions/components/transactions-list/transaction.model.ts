import Currency from '../../../../../shared/account-currency';
import CashAccount from '../../../accounts/models/account.model';
import Category from '../../../categories/components/category-list/category.model';

type Transaction = {
  _id?: string;
  type: 'expense' | 'income';
  beneficiary: string;
  details: string;
  amount: number;
  currency?: Currency;
  postingDate: Date | string;
  category?: Category;
  isTransfer?: boolean;
  cashBank: 'cash' | 'bank';
  account: CashAccount;
  amountEquivalent?: number;
};

export default Transaction;
