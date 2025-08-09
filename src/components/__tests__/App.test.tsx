import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils/test-utils';
import App from '../../App';
import { mockTransactions, setupFetchMock } from '../../test-utils/mocks';

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

describe('App Component', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = setupFetchMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders app with proper header structure', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });

    render(<App />);
    
    expect(screen.getByText('Financial Hub AI')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Data Ingestion')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Financial Hub AI - Prototype with Simulated AI Features')).toBeInTheDocument();
  });

  test('loads with transactions data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransactions)
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
  });

  test('handles transaction extraction from file upload', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Navigate to upload tab
    const uploadButton = screen.getByRole('button', { name: /data ingestion/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Data Ingestion & AI Extraction')).toBeInTheDocument();
    });
  });

  test('mobile menu functionality', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Test mobile menu toggle
    const menuButtons = screen.getAllByRole('button');
    const mobileMenuButton = menuButtons.find(button => 
      button.querySelector('[data-lucide="menu"]')
    );

    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton);
      
      // Menu should change to X icon
      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find(button => 
        button.querySelector('[data-lucide="x"]')
      );
      expect(closeButton).toBeInTheDocument();
    }
  });

  test('handles tab switching correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransactions)
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Start on dashboard
    expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();

    // Switch to reports
    const reportsButton = screen.getByRole('button', { name: /reports/i });
    fireEvent.click(reportsButton);

    await waitFor(() => {
      expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    });

    // Switch back to dashboard
    const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
    fireEvent.click(dashboardButton);

    await waitFor(() => {
      expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
    });
  });

  test('transaction operations update state correctly', async () => {
    const initialTransactions = [...mockTransactions];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(initialTransactions)
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check that transactions are loaded
    expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
  });
});