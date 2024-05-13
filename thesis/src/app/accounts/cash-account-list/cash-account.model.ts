import Currency from "../../../../shared/account-currency";

type CashAccount = {
  _id?: string;
  name: string;
  balance: number;
  currency: Currency;
  balanceUpdatedAt?: Date;
  balanceEquivalent?: number;
  isEditing?: boolean;
};

export default CashAccount;
