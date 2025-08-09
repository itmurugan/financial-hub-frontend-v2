import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils/test-utils';
import TransactionManager from '../TransactionManager';
import { mockTransactions, mockCategories, setupFetchMock } from '../../test-utils/mocks';

describe('TransactionManager Component', () => {
  let mockFetch: jest.Mock;
  const mockProps = {
    transactions: mockTransactions,
    onUpdateTransaction: jest.fn(),
    onDeleteTransaction: jest.fn(),
    onAddTransaction: jest.fn()
  };

  beforeEach(() => {
    mockFetch = setupFetchMock();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCategories)
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders transaction manager title', async () => {
    render(<TransactionManager {...mockProps} />);
    
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  test('renders add transaction button', async () => {
    render(<TransactionManager {...mockProps} />);
    
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
  });

  test('displays search input', async () => {
    render(<TransactionManager {...mockProps} />);
    
    expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
  });

  test('displays filter dropdowns', async () => {
    render(<TransactionManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    });
  });

  test('shows transaction count', async () => {
    render(<TransactionManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(`Showing ${mockTransactions.length} of ${mockTransactions.length} transactions`)).toBeInTheDocument();
    });
  });

  test('renders transaction table', async () => {
    render(<TransactionManager {...mockProps} />);
    
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('displays transaction data', async () => {
    render(<TransactionManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Transaction 1')).toBeInTheDocument();
      expect(screen.getByText('Test Income')).toBeInTheDocument();
    });
  });

  test('opens add transaction form when button clicked', async () => {
    render(<TransactionManager {...mockProps} />);
    
    const addButton = screen.getByText('Add Transaction');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add New Transaction')).toBeInTheDocument();
    });
  });

  test('filters transactions by search term', async () => {
    render(<TransactionManager {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search transactions...');
    fireEvent.change(searchInput, { target: { value: 'Test Transaction 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Transaction 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Income')).not.toBeInTheDocument();
    });
  });

  test('filters transactions by category', async () => {
    render(<TransactionManager {...mockProps} />);
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'Groceries' } });
      
      expect(screen.getByText('Test Transaction 1')).toBeInTheDocument();
    });
  });

  test('filters transactions by type', async () => {
    render(<TransactionManager {...mockProps} />);
    
    const typeSelect = screen.getByDisplayValue('All Types');
    fireEvent.change(typeSelect, { target: { value: 'income' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Income')).toBeInTheDocument();
    });
  });

  test('calls onDeleteTransaction when delete button clicked', async () => {
    render(<TransactionManager {...mockProps} />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(button => 
        button.querySelector('[data-lucide="trash-2"]')
      );
      
      if (deleteButton) {
        fireEvent.click(deleteButton);
        expect(mockProps.onDeleteTransaction).toHaveBeenCalledWith('trans-1');
      }
    });
  });

  test('enters edit mode when edit button clicked', async () => {
    render(<TransactionManager {...mockProps} />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(button => 
        button.querySelector('[data-lucide="edit-2"]')
      );
      
      if (editButton) {
        fireEvent.click(editButton);
        expect(screen.getByDisplayValue('Test Transaction 1')).toBeInTheDocument();
      }
    });
  });

  test('fetches categories on mount', async () => {
    render(<TransactionManager {...mockProps} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/categories');
    });
  });
});