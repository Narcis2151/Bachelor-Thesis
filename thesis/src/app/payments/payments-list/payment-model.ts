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
  postingDate: Date;
  isRecurrence: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  recurrenceStart?: Date;
  recurrenceEnd?: Date;
  account: string;
};
export default Payment;
