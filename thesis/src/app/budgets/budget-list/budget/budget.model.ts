import Currency from "../../../../../shared/account-currency";

type Budget = {
  id: string;
  category: {
    id: string;
    name: string;
    icon: string;
    isShared: boolean;
  }
  amountAvailable: number;
  currency: Currency;
  amountSpent: number;
  startDate: Date;
  endDate: Date;
  resetDate?: Date;
  active: boolean;
};

export default Budget;
