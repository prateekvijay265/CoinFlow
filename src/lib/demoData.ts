export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface User {
  username: string;
  email: string;
  password: string;
}

export const categoryIcons: Record<string, string> = {
  'Food': '🍔',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Bills': '💡',
  'Entertainment': '🎮',
  'Health': '🏥',
  'Salary': '💼',
  'Freelance': '💻',
  'Investment': '📈',
  'Gift': '🎁',
};

export const demoTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 3500, description: 'Monthly Salary', category: 'Salary', date: '2025-10-01' },
  { id: '2', type: 'expense', amount: 45.50, description: 'Grocery Shopping', category: 'Food', date: '2025-10-02' },
  { id: '3', type: 'expense', amount: 12.99, description: 'Netflix Subscription', category: 'Entertainment', date: '2025-10-02' },
  { id: '4', type: 'expense', amount: 85.00, description: 'Gas Station', category: 'Transport', date: '2025-10-03' },
  { id: '5', type: 'expense', amount: 120.00, description: 'Electricity Bill', category: 'Bills', date: '2025-10-03' },
  { id: '6', type: 'income', amount: 500, description: 'Freelance Project', category: 'Freelance', date: '2025-10-04' },
  { id: '7', type: 'expense', amount: 65.75, description: 'Restaurant Dinner', category: 'Food', date: '2025-10-04' },
  { id: '8', type: 'expense', amount: 199.99, description: 'New Headphones', category: 'Shopping', date: '2025-10-05' },
  { id: '9', type: 'expense', amount: 25.00, description: 'Coffee Shop', category: 'Food', date: '2025-10-05' },
  { id: '10', type: 'expense', amount: 50.00, description: 'Uber Rides', category: 'Transport', date: '2025-10-06' },
  { id: '11', type: 'expense', amount: 89.99, description: 'Gym Membership', category: 'Health', date: '2025-10-06' },
  { id: '12', type: 'expense', amount: 35.50, description: 'Fast Food', category: 'Food', date: '2025-10-07' },
  { id: '13', type: 'income', amount: 200, description: 'Investment Returns', category: 'Investment', date: '2025-10-07' },
  { id: '14', type: 'expense', amount: 150.00, description: 'New Shoes', category: 'Shopping', date: '2025-10-08' },
  { id: '15', type: 'expense', amount: 75.00, description: 'Internet Bill', category: 'Bills', date: '2025-10-08' },
  { id: '16', type: 'expense', amount: 40.00, description: 'Movie Tickets', category: 'Entertainment', date: '2025-10-08' },
  { id: '17', type: 'expense', amount: 55.25, description: 'Groceries', category: 'Food', date: '2025-10-08' },
  { id: '18', type: 'expense', amount: 30.00, description: 'Parking', category: 'Transport', date: '2025-10-08' },
  { id: '19', type: 'income', amount: 100, description: 'Birthday Gift', category: 'Gift', date: '2025-10-08' },
  { id: '20', type: 'expense', amount: 95.00, description: 'Doctor Visit', category: 'Health', date: '2025-10-08' },
];

export const demoBudgets: Budget[] = [
  { id: '1', category: 'Food', limit: 500, spent: 222.00 },
  { id: '2', category: 'Transport', limit: 200, spent: 165.00 },
  { id: '3', category: 'Shopping', limit: 300, spent: 349.99 },
  { id: '4', category: 'Entertainment', limit: 150, spent: 52.99 },
];

export const demoUser: User = {
  username: 'demo_user',
  email: 'demo@coinflow.app',
  password: 'demo123',
};
