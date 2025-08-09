# Financial Hub AI - Frontend

A comprehensive React-based financial management application with AI-powered transaction categorization and document processing capabilities.

## Features

- **Dashboard**: Real-time financial overview with income, expenses, and savings tracking
- **Transaction Management**: CRUD operations for financial transactions with filtering and search
- **File Upload & Processing**: AI-powered extraction from PDFs, CSVs, and images
- **Reports & Analytics**: Comprehensive financial reports with charts and trend analysis
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API server running (see API Requirements section)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd financial-hub-frontend-v2
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API endpoint
```

4. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run lint`
Runs ESLint to check for code quality issues.

## Docker Deployment

### Build Docker Image
```bash
docker build -t financial-hub-frontend .
```

### Run Container
```bash
docker run -p 3000:80 financial-hub-frontend
```

### Docker Compose (Development)
```bash
docker-compose up -d
```

## API Requirements

This frontend application expects a backend API server with the following endpoints:

### Base URL
All API calls are made relative to the root path (e.g., `/api/transactions`). Configure your backend to serve APIs at these endpoints or use a proxy.

### Required Endpoints

#### Transactions API
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update existing transaction  
- `DELETE /api/transactions/:id` - Delete transaction

#### Categories API
- `GET /api/categories` - Fetch all transaction categories

#### File Processing API
- `POST /api/files/upload` - Upload and process financial documents

For detailed API specifications, see [API_SPEC.md](./API_SPEC.md).

## Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx    # Main dashboard with financial overview
│   ├── FileUpload.tsx   # File upload and AI processing
│   ├── Reports.tsx      # Analytics and reporting
│   └── TransactionManager.tsx # Transaction CRUD operations
├── types/               # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. See `.github/workflows/ci.yml` for the complete workflow.

### Workflow Features
- Automated testing on pull requests
- Build verification
- Docker image creation and publishing
- Security scanning

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000

# Feature Flags
REACT_APP_ENABLE_MOCK_DATA=false
```

## Browser Support

- Chrome (latest)
- Firefox (latest) 
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
