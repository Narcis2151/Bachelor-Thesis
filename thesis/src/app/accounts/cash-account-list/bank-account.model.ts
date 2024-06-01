import Currency from "../../../../shared/account-currency";
import Requisition from "./requisition.model";

type BankAccount = {
  _id?: string;
  name: string;
  requisition: Requisition;
  balance: number;
  currency: Currency;
  balanceUpdatedAt: Date;
  balanceEquivalent?: number;
};

export default BankAccount;
