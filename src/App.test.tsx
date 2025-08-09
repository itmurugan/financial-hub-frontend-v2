import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { setupFetchMock } from './test-utils/mocks';

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

test('renders Financial Hub AI application', async () => {
  const mockFetch = setupFetchMock();
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([])
  });

  render(<App />);
  
  expect(screen.getByText('Financial Hub AI')).toBeInTheDocument();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  expect(screen.getByText('Financial Dashboard')).toBeInTheDocument();
});
