import { Transaction, Category, UploadedFile } from '../index';

describe('Type Definitions', () => {
  test('Transaction interface has correct structure', () => {
    const transaction: Transaction = {
      id: 'test-1',
      date: new Date(),
      description: 'Test Transaction',
      amount: 100.00,
      category: 'Test Category',
      type: 'expense',
      source: 'manual'
    };

    expect(transaction).toHaveProperty('id');
    expect(transaction).toHaveProperty('date');
    expect(transaction).toHaveProperty('description');
    expect(transaction).toHaveProperty('amount');
    expect(transaction).toHaveProperty('category');
    expect(transaction).toHaveProperty('type');
    expect(transaction).toHaveProperty('source');
  });

  test('Category interface has correct structure', () => {
    const category: Category = {
      id: 'cat-1',
      name: 'Test Category',
      color: '#10b981',
      type: 'expense'
    };

    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('color');
    expect(category).toHaveProperty('type');
  });

  test('UploadedFile interface has correct structure', () => {
    const file: UploadedFile = {
      id: 'file-1',
      name: 'test.pdf',
      type: 'application/pdf',
      uploadDate: new Date(),
      status: 'completed'
    };

    expect(file).toHaveProperty('id');
    expect(file).toHaveProperty('name');
    expect(file).toHaveProperty('type');
    expect(file).toHaveProperty('uploadDate');
    expect(file).toHaveProperty('status');
  });

  test('Transaction type validation', () => {
    const incomeTransaction: Transaction = {
      id: 'income-1',
      date: new Date(),
      description: 'Salary',
      amount: 5000,
      category: 'Salary',
      type: 'income',
      source: 'manual'
    };

    const expenseTransaction: Transaction = {
      id: 'expense-1',
      date: new Date(),
      description: 'Groceries',
      amount: 100,
      category: 'Food',
      type: 'expense',
      source: 'csv'
    };

    expect(incomeTransaction.type).toBe('income');
    expect(expenseTransaction.type).toBe('expense');
  });
});