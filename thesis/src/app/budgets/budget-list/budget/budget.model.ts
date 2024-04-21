import Currency from "../../../../../shared/account-currency";

type Budget = {
  id: string;
  category: {
    id: string;
    name: string;
    icon: string;
  }
  amount: number;
  currency: Currency;
  amountSpent: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
};

export default Budget;
