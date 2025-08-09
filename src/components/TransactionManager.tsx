import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Check, X, Search } from 'lucide-react';
import { Transaction } from '../types';
import { categories } from '../data/sampleData';

interface TransactionManagerProps {
  transactions: Transaction[];
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddTransaction: (transaction: Transaction) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
  onAddTransaction,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date(),
    description: '',
    amount: 0,
    category: 'Other Expense',
    type: 'expense',
    source: 'manual',
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.merchant?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const saveEdit = () => {
    if (editForm && editingId) {
      onUpdateTransaction(editForm as Transaction);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      id: `manual-${Date.now()}`,
      date: newTransaction.date || new Date(),
      description: newTransaction.description || '',
      amount: newTransaction.amount || 0,
      category: newTransaction.category || 'Other Expense',
      type: newTransaction.type || 'expense',
      source: 'manual',
    };
    onAddTransaction(transaction);
    setShowAddForm(false);
    setNewTransaction({
      date: new Date(),
      description: '',
      amount: 0,
      category: 'Other Expense',
      type: 'expense',
      source: 'manual',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Transaction Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={newTransaction.date?.toISOString().split('T')[0]}
              onChange={(e) => setNewTransaction({...newTransaction, date: new Date(e.target.value)})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense'})}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddTransaction}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Transaction
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.slice(0, 20).map(transaction => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === transaction.id ? (
                    <input
                      type="date"
                      value={editForm.date?.toISOString().split('T')[0]}
                      onChange={(e) => setEditForm({...editForm, date: new Date(e.target.value)})}
                      className="px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    transaction.date.toLocaleDateString()
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === transaction.id ? (
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    transaction.description
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === transaction.id ? (
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="px-2 py-1 border border-gray-300 rounded"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{ 
                            backgroundColor: categories.find(c => c.name === transaction.category)?.color + '20',
                            color: categories.find(c => c.name === transaction.category)?.color 
                          }}>
                      {transaction.category}
                    </span>
                  )}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {editingId === transaction.id ? (
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                      className="px-2 py-1 border border-gray-300 rounded w-24"
                    />
                  ) : (
                    `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {transaction.source}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === transaction.id ? (
                    <div className="flex space-x-2">
                      <button onClick={saveEdit} className="text-green-600 hover:text-green-900">
                        <Check className="h-5 w-5" />
                      </button>
                      <button onClick={cancelEdit} className="text-red-600 hover:text-red-900">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button onClick={() => startEdit(transaction)} className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => onDeleteTransaction(transaction.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionManager;