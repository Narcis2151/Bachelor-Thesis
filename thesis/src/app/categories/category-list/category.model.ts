type Category = {
  _id?: string;
  name: string;
  icon: string;
  type?: 'income' | 'expense';
  userSpentAmount?: number;
  userReceivedAmount?: number;
  isPending?: boolean;
  isShared?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
};

export default Category;
