import api, { ApiResponse } from './api';
import { AnalyticsSummary, UserProfile } from '../types';

export const analyticsService = {
  /**
   * Fetch spending trends, category analytics, and savings analysis
   * GET /api/analytics
   */
  async getAnalyticsData(timeframe?: string): Promise<ApiResponse<AnalyticsSummary>> {
    const query = timeframe ? `?timeframe=${timeframe}` : '';
    return await api.get<AnalyticsSummary>(`/api/analytics${query}`);
  },

  /**
   * Get user profile & preferences
   * GET /api/profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return await api.get<UserProfile>('/api/profile');
  },

  /**
   * Update user profile & settings
   * PUT /api/profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return await api.put<UserProfile>('/api/profile', profileData);
  }
};

export default analyticsService;
