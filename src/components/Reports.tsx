import { useMemo, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Reports = () => {
  const { transactions } = useApp();
  const [dateRange, setDateRange] = useState('30');

  const chartData = useMemo(() => {
    const days = parseInt(dateRange);
    const data: Record<string, { date: string; income: number; expenses: number }> = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd');
      data[date] = { date, income: 0, expenses: 0 };
    }

    transactions.forEach(transaction => {
      const transactionDate = startOfDay(new Date(transaction.date));
      const today = startOfDay(new Date());
      const daysAgo = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysAgo < days && daysAgo >= 0) {
        const dateKey = format(transactionDate, 'MMM dd');
        if (data[dateKey]) {
          if (transaction.type === 'income') {
            data[dateKey].income += transaction.amount;
          } else {
            data[dateKey].expenses += transaction.amount;
          }
        }
      }
    });

    return Object.values(data);
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expenses: acc.expenses + day.expenses,
      }),
      { income: 0, expenses: 0 }
    );
  }, [chartData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Analyze your income and expenses over time</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover-lift gradient-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">${totals.income.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last {dateRange} days</p>
          </CardContent>
        </Card>

        <Card className="hover-lift gradient-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">${totals.expenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last {dateRange} days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--income))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--income))' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--expense))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--expense))' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-4xl mb-2">📊</p>
                <p>No data available for the selected period</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
