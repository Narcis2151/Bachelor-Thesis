type Notification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  redirectPage:
    | 'dashboard'
    | 'transactions'
    | 'budgets'
    | 'categories'
    | 'accounts';
};

export default Notification;
