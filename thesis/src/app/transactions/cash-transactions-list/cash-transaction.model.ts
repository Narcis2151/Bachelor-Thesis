import Currency from '../../../../shared/account-currency';
import Category from '../../categories/category-list/category.model';
type CashTransaction = {
  id: string;
  type: 'expense' | 'income';
  beneficiary: string;
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date | string;  
  category: Category;
  status: 'pending' | 'processing' | 'success' | 'failed';
};

export default CashTransaction;