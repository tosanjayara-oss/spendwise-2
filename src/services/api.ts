import {
  getStoredTransactions,
  saveStoredTransactions,
  getStoredBudgets,
  saveStoredBudgets,
  getStoredCategories,
  saveStoredCategories,
  getStoredProfile,
  saveStoredProfile
} from './mockData';
import {
  Transaction,
  Budget,
  Category,
  UserProfile,
  DashboardSummary,
  AnalyticsSummary,
  TransactionFilters
} from '../types';
import { computeDashboardSummary } from '../utils/expenseCalculations';

/**
 * SpendWise API Client & Mock Router
 * Simulates standard RESTful HTTP calls with status codes, headers, and payload structures.
 */

const SIMULATE_LATENCY_MS = 180;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private baseUrl: string = '/api';

  // Core Request Router
  async request<T>(endpoint: string, options: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: any } = { method: 'GET' }): Promise<ApiResponse<T>> {
    await delay(SIMULATE_LATENCY_MS);
    const { method, body } = options;
    const url = endpoint.startsWith(this.baseUrl) ? endpoint : `${this.baseUrl}${endpoint}`;

    // 1. GET /api/dashboard
    if (url === '/api/dashboard' && method === 'GET') {
      const data = this.calculateDashboardData();
      return { status: 200, data: data as unknown as T, message: 'Dashboard summary retrieved successfully' };
    }

    // 2. GET /api/analytics
    if (url.startsWith('/api/analytics') && method === 'GET') {
      const data = this.calculateAnalyticsData();
      return { status: 200, data: data as unknown as T, message: 'Analytics data retrieved successfully' };
    }

    // 3. Transactions Router
    // GET /api/transactions
    if (url.startsWith('/api/transactions') && method === 'GET') {
      // Check if it's an ID: /api/transactions/:id
      const parts = url.split('?')[0].split('/');
      if (parts.length === 4 && parts[3]) {
        const id = parts[3];
        const txns = getStoredTransactions();
        const found = txns.find(t => t.id === id);
        if (!found) {
          throw new Error(`Transaction with ID ${id} not found`);
        }
        return { status: 200, data: found as unknown as T };
      }

      // Query params
      const parsedUrl = new URL(`http://localhost${url}`);
      const search = parsedUrl.searchParams.get('search') || '';
      const category = parsedUrl.searchParams.get('category') || '';
      const type = parsedUrl.searchParams.get('type') || 'all';
      const paymentMethod = parsedUrl.searchParams.get('paymentMethod') || '';
      const startDate = parsedUrl.searchParams.get('startDate') || '';
      const endDate = parsedUrl.searchParams.get('endDate') || '';
      const sortBy = parsedUrl.searchParams.get('sortBy') || 'date';
      const sortOrder = parsedUrl.searchParams.get('sortOrder') || 'desc';
      const page = parseInt(parsedUrl.searchParams.get('page') || '1', 10);
      const limit = parseInt(parsedUrl.searchParams.get('limit') || '10', 10);

      let txns = getStoredTransactions();

      // Filter by search
      if (search.trim()) {
        const q = search.toLowerCase();
        txns = txns.filter(t => 
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        );
      }

      // Filter by category
      if (category && category !== 'all') {
        txns = txns.filter(t => t.category.toLowerCase() === category.toLowerCase());
      }

      // Filter by type
      if (type && type !== 'all') {
        txns = txns.filter(t => t.type === type);
      }

      // Filter by payment method
      if (paymentMethod && paymentMethod !== 'all') {
        txns = txns.filter(t => t.paymentMethod === paymentMethod);
      }

      // Filter by dates
      if (startDate) {
        txns = txns.filter(t => t.date >= startDate);
      }
      if (endDate) {
        txns = txns.filter(t => t.date <= endDate);
      }

      // Sort
      txns.sort((a, b) => {
        let valA: any = a[sortBy as keyof Transaction] || '';
        let valB: any = b[sortBy as keyof Transaction] || '';

        if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        }

        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });

      const total = txns.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const startIndex = (page - 1) * limit;
      const paginated = txns.slice(startIndex, startIndex + limit);

      return {
        status: 200,
        data: paginated as unknown as T,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    }

    // POST /api/transactions
    if (url === '/api/transactions' && method === 'POST') {
      const txns = getStoredTransactions();
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: body.date || new Date().toISOString().split('T')[0],
        description: body.description,
        category: body.category,
        type: body.type,
        paymentMethod: body.paymentMethod,
        amount: Number(body.amount),
        notes: body.notes || '',
        createdAt: new Date().toISOString()
      };
      const updated = [newTxn, ...txns];
      saveStoredTransactions(updated);
      this.syncBudgetSpentWithTransactions(updated);
      return { status: 201, data: newTxn as unknown as T, message: 'Transaction created successfully' };
    }

    // PUT /api/transactions/:id
    if (url.startsWith('/api/transactions/') && method === 'PUT') {
      const id = url.split('/')[3];
      const txns = getStoredTransactions();
      const index = txns.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error(`Transaction with ID ${id} not found`);
      }
      const updatedTxn: Transaction = {
        ...txns[index],
        ...body,
        amount: Number(body.amount ?? txns[index].amount)
      };
      txns[index] = updatedTxn;
      saveStoredTransactions(txns);
      this.syncBudgetSpentWithTransactions(txns);
      return { status: 200, data: updatedTxn as unknown as T, message: 'Transaction updated successfully' };
    }

    // DELETE /api/transactions/:id
    if (url.startsWith('/api/transactions/') && method === 'DELETE') {
      const id = url.split('/')[3];
      let txns = getStoredTransactions();
      const filtered = txns.filter(t => t.id !== id);
      saveStoredTransactions(filtered);
      this.syncBudgetSpentWithTransactions(filtered);
      return { status: 200, data: { success: true, id } as unknown as T, message: 'Transaction deleted successfully' };
    }

    // 4. Categories Router
    // GET /api/categories
    if (url === '/api/categories' && method === 'GET') {
      const categories = getStoredCategories();
      return { status: 200, data: categories as unknown as T };
    }

    // POST /api/categories
    if (url === '/api/categories' && method === 'POST') {
      const categories = getStoredCategories();
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: body.name,
        type: body.type || 'expense',
        color: body.color || '#3B82F6',
        icon: body.icon || 'Folder'
      };
      categories.push(newCat);
      saveStoredCategories(categories);
      return { status: 201, data: newCat as unknown as T, message: 'Category added' };
    }

    // 5. Budgets Router
    // GET /api/budgets
    if (url === '/api/budgets' && method === 'GET') {
      const budgets = getStoredBudgets();
      return { status: 200, data: budgets as unknown as T };
    }

    // POST /api/budgets
    if (url === '/api/budgets' && method === 'POST') {
      const budgets = getStoredBudgets();
      const newBudget: Budget = {
        id: `bgt-${Date.now()}`,
        category: body.category,
        monthlyLimit: Number(body.monthlyLimit),
        spent: Number(body.spent || 0),
        month: body.month || new Date().toISOString().substring(0, 7)
      };
      budgets.push(newBudget);
      saveStoredBudgets(budgets);
      return { status: 201, data: newBudget as unknown as T, message: 'Budget configured successfully' };
    }

    // PUT /api/budgets/:id
    if (url.startsWith('/api/budgets/') && method === 'PUT') {
      const id = url.split('/')[3];
      const budgets = getStoredBudgets();
      const index = budgets.findIndex(b => b.id === id);
      if (index === -1) {
        throw new Error(`Budget with ID ${id} not found`);
      }
      budgets[index] = {
        ...budgets[index],
        ...body,
        monthlyLimit: Number(body.monthlyLimit ?? budgets[index].monthlyLimit),
        spent: Number(body.spent ?? budgets[index].spent)
      };
      saveStoredBudgets(budgets);
      return { status: 200, data: budgets[index] as unknown as T, message: 'Budget updated successfully' };
    }

    // DELETE /api/budgets/:id
    if (url.startsWith('/api/budgets/') && method === 'DELETE') {
      const id = url.split('/')[3];
      const budgets = getStoredBudgets();
      const filtered = budgets.filter(b => b.id !== id);
      saveStoredBudgets(filtered);
      return { status: 200, data: { success: true, id } as unknown as T, message: 'Budget removed' };
    }

    // 6. Profile Router
    // GET /api/profile
    if (url === '/api/profile' && method === 'GET') {
      const profile = getStoredProfile();
      return { status: 200, data: profile as unknown as T };
    }

    // PUT /api/profile
    if (url === '/api/profile' && method === 'PUT') {
      const current = getStoredProfile();
      const updated: UserProfile = {
        ...current,
        ...body,
        notifications: {
          ...current.notifications,
          ...(body.notifications || {})
        }
      };
      saveStoredProfile(updated);
      return { status: 200, data: updated as unknown as T, message: 'Profile updated successfully' };
    }

    throw new Error(`Endpoint ${method} ${url} not implemented`);
  }

  // HTTP Shortcuts
  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Helpers to synchronize calculations
  private syncBudgetSpentWithTransactions(transactions: Transaction[]) {
    const budgets = getStoredBudgets();
    // Sum expense transactions by category for current active month (e.g., 2026-11)
    const currentMonth = new Date().toISOString().substring(0, 7);
    const categoryTotals: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === 'expense' && t.date.startsWith(currentMonth)) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const updatedBudgets = budgets.map(b => {
      const spent = categoryTotals[b.category] || 0;
      return { ...b, spent };
    });

    saveStoredBudgets(updatedBudgets);
  }

  private calculateDashboardData(): DashboardSummary {
    const txns = getStoredTransactions();
    const budgets = getStoredBudgets();
    const categories = getStoredCategories();

    const calc = computeDashboardSummary(txns, budgets, categories);

    return {
      totalBalance: calc.totalBalance,
      totalIncome: calc.totalIncome,
      totalExpenses: calc.totalExpenses,
      totalSavings: calc.totalSavings,
      monthlyBudget: calc.monthlyBudgetTotal,
      remainingBudget: calc.remainingBudget,
      savingsRate: calc.savingsRate,
      incomeVsExpenseMonthly: calc.incomeVsExpenseMonthly,
      categoryExpenses: calc.categoryExpenses,
      recentTransactions: calc.recentTransactions,
      budgetProgress: calc.budgetProgress
    };
  }

  private calculateAnalyticsData(): AnalyticsSummary {
    const txns = getStoredTransactions();
    const categories = getStoredCategories();

    const categoryTotals: Record<string, { amount: number; count: number }> = {};
    const paymentTotals: Record<string, number> = {};
    let totalExpenseAmount = 0;

    txns.filter(t => t.type === 'expense').forEach(t => {
      totalExpenseAmount += t.amount;
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = { amount: 0, count: 0 };
      }
      categoryTotals[t.category].amount += t.amount;
      categoryTotals[t.category].count += 1;

      paymentTotals[t.paymentMethod] = (paymentTotals[t.paymentMethod] || 0) + t.amount;
    });

    const categoryColorMap: Record<string, string> = {};
    categories.forEach(c => { categoryColorMap[c.name] = c.color; });

    const categoryBreakdown = Object.entries(categoryTotals).map(([cat, info]) => ({
      category: cat,
      amount: info.amount,
      percentage: totalExpenseAmount > 0 ? Math.round((info.amount / totalExpenseAmount) * 100) : 0,
      color: categoryColorMap[cat] || '#3B82F6',
      transactionCount: info.count
    })).sort((a, b) => b.amount - a.amount);

    const paymentMethodBreakdown = Object.entries(paymentTotals).map(([method, amount]) => ({
      method,
      amount,
      percentage: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    // Monthly breakdown
    const monthlyIncomeVsExpense = [
      { month: 'Jun', income: 145000, expense: 62000, savings: 83000 },
      { month: 'Jul', income: 152000, expense: 68500, savings: 83500 },
      { month: 'Aug', income: 145000, expense: 59000, savings: 86000 },
      { month: 'Sep', income: 182000, expense: 74200, savings: 107800 },
      { month: 'Oct', income: 195500, expense: 69400, savings: 126100 },
      { month: 'Nov', income: 195500, expense: totalExpenseAmount || 64800, savings: 195500 - (totalExpenseAmount || 64800) }
    ];

    // Daily spending trends (last 7 days)
    const dailySpendingTrends = [
      { date: 'Nov 04', day: 'Mon', amount: 2100 },
      { date: 'Nov 05', day: 'Tue', amount: 3680 },
      { date: 'Nov 06', day: 'Wed', amount: 2850 },
      { date: 'Nov 07', day: 'Thu', amount: 3850 },
      { date: 'Nov 08', day: 'Fri', amount: 2450 },
      { date: 'Nov 09', day: 'Sat', amount: 32000 },
      { date: 'Nov 10', day: 'Sun', amount: 1415 }
    ];

    const daysCount = 30;
    const averageDailySpending = Math.round(totalExpenseAmount / daysCount);

    const highest = categoryBreakdown[0] || { category: 'Housing & Rent', amount: 32000 };
    const largestTxn = [...txns]
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0] || {
        description: 'Apartment Rent',
        amount: 32000,
        date: '2026-11-09'
      };

    return {
      monthlyIncomeVsExpense,
      categoryBreakdown,
      dailySpendingTrends,
      paymentMethodBreakdown,
      keyMetrics: {
        averageDailySpending,
        highestSpendingCategory: {
          name: highest.category,
          amount: highest.amount
        },
        savingsRate: 64,
        projectedMonthEndExpense: Math.round(averageDailySpending * 30),
        largestTransaction: {
          description: largestTxn.description,
          amount: largestTxn.amount,
          date: largestTxn.date
        }
      }
    };
  }
}

export const api = new ApiService();
export default api;
