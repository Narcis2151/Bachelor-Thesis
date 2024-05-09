import Currency from '../../../../shared/account-currency';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';
import Category from '../../categories/category-list/category.model';

type CashTransaction = {
  _id?: string;
  type: 'expense' | 'income';
  beneficiary: string;
  details: string;
  amount: number;
  currency?: Currency;
  postingDate: Date | string;  
  category: Category;
  account: CashAccount;
};

export default CashTransaction;