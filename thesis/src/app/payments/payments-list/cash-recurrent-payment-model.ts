import Currency from '../../../../shared/account-currency';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';
import Category from '../../categories/category-list/category.model';

type CashRecurrentPayment = {
  _id?: string;
  beneficiary: string;
  details: string;
  amount: number;
  currency: Currency;
  recurrence: 'daily' | 'weekly' | 'monthly';
  recurrenceStart: Date | string;
  recurrenceEnd: Date | string;
  account: CashAccount;
  category: Category;
  isSelected?: boolean;
  nextPaymentDate?: Date | string;
};
export default CashRecurrentPayment;
