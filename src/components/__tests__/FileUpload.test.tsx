import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils/test-utils';
import FileUpload from '../FileUpload';
import { setupFetchMock } from '../../test-utils/mocks';

describe('FileUpload Component', () => {
  let mockFetch: jest.Mock;
  const mockProps = {
    onTransactionsExtracted: jest.fn()
  };

  beforeEach(() => {
    mockFetch = setupFetchMock();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders file upload title', () => {
    render(<FileUpload {...mockProps} />);
    
    expect(screen.getByText('Data Ingestion & AI Extraction')).toBeInTheDocument();
  });

  test('renders drag and drop area', () => {
    render(<FileUpload {...mockProps} />);
    
    expect(screen.getByText(/Drag and drop your files here/)).toBeInTheDocument();
    expect(screen.getByText('browse')).toBeInTheDocument();
  });

  test('shows supported file types', () => {
    render(<FileUpload {...mockProps} />);
    
    expect(screen.getByText(/Supports PDF, CSV, JPG, PNG/)).toBeInTheDocument();
  });

  test('renders AI features section', () => {
    render(<FileUpload {...mockProps} />);
    
    expect(screen.getByText('AI-Powered Features (Simulated)')).toBeInTheDocument();
    expect(screen.getByText(/Automatic OCR for scanned documents/)).toBeInTheDocument();
    expect(screen.getByText(/Intelligent transaction categorization/)).toBeInTheDocument();
  });

  test('handles file upload via input', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 'file-1',
        name: 'test.pdf',
        type: 'application/pdf',
        uploadDate: new Date().toISOString(),
        status: 'completed',
        transactions: []
      })
    });

    render(<FileUpload {...mockProps} />);
    
    // Find the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/files/upload', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      }));
    });
  });

  test('handles drag and drop', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        transactions: []
      })
    });

    render(<FileUpload {...mockProps} />);
    
    const dropZone = screen.getByText(/Drag and drop your files here/).closest('div');
    
    if (dropZone) {
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [mockFile]
        }
      });
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/files/upload', expect.objectContaining({
          method: 'POST'
        }));
      });
    }
  });

  test('shows processing indicator during upload', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Mock a slow response
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ transactions: [] })
        }), 1000)
      )
    );

    render(<FileUpload {...mockProps} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    expect(screen.getByText('AI Processing in Progress')).toBeInTheDocument();
    expect(screen.getByText(/Using Gemini AI to extract/)).toBeInTheDocument();
  });

  test('displays uploaded files list', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 'file-1',
        name: 'test.pdf',
        type: 'application/pdf',
        uploadDate: new Date().toISOString(),
        status: 'completed',
        transactions: [{ id: '1', description: 'Test' }]
      })
    });

    render(<FileUpload {...mockProps} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText('Uploaded Files')).toBeInTheDocument();
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  test('handles upload error', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    render(<FileUpload {...mockProps} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  test('calls onTransactionsExtracted when upload completes', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const mockTransactions = [{ id: '1', description: 'Test Transaction' }];
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        transactions: mockTransactions
      })
    });

    render(<FileUpload {...mockProps} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockProps.onTransactionsExtracted).toHaveBeenCalledWith(mockTransactions);
    });
  });
});