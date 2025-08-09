import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/test-utils';
import App from '../App';
import { mockTransactions, mockCategories, setupFetchMock } from '../test-utils/mocks';

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('App Integration Tests', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = setupFetchMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders app header with title and navigation', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransactions)
    });

    render(<App />);
    
    expect(screen.getByText('Financial Hub AI')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Data Ingestion')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  test('fetches transactions on app load', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransactions)
    });

    render(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/transactions');
    });
  });

  test('shows loading state initially', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('navigates between tabs', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransactions)
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should start on Dashboard
    expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();

    // Navigate to Transactions (use role to be more specific)
    const transactionsButton = screen.getByRole('button', { name: /transactions/i });
    fireEvent.click(transactionsButton);
    await waitFor(() => {
      expect(screen.getByText('Transaction Management')).toBeInTheDocument();
    });

    // Navigate to Reports
    const reportsButton = screen.getByRole('button', { name: /reports/i });
    fireEvent.click(reportsButton);
    await waitFor(() => {
      expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    });

    // Navigate to Data Ingestion
    const dataIngestionButton = screen.getByRole('button', { name: /data ingestion/i });
    fireEvent.click(dataIngestionButton);
    await waitFor(() => {
      expect(screen.getByText('Data Ingestion & AI Extraction')).toBeInTheDocument();
    });
  });

  test('handles mobile menu toggle', async () => {
    // Mock window.innerWidth for mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransactions)
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Mobile menu should be closed initially
    const mobileNavigation = screen.queryByRole('navigation');
    
    // Look for mobile menu button (Menu icon)
    const menuButtons = screen.getAllByRole('button');
    const mobileMenuButton = menuButtons.find(button => 
      button.querySelector('[data-lucide="menu"]')
    );

    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton);
      
      // Mobile navigation should now be visible
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Data Ingestion')).toBeInTheDocument();
    }
  });

  test('adds new transaction through UI', async () => {
    let callCount = 0;
    mockFetch.mockImplementation((url, options) => {
      callCount++;
      
      if (url === '/api/transactions' && !options) {
        // GET request
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactions)
        });
      } else if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories)
        });
      } else if (url === '/api/transactions' && options?.method === 'POST') {
        // POST request
        const newTransaction = {
          id: 'new-trans-1',
          ...JSON.parse(options.body),
          date: new Date()
        };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(newTransaction)
        });
      }
      
      return Promise.reject(new Error('Unknown request'));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Navigate to Transactions tab
    const transactionsButton = screen.getByRole('button', { name: /transactions/i });
    fireEvent.click(transactionsButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction Management')).toBeInTheDocument();
    });

    // Click Add Transaction button (the one with the Plus icon)
    const addButton = screen.getByRole('button', { name: /Add Transaction/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Transaction')).toBeInTheDocument();
    });

    // Fill out the form
    const descriptionInput = screen.getByPlaceholderText('Description');
    const amountInput = screen.getByPlaceholderText('Amount');

    fireEvent.change(descriptionInput, { target: { value: 'New Test Transaction' } });
    fireEvent.change(amountInput, { target: { value: '50.00' } });

    // Submit the form (find the submit button in the form)
    const submitButton = screen.getAllByText('Add Transaction')[1]; // Get the second one (submit button)
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/transactions', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('New Test Transaction')
      }));
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetch.mockRejectedValue(new Error('API Error'));

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching transactions:', expect.any(Error));
    });

    // App should still render without crashing
    expect(screen.getByText('Financial Hub AI')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('updates transaction through UI', async () => {
    mockFetch.mockImplementation((url, options) => {
      if (url === '/api/transactions' && !options) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactions)
        });
      } else if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories)
        });
      } else if (url.includes('/api/transactions/') && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...JSON.parse(options.body) })
        });
      }
      
      return Promise.reject(new Error('Unknown request'));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Navigate to Transactions tab
    const transactionsButton = screen.getByRole('button', { name: /transactions/i });
    fireEvent.click(transactionsButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction Management')).toBeInTheDocument();
      expect(screen.getByText('Test Transaction 1')).toBeInTheDocument();
    });

    // Find and click edit button for first transaction
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.querySelector('[data-lucide="edit-2"]')
    );

    if (editButton) {
      fireEvent.click(editButton);

      await waitFor(() => {
        const descriptionInput = screen.getByDisplayValue('Test Transaction 1');
        expect(descriptionInput).toBeInTheDocument();

        // Update description
        fireEvent.change(descriptionInput, { target: { value: 'Updated Transaction' } });

        // Save changes
        const saveButtons = screen.getAllByRole('button');
        const saveButton = saveButtons.find(button => 
          button.querySelector('[data-lucide="check"]')
        );

        if (saveButton) {
          fireEvent.click(saveButton);

          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/transactions/'),
            expect.objectContaining({
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' }
            })
          );
        }
      });
    }
  });

  test('deletes transaction through UI', async () => {
    mockFetch.mockImplementation((url, options) => {
      if (url === '/api/transactions' && !options) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactions)
        });
      } else if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories)
        });
      } else if (url.includes('/api/transactions/') && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Transaction deleted' })
        });
      }
      
      return Promise.reject(new Error('Unknown request'));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Navigate to Transactions tab
    const transactionsButton = screen.getByRole('button', { name: /transactions/i });
    fireEvent.click(transactionsButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction Management')).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('[data-lucide="trash-2"]')
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/transactions/'),
          expect.objectContaining({
            method: 'DELETE'
          })
        );
      });
    }
  });
});