import Currency from '../../../../shared/account-currency';

type CreatePayment = {
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
  accountId: string
  categoryId: string;
  isSelected?: boolean;
};
export default CreatePayment;
