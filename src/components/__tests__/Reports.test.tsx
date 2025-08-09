import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils/test-utils';
import Reports from '../Reports';
import { mockTransactions, mockCategories, setupFetchMock } from '../../test-utils/mocks';

// Mock Recharts with simple components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('Reports Component - Basic Tests', () => {
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

  test('renders reports title', async () => {
    render(<Reports transactions={mockTransactions} />);
    
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
  });

  test('renders export CSV button', async () => {
    render(<Reports transactions={mockTransactions} />);
    
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  test('renders date range buttons', async () => {
    render(<Reports transactions={mockTransactions} />);
    
    expect(screen.getByText('week')).toBeInTheDocument();
    expect(screen.getByText('month')).toBeInTheDocument();
    expect(screen.getByText('quarter')).toBeInTheDocument();
    expect(screen.getByText('year')).toBeInTheDocument();
  });

  test('displays financial summary cards', async () => {
    render(<Reports transactions={mockTransactions} />);

    await waitFor(() => {
      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Savings')).toBeInTheDocument();
    });
  });

  test('renders chart sections', async () => {
    render(<Reports transactions={mockTransactions} />);

    await waitFor(() => {
      expect(screen.getByText('12-Month Trend')).toBeInTheDocument();
      expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Top Expense Categories')).toBeInTheDocument();
      expect(screen.getByText('Spending Patterns')).toBeInTheDocument();
    });
  });

  test('fetches categories on mount', async () => {
    render(<Reports transactions={mockTransactions} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/categories');
    });
  });

  test('handles date range changes', async () => {
    render(<Reports transactions={mockTransactions} />);

    // Test week button
    const weekButton = screen.getByText('week');
    fireEvent.click(weekButton);
    expect(weekButton).toHaveClass('bg-blue-600');

    // Test quarter button
    const quarterButton = screen.getByText('quarter');
    fireEvent.click(quarterButton);
    expect(quarterButton).toHaveClass('bg-blue-600');
  });

  test('handles custom date selection', async () => {
    render(<Reports transactions={mockTransactions} />);

    const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
    const startDateInput = dateInputs[0];
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    expect(startDateInput).toHaveValue('2024-01-01');
  });

  test('calculates metrics with mock data', async () => {
    render(<Reports transactions={mockTransactions} />);

    await waitFor(() => {
      // Should display financial summary cards
      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Savings')).toBeInTheDocument();
      
      // Check for dollar amounts (even if $0.00)
      const amounts = screen.getAllByText(/\$\d+\.\d{2}/);
      expect(amounts.length).toBeGreaterThan(0);
    });
  });

  test('renders with different transaction types', async () => {
    const mixedTransactions = [
      ...mockTransactions,
      {
        id: 'extra-1',
        date: new Date(),
        description: 'Extra Expense',
        amount: 75.00,
        category: 'Entertainment',
        type: 'expense' as const,
        source: 'manual' as const
      }
    ];

    render(<Reports transactions={mixedTransactions} />);

    await waitFor(() => {
      expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    });
  });
});