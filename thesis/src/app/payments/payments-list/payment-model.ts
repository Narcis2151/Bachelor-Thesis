import Currency from '../../../../shared/account-currency';

type Payment = {
  _id?: string;
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
  account: string;
  category?: {
    _id: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
    isShared: boolean;
  } | string;
  isSelected?: boolean;
};
export default Payment;
