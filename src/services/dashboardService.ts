import api, { ApiResponse } from './api';
import { DashboardSummary } from '../types';

export const dashboardService = {
  /**
   * Fetch complete dashboard aggregates, charts, and metrics
   * GET /api/dashboard
   */
  async getDashboardData(): Promise<ApiResponse<DashboardSummary>> {
    return await api.get<DashboardSummary>('/api/dashboard');
  }
};

export default dashboardService;
