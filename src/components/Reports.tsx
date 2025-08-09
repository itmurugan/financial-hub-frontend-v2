import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';
import { categories } from '../data/sampleData';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCategories] = useState<string[]>([]);

  const filteredTransactions = transactions.filter(t => {
    const inDateRange = t.date >= startDate && t.date <= endDate;
    const inCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category);
    return inDateRange && inCategory;
  });

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const now = new Date();
    switch (range) {
      case 'week':
        setStartDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        break;
      case 'month':
        setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
        break;
      case 'quarter':
        setStartDate(new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1));
        break;
      case 'year':
        setStartDate(new Date(now.getFullYear(), 0, 1));
        break;
    }
    setEndDate(now);
  };

  const categoryBreakdown = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: parseFloat(amount.toFixed(2)),
    color: categories.find(c => c.name === category)?.color || '#gray'
  }));

  const monthlyTrend = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthTransactions = transactions.filter(t => 
      t.date.getMonth() === date.getMonth() && 
      t.date.getFullYear() === date.getFullYear()
    );
    
    monthlyTrend.push({
      month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      savings: 0
    });
    
    monthlyTrend[monthlyTrend.length - 1].savings = 
      monthlyTrend[monthlyTrend.length - 1].income - monthlyTrend[monthlyTrend.length - 1].expenses;
  }

  const topExpenses = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...filteredTransactions.map(t => [
        t.date.toLocaleDateString(),
        t.description,
        t.category,
        t.type,
        t.amount.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year'].map(range => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  dateRange === range 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Income</p>
                <p className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">${totalExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Net Savings</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">12-Month Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topExpenses} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Bar dataKey="amount" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Spending Patterns</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Average Daily Spending</p>
              <p className="text-xl font-bold text-gray-800">
                ${(totalExpenses / Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Most Expensive Category</p>
              <p className="text-xl font-bold text-gray-800">
                {topExpenses[0]?.category || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Savings Rate</p>
              <p className="text-xl font-bold text-gray-800">
                {totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
              <p className="text-xl font-bold text-gray-800">
                {filteredTransactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;