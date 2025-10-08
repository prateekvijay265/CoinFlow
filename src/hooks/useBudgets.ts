import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export const useBudgets = () => {
  const { session, refreshData } = useApp();
  const { toast } = useToast();

  const addBudget = async (budget: {
    category: string;
    limit: number;
    period: string;
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
      .from('budgets')
      .insert({
        user_id: session.user.id,
        category: budget.category,
        limit_amount: budget.limit,
        period: budget.period,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add budget',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Budget created successfully',
    });

    await refreshData();
  };

  return { addBudget };
};
