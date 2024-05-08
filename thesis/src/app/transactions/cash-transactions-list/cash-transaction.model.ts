import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';

type CashTransaction = {
  _id?: string;
  type: 'expense' | 'income';
  beneficiary: string;
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date | string;  
  category: Category;
};

export default CashTransaction;