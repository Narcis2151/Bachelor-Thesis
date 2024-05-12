import Currency from '../../../../shared/account-currency';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';
import Category from '../../categories/category-list/category.model';

type CashFuturePayment = {
  _id?: string;
  beneficiary: string;
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date | string;
  account: CashAccount;
  category: Category;
  isSelected?: boolean;
};
export default CashFuturePayment;
