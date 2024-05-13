type Category = {
  _id?: string;
  name: string;
  icon: string;
  type?: 'income' | 'expense';
  isShared?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
};

export default Category;
