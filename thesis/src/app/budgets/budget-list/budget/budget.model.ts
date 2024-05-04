import Currency from "../../../../../shared/account-currency";
import Category from "../../../categories/category-list/category.model";  

type Budget = {
  id: string;
  category: Category;
  amountAvailable: number;
  currency: Currency;
  amountSpent: number;
  progress?: number;
  startDate: Date;
  endDate?: Date;
  resetDate?: Date;
  active: boolean;
};

export default Budget;
