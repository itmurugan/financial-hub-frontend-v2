export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  merchant?: string;
  notes?: string;
  source: 'manual' | 'csv' | 'pdf' | 'image';
  originalCategory?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense' | 'both';
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  extractedTransactions?: Transaction[];
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoriesBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  type?: 'income' | 'expense' | 'all';
}