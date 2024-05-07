import Currency from '../../../../shared/account-currency';
import CashAccount from '../../accounts/cash-account-list/cash-account.model';
import Category from '../../categories/category-list/category.model';

type FetchPayment = {
  _id: string;
  beneficiary: {
    name: string;
    account?: string;
  };
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date | string;
  isRecurrent: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  recurrenceStart?: Date;
  recurrenceEnd?: Date;
  account: CashAccount;
  category: Category;
}
export default FetchPayment;
