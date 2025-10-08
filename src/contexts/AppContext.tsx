import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, User } from '@/lib/demoData';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AppContextType {
  user: User | null;
  session: Session | null;
  transactions: Transaction[];
  budgets: Budget[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      setUser({
        username: profile.username,
        email: profile.email,
        password: ''
      });
    }
  };

  const fetchTransactions = async (userId: string) => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (data) {
      setTransactions(data.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        description: t.description,
        category: t.category,
        type: t.type as 'income' | 'expense',
        date: t.date
      })));
    }
  };

  const fetchBudgets = async (userId: string) => {
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (data) {
      setBudgets(data.map(b => ({
        id: b.id,
        category: b.category,
        limit: Number(b.limit_amount),
        spent: Number(b.spent),
        period: b.period
      })));
    }
  };

  const refreshData = async () => {
    if (session?.user) {
      await Promise.all([
        fetchUserData(session.user.id),
        fetchTransactions(session.user.id),
        fetchBudgets(session.user.id)
      ]);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
            fetchTransactions(currentSession.user.id);
            fetchBudgets(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setTransactions([]);
          setBudgets([]);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
        fetchTransactions(currentSession.user.id);
        fetchBudgets(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signup = async (username: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    setTransactions([]);
    setBudgets([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        transactions,
        budgets,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        refreshData,
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
