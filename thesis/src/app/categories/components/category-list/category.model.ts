type Category = {
  _id?: string;
  name: string;
  icon: string;
  type?: 'income' | 'expense';
  isPending?: boolean;
  isShared?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
};

export default Category;
