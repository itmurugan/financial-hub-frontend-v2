import { Transaction, Category, UploadedFile } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Groceries', color: '#10b981', type: 'expense' },
  { id: '2', name: 'Transportation', color: '#3b82f6', type: 'expense' },
  { id: '3', name: 'Entertainment', color: '#8b5cf6', type: 'expense' },
  { id: '4', name: 'Bills & Utilities', color: '#ef4444', type: 'expense' },
  { id: '5', name: 'Shopping', color: '#f59e0b', type: 'expense' },
  { id: '6', name: 'Dining Out', color: '#ec4899', type: 'expense' },
  { id: '7', name: 'Healthcare', color: '#06b6d4', type: 'expense' },
  { id: '8', name: 'Education', color: '#6366f1', type: 'expense' },
  { id: '9', name: 'Travel', color: '#84cc16', type: 'expense' },
  { id: '10', name: 'Salary', color: '#22c55e', type: 'income' },
  { id: '11', name: 'Freelance', color: '#14b8a6', type: 'income' },
  { id: '12', name: 'Investments', color: '#0ea5e9', type: 'income' },
  { id: '13', name: 'Other Income', color: '#10b981', type: 'income' },
  { id: '14', name: 'Other Expense', color: '#64748b', type: 'expense' },
];

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const currentDate = new Date();
  
  const merchants = {
    'Groceries': ['Whole Foods Market', 'Safeway Store #1802', 'Trader Joe\'s', 'Kroger', 'Target Grocery'],
    'Transportation': ['UBER TRIP HELP.UBER.COM', 'LYFT RIDE', 'Shell Gas Station', 'Chevron', 'Metro Transit'],
    'Entertainment': ['NETFLIX.COM', 'Spotify Premium', 'AMC Theaters', 'Steam Games', 'Disney+'],
    'Dining Out': ['Starbucks', 'McDonald\'s', 'Chipotle Mexican Grill', 'Pizza Hut', 'Local Bistro'],
    'Shopping': ['Amazon.com', 'Best Buy', 'Walmart', 'Nike Store', 'Apple Store'],
    'Bills & Utilities': ['Comcast Internet', 'PG&E Electric', 'AT&T Mobile', 'Water Utility', 'Rent Payment'],
    'Healthcare': ['CVS Pharmacy', 'Kaiser Permanente', 'Walgreens', 'Dr. Smith Office', 'LabCorp'],
    'Travel': ['United Airlines', 'Marriott Hotel', 'Airbnb', 'Hertz Car Rental', 'Expedia'],
  };

  // Generate 6 months of transactions
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    
    // Add salary on the 1st of each month
    transactions.push({
      id: `salary-${monthOffset}`,
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
      description: 'Monthly Salary - Tech Corp',
      amount: 8500,
      category: 'Salary',
      type: 'income',
      merchant: 'Tech Corp',
      source: 'csv',
    });

    // Add freelance income on 15th
    if (Math.random() > 0.3) {
      transactions.push({
        id: `freelance-${monthOffset}`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 15),
        description: 'Freelance Project Payment',
        amount: 1500 + Math.random() * 2000,
        category: 'Freelance',
        type: 'income',
        merchant: 'Client ABC',
        source: 'manual',
      });
    }

    // Generate 40-60 expense transactions per month
    const numTransactions = 40 + Math.floor(Math.random() * 20);
    
    for (let i = 0; i < numTransactions; i++) {
      const expenseCategories = Object.keys(merchants);
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const merchantList = merchants[category as keyof typeof merchants];
      const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
      
      let amount: number;
      switch(category) {
        case 'Groceries':
          amount = 50 + Math.random() * 150;
          break;
        case 'Transportation':
          amount = 10 + Math.random() * 60;
          break;
        case 'Entertainment':
          amount = 10 + Math.random() * 50;
          break;
        case 'Dining Out':
          amount = 15 + Math.random() * 80;
          break;
        case 'Shopping':
          amount = 30 + Math.random() * 300;
          break;
        case 'Bills & Utilities':
          amount = 50 + Math.random() * 200;
          break;
        case 'Healthcare':
          amount = 20 + Math.random() * 200;
          break;
        case 'Travel':
          amount = 100 + Math.random() * 1000;
          break;
        default:
          amount = 20 + Math.random() * 100;
      }

      transactions.push({
        id: `trans-${monthOffset}-${i}`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.floor(Math.random() * daysInMonth)),
        description: merchant,
        amount: parseFloat(amount.toFixed(2)),
        category,
        type: 'expense',
        merchant,
        source: Math.random() > 0.7 ? 'manual' : Math.random() > 0.5 ? 'csv' : 'pdf',
        originalCategory: Math.random() > 0.8 ? 'Other Expense' : category,
      });
    }
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const sampleTransactions = generateTransactions();

export const sampleFiles: UploadedFile[] = [
  {
    id: 'file-1',
    name: 'chase-statement-october-2024.pdf',
    type: 'application/pdf',
    uploadDate: new Date('2024-10-01'),
    status: 'completed',
    extractedTransactions: sampleTransactions.filter(t => t.source === 'pdf').slice(0, 20),
  },
  {
    id: 'file-2',
    name: 'transactions-export.csv',
    type: 'text/csv',
    uploadDate: new Date('2024-10-15'),
    status: 'completed',
    extractedTransactions: sampleTransactions.filter(t => t.source === 'csv').slice(0, 30),
  },
  {
    id: 'file-3',
    name: 'receipt-starbucks.jpg',
    type: 'image/jpeg',
    uploadDate: new Date('2024-11-01'),
    status: 'processing',
  },
];

// Simulated AI categorization suggestions
export const aiCategorizationRules = {
  'UBER': 'Transportation',
  'LYFT': 'Transportation',
  'STARBUCKS': 'Dining Out',
  'SAFEWAY': 'Groceries',
  'WHOLE FOODS': 'Groceries',
  'NETFLIX': 'Entertainment',
  'SPOTIFY': 'Entertainment',
  'AMAZON': 'Shopping',
  'SHELL': 'Transportation',
  'CHEVRON': 'Transportation',
  'PG&E': 'Bills & Utilities',
  'COMCAST': 'Bills & Utilities',
  'CVS': 'Healthcare',
  'WALGREENS': 'Healthcare',
};