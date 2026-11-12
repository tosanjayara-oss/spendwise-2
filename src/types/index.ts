export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  category: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  month: string; // YYYY-MM
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  occupation: string;
  location: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  currencySymbol: string;
  monthlySavingsGoal: number;
  avatarUrl: string;
  bio: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    budgetAlerts: boolean;
    weeklyReport: boolean;
    largeTransactions: boolean;
    largeTransactionThreshold: number;
  };
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  monthlyBudget: number;
  remainingBudget: number;
  savingsRate: number; // percentage
  incomeVsExpenseMonthly: {
    month: string;
    income: number;
    expense: number;
  }[];
  categoryExpenses: {
    name: string;
    value: number;
    color: string;
  }[];
  recentTransactions: Transaction[];
  budgetProgress: {
    id: string;
    category: string;
    limit: number;
    spent: number;
    percentage: number;
    isOverBudget: boolean;
    color: string;
  }[];
}

export interface AnalyticsSummary {
  monthlyIncomeVsExpense: {
    month: string;
    income: number;
    expense: number;
    savings: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
    transactionCount: number;
  }[];
  dailySpendingTrends: {
    date: string;
    day: string;
    amount: number;
  }[];
  paymentMethodBreakdown: {
    method: string;
    amount: number;
    percentage: number;
  }[];
  keyMetrics: {
    averageDailySpending: number;
    highestSpendingCategory: {
      name: string;
      amount: number;
    };
    savingsRate: number;
    projectedMonthEndExpense: number;
    largestTransaction: {
      description: string;
      amount: number;
      date: string;
    };
  };
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: 'all' | 'income' | 'expense';
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount' | 'description';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
