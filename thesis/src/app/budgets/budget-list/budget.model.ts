import Currency from "../../../../shared/account-currency";
import Category from "../../categories/category-list/category.model";  

type Budget = {
  _id?: string;
  category: Category;
  amountAvailable: number;
  currency: Currency;
  userSpentAmount: number;
  partnerSpentAmount: number;
  startDate: Date | string;
  resetDate: Date | string;
};

export default Budget;
