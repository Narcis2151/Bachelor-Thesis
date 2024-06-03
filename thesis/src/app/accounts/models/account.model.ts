import Currency from "../../../../shared/account-currency";

type Account = {
  _id?: string;
  cashBank: 'cash' | 'bank';
  name: string;
  balance: number;
  currency: Currency;
  logo?: string;
  balanceUpdatedAt?: Date;
  balanceEquivalent?: number;
  isEditing?: boolean;
};

export default Account;
