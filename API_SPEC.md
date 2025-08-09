# API Specification

This document outlines the API requirements for the Financial Hub AI backend service.

## Base URL

All API endpoints should be served at the base path `/api/`.

## Authentication

Currently, no authentication is implemented in the frontend. The backend should either:
- Implement session-based authentication
- Use JWT tokens
- Or operate without authentication for development

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string;                    // Unique identifier
  date: Date;                   // Transaction date
  description: string;          // Transaction description
  amount: number;              // Transaction amount (positive for income, positive for expenses)
  category: string;            // Category name
  type: 'income' | 'expense';  // Transaction type
  merchant?: string;           // Merchant name (optional)
  source: 'manual' | 'csv' | 'pdf' | 'image'; // Data source
  originalCategory?: string;   // Original category before AI correction
}
```

### Category

```typescript
interface Category {
  id: string;           // Unique identifier
  name: string;         // Category name
  color: string;        // Hex color code (e.g., "#10b981")
  type: 'income' | 'expense'; // Category type
}
```

### UploadedFile

```typescript
interface UploadedFile {
  id: string;                    // Unique identifier
  name: string;                  // Original filename
  type: string;                  // MIME type
  uploadDate: Date;             // Upload timestamp
  status: 'processing' | 'completed' | 'error'; // Processing status
  extractedTransactions?: Transaction[]; // Extracted transactions (when completed)
}
```

## API Endpoints

### Transactions API

#### GET /api/transactions

Fetch all transactions for the current user.

**Response:**
```json
[
  {
    "id": "trans-001",
    "date": "2024-01-15T00:00:00Z",
    "description": "Grocery Shopping",
    "amount": 89.50,
    "category": "Groceries",
    "type": "expense",
    "merchant": "Whole Foods Market",
    "source": "csv"
  }
]
```

#### POST /api/transactions

Create a new transaction.

**Request Body:**
```json
{
  "date": "2024-01-15T00:00:00Z",
  "description": "Grocery Shopping",
  "amount": 89.50,
  "category": "Groceries", 
  "type": "expense",
  "merchant": "Whole Foods Market",
  "source": "manual"
}
```

**Response:**
```json
{
  "id": "trans-002",
  "date": "2024-01-15T00:00:00Z",
  "description": "Grocery Shopping",
  "amount": 89.50,
  "category": "Groceries",
  "type": "expense",
  "merchant": "Whole Foods Market", 
  "source": "manual"
}
```

#### PUT /api/transactions/:id

Update an existing transaction.

**Request Body:** (Same as POST, all fields optional)
```json
{
  "description": "Updated Description",
  "amount": 95.00,
  "category": "Food & Dining"
}
```

**Response:**
```json
{
  "id": "trans-001",
  "date": "2024-01-15T00:00:00Z", 
  "description": "Updated Description",
  "amount": 95.00,
  "category": "Food & Dining",
  "type": "expense",
  "merchant": "Whole Foods Market",
  "source": "csv"
}
```

#### DELETE /api/transactions/:id

Delete a transaction.

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

### Categories API

#### GET /api/categories

Fetch all available transaction categories.

**Response:**
```json
[
  {
    "id": "cat-001",
    "name": "Groceries",
    "color": "#10b981",
    "type": "expense"
  },
  {
    "id": "cat-002", 
    "name": "Salary",
    "color": "#22c55e",
    "type": "income"
  }
]
```

### File Processing API

#### POST /api/files/upload

Upload and process financial documents (PDFs, CSVs, images) for transaction extraction.

**Request:** Multipart form data with file upload
- `file`: The uploaded file

**Response:**
```json
{
  "id": "file-001",
  "name": "bank-statement.pdf",
  "type": "application/pdf",
  "uploadDate": "2024-01-15T10:30:00Z",
  "status": "completed",
  "transactions": [
    {
      "id": "extracted-001",
      "date": "2024-01-14T00:00:00Z",
      "description": "WALMART STORE #2341",
      "amount": 67.89,
      "category": "Groceries",
      "type": "expense",
      "merchant": "Walmart",
      "source": "pdf"
    }
  ]
}
```

**Processing Status:**
- `processing`: File is being analyzed
- `completed`: Processing finished successfully
- `error`: Processing failed

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource created successfully  
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount must be greater than 0",
    "details": {
      "field": "amount",
      "value": -10.50
    }
  }
}
```

## AI Features (Optional)

### Intelligent Categorization

The backend may implement AI-powered transaction categorization:
- Analyze transaction descriptions and merchants
- Suggest appropriate categories
- Learn from user corrections
- Return confidence scores

### Document Processing

For file uploads, the backend should:
- Extract text from PDFs using OCR
- Parse CSV files for transaction data
- Process receipt images
- Identify transaction patterns
- Auto-categorize extracted transactions

## Rate Limiting

Consider implementing rate limiting:
- File uploads: 10 files per minute
- Transaction operations: 100 requests per minute
- Category requests: 50 requests per minute

## Data Validation

### Transaction Validation
- `amount`: Must be a positive number
- `date`: Must be a valid date, not in the future
- `category`: Must exist in categories list
- `type`: Must be 'income' or 'expense'
- `description`: Required, max 200 characters

### File Upload Validation  
- Supported formats: PDF, CSV, JPG, PNG
- Maximum file size: 10MB
- Maximum files per request: 5

## Development Notes

- All dates should be in ISO 8601 format
- Amounts should be stored as decimal/numeric types, not floats
- Consider implementing soft deletes for transactions
- Add timestamps (created_at, updated_at) to all models
- Implement database indexes for common queries (date, category, type)