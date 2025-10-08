import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';
import AddBudgetModal from './AddBudgetModal';
import { categoryIcons } from '@/lib/demoData';

const Budgets = () => {
  const { budgets } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { color: 'bg-expense', text: 'Over budget', textColor: 'text-expense' };
    if (percentage >= 80) return { color: 'bg-amber-500', text: 'Approaching limit', textColor: 'text-amber-600' };
    return { color: 'bg-income', text: 'On track', textColor: 'text-income' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Track and manage your spending limits</p>
        </div>
        <Button
          className="gradient-primary text-white hover:opacity-90"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card className="hover-lift">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-6xl mb-4">🎯</p>
            <p className="text-xl font-medium mb-2">No budgets yet</p>
            <p className="text-muted-foreground mb-4">Create your first budget to start tracking</p>
            <Button
              className="gradient-primary text-white hover:opacity-90"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget, index) => {
            const status = getBudgetStatus(budget.spent, budget.limit);
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);

            return (
              <Card key={budget.id} className="hover-lift animate-entrance" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcons[budget.category] || '💰'}</span>
                    <span>{budget.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${status.textColor}`}>
                      {status.text}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${(budget.limit - budget.spent).toFixed(2)} remaining
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Budgets;
