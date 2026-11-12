import api, { ApiResponse } from './api';
import { Transaction, Category, TransactionFilters } from '../types';

export const transactionService = {
  /**
   * Fetch paginated & filtered transactions
   * GET /api/transactions
   */
  async getTransactions(filters: TransactionFilters = {}): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.paymentMethod && filters.paymentMethod !== 'all') params.append('paymentMethod', filters.paymentMethod);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await api.get<Transaction[]>(`/api/transactions${queryString}`);
  },

  /**
   * Fetch single transaction by ID
   * GET /api/transactions/:id
   */
  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return await api.get<Transaction>(`/api/transactions/${id}`);
  },

  /**
   * Create a new transaction
   * POST /api/transactions
   */
  async createTransaction(transactionData: {
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    paymentMethod: string;
    date: string;
    notes?: string;
    receiptUrl?: string;
  }): Promise<ApiResponse<Transaction>> {
    return await api.post<Transaction>('/api/transactions', transactionData);
  },

  /**
   * Update an existing transaction
   * PUT /api/transactions/:id
   */
  async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return await api.put<Transaction>(`/api/transactions/${id}`, transactionData);
  },

  /**
   * Delete a transaction by ID
   * DELETE /api/transactions/:id
   */
  async deleteTransaction(id: string): Promise<ApiResponse<{ success: boolean; id: string }>> {
    return await api.delete<{ success: boolean; id: string }>(`/api/transactions/${id}`);
  },

  /**
   * Get all transaction categories
   * GET /api/categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return await api.get<Category[]>('/api/categories');
  },

  /**
   * Create a new category
   * POST /api/categories
   */
  async createCategory(categoryData: {
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
  }): Promise<ApiResponse<Category>> {
    return await api.post<Category>('/api/categories', categoryData);
  }
};

export default transactionService;
