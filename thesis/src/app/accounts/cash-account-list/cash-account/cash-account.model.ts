import Currency from "../../../../../shared/account-currency";

type CashAccount = {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  balanceUpdatedAt: Date;
  isEditing?: boolean;
};

export default CashAccount;
