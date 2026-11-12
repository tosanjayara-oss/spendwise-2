import api, { ApiResponse } from './api';
import { Budget } from '../types';

export const budgetService = {
  /**
   * Fetch all monthly category budgets
   * GET /api/budgets
   */
  async getBudgets(): Promise<ApiResponse<Budget[]>> {
    return await api.get<Budget[]>('/api/budgets');
  },

  /**
   * Create a new category budget
   * POST /api/budgets
   */
  async createBudget(budgetData: {
    category: string;
    monthlyLimit: number;
    spent?: number;
    month?: string;
  }): Promise<ApiResponse<Budget>> {
    return await api.post<Budget>('/api/budgets', budgetData);
  },

  /**
   * Update budget limit or values
   * PUT /api/budgets/:id
   */
  async updateBudget(id: string, budgetData: Partial<Budget>): Promise<ApiResponse<Budget>> {
    return await api.put<Budget>(`/api/budgets/${id}`, budgetData);
  },

  /**
   * Delete a budget
   * DELETE /api/budgets/:id
   */
  async deleteBudget(id: string): Promise<ApiResponse<{ success: boolean; id: string }>> {
    return await api.delete<{ success: boolean; id: string }>(`/api/budgets/${id}`);
  }
};

export default budgetService;
