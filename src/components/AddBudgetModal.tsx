import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryIcons } from '@/lib/demoData';
import { useToast } from '@/hooks/use-toast';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBudgetModal = ({ isOpen, onClose }: AddBudgetModalProps) => {
  const { addBudget, budgets } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
  });

  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health'];
  const availableCategories = expenseCategories.filter(
    cat => !budgets.some(b => b.category === cat)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    addBudget({
      category: formData.category,
      limit: parseFloat(formData.limit),
    });

    toast({
      title: 'Success!',
      description: 'Budget created successfully',
    });

    setFormData({
      category: '',
      limit: '',
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>
            Set a spending limit for a category
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    All categories have budgets
                  </SelectItem>
                ) : (
                  availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <span className="flex items-center gap-2">
                        <span>{categoryIcons[category]}</span>
                        <span>{category}</span>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit ($)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              placeholder="500.00"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-primary text-white hover:opacity-90"
              disabled={availableCategories.length === 0}
            >
              Create Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetModal;
