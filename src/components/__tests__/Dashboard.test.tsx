import React from 'react';
import { render, screen, waitFor } from '../../test-utils/test-utils';
import Dashboard from '../Dashboard';
import { mockTransactions, mockCategories, setupFetchMock } from '../../test-utils/mocks';

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('Dashboard Component', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = setupFetchMock();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCategories)
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders dashboard title', async () => {
    render(<Dashboard transactions={mockTransactions} />);
    
    expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
  });

  test('displays financial summary cards', async () => {
    render(<Dashboard transactions={mockTransactions} />);

    await waitFor(() => {
      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Savings')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
    });
  });

  test('calculates total income correctly', async () => {
    render(<Dashboard transactions={mockTransactions} />);

    await waitFor(() => {
      // Should show income from current month transactions
      const incomeTransactions = mockTransactions.filter(t => 
        t.type === 'income' && 
        t.date.getMonth() === new Date().getMonth()
      );
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      if (totalIncome > 0) {
        expect(screen.getByText(`$${totalIncome.toFixed(2)}`)).toBeInTheDocument();
      }
    });
  });

  test('calculates total expenses correctly', async () => {
    render(<Dashboard transactions={mockTransactions} />);

    await waitFor(() => {
      const expenseTransactions = mockTransactions.filter(t => 
        t.type === 'expense' && 
        t.date.getMonth() === new Date().getMonth()
      );
      const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      if (totalExpenses > 0) {
        expect(screen.getByText(`$${totalExpenses.toFixed(2)}`)).toBeInTheDocument();
      }
    });
  });

  test('renders charts', async () => {
    render(<Dashboard transactions={mockTransactions} />);

    await waitFor(() => {
      expect(screen.getByText('Expenses by Category')).toBeInTheDocument();
      expect(screen.getByText('Income vs Expenses (Last 6 Months)')).toBeInTheDocument();
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
    });
  });

  test('renders recent transactions table', async () => {
    render(<Dashboard transactions={mockTransactions} />);

    await waitFor(() => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });
  });

  test('fetches categories on mount', async () => {
    render(<Dashboard transactions={mockTransactions} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/categories');
    });
  });

  test('handles empty transactions array', async () => {
    render(<Dashboard transactions={[]} />);

    await waitFor(() => {
      expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
      // Check for specific $0.00 values by their context
      const incomeCard = screen.getByText('Total Income').closest('div');
      expect(incomeCard).toHaveTextContent('$0.00');
      
      const expensesCard = screen.getByText('Total Expenses').closest('div');
      expect(expensesCard).toHaveTextContent('$0.00');
      
      const savingsCard = screen.getByText('Net Savings').closest('div');
      expect(savingsCard).toHaveTextContent('$0.00');
    });
  });
});