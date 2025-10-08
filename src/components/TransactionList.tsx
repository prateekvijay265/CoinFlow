import { Transaction, categoryIcons } from '@/lib/demoData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-4xl mb-2">📝</p>
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {transactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors animate-entrance"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-income-light' : 'bg-expense-light'}`}>
              {transaction.type === 'income' ? (
                <ArrowUpRight className="w-4 h-4 text-income" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-expense" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{categoryIcons[transaction.category] || '💰'}</span>
                <p className="font-medium">{transaction.description}</p>
              </div>
              <p className="text-xs text-muted-foreground">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
            </div>
          </div>
          <div className={`font-semibold ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
