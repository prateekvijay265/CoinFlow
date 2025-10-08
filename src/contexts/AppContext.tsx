import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, User, demoTransactions, demoBudgets, demoUser } from '@/lib/demoData';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (username: string, email: string, password: string) => void;
  logout: () => void;
  loadDemoData: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string): boolean => {
    if (email === demoUser.email && password === demoUser.password) {
      setUser(demoUser);
      setIsAuthenticated(true);
      return true;
    }
    
    const storedUser = localStorage.getItem('coinflowUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      if (parsedUser.email === email && parsedUser.password === password) {
        setUser(parsedUser);
        setIsAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const signup = (username: string, email: string, password: string) => {
    const newUser: User = { username, email, password };
    localStorage.setItem('coinflowUser', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTransactions([]);
    setBudgets([]);
  };

  const loadDemoData = () => {
    setTransactions(demoTransactions);
    setBudgets(demoBudgets);
    setUser(demoUser);
    setIsAuthenticated(true);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        budgets,
        isAuthenticated,
        login,
        signup,
        logout,
        loadDemoData,
        addTransaction,
        addBudget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
