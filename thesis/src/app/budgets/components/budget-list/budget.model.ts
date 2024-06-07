import Currency from "../../../../../shared/account-currency";
import Category from "../../../categories/components/category-list/category.model";  

type Budget = {
  _id?: string;
  category: Category;
  amountAvailable: number;
  amountAvailableEquivalent?: number;
  currency: Currency;
  exchangeRate?: number;
  userSpentAmount?: number;
  partnerSpentAmount?: number;
  startDate: Date | string;
  resetDate: Date | string;
  active?: boolean;
};

export default Budget;
