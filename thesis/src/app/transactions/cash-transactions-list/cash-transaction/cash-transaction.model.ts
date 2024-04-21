import Currency from '../../../../../shared/account-currency';

type CashTransaction = {
  id: string;
  type: 'expense' | 'income';
  beneficiary: string;
  details: string;
  amount: number;
  currency: Currency;
  postingDate: Date;
  category: {
    id: string;
    name: string;
    icon: string;
  }
  status: 'pending' | 'processing' | 'success' | 'failed';
};

export default CashTransaction;