import { Transaction, Category, UploadedFile } from '../types';

// Create dates for current month to ensure they show up in dashboard
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

export const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    date: new Date(currentYear, currentMonth, 15),
    description: 'Test Transaction 1',
    amount: 100.00,
    category: 'Groceries',
    type: 'expense',
    merchant: 'Test Store',
    source: 'manual'
  },
  {
    id: 'trans-2',
    date: new Date(currentYear, currentMonth, 14),
    description: 'Test Income',
    amount: 2000.00,
    category: 'Salary',
    type: 'income',
    merchant: 'Test Company',
    source: 'csv'
  }
];

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Groceries',
    color: '#10b981',
    type: 'expense'
  },
  {
    id: 'cat-2',
    name: 'Salary',
    color: '#22c55e',
    type: 'income'
  }
];

export const mockUploadedFiles: UploadedFile[] = [
  {
    id: 'file-1',
    name: 'test-statement.pdf',
    type: 'application/pdf',
    uploadDate: new Date(currentYear, currentMonth, 1),
    status: 'completed',
    extractedTransactions: mockTransactions.slice(0, 1)
  }
];

// Mock fetch function
export const createMockFetch = (mockData: any, shouldFail = false) => {
  return jest.fn(() => {
    if (shouldFail) {
      return Promise.reject(new Error('API Error'));
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
  }) as jest.Mock;
};

// Global fetch mock setup
export const setupFetchMock = () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;
  return mockFetch;
};