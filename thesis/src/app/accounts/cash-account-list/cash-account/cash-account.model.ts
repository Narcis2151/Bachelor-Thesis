import Currency from "../../../../../shared/account-currency";

type CashAccount = {
  id: number;
  name: string;
  balance: number;
  currency: Currency;
  balanceUpdatedAt: Date;
};

export default CashAccount;
