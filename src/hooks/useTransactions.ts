import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  const { session, refreshData } = useApp();
  const { toast } = useToast();

  const addTransaction = async (transaction: {
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    date: string;
  }) => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: session.user.id,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Transaction added successfully',
    });

    await refreshData();
  };

  return { addTransaction };
};
