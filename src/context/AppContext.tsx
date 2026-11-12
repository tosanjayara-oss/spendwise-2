import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Budget } from '../types';
import analyticsService from '../services/analyticsService';
import budgetService from '../services/budgetService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  profile: UserProfile | null;
  currency: string;
  currencySymbol: string;
  refreshTrigger: number;
  triggerRefresh: () => void;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isQuickAddOpen: boolean;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  budgetAlerts: { category: string; limit: number; spent: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light');
  const [budgetAlerts, setBudgetAlerts] = useState<{ category: string; limit: number; spent: number }[]>([]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const openQuickAdd = useCallback(() => setIsQuickAddOpen(true), []);
  const closeQuickAdd = useCallback(() => setIsQuickAddOpen(false), []);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await analyticsService.getProfile();
        if (res.data) {
          setProfile(res.data);
          if (res.data.theme) {
            setThemeState(res.data.theme);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };
    loadProfile();
  }, [refreshTrigger]);

  // Check budgets for exceeded limits
  useEffect(() => {
    const checkBudgets = async () => {
      try {
        const res = await budgetService.getBudgets();
        if (res.data) {
          const exceeded = res.data
            .filter((b: Budget) => b.spent > b.monthlyLimit)
            .map((b: Budget) => ({
              category: b.category,
              limit: b.monthlyLimit,
              spent: b.spent
            }));
          setBudgetAlerts(exceeded);
        }
      } catch (err) {
        console.error('Error checking budget alerts:', err);
      }
    };
    checkBudgets();
  }, [refreshTrigger]);

  // Handle Theme
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    if (profile) {
      analyticsService.updateProfile({ theme: newTheme });
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const updateProfileData = async (updated: Partial<UserProfile>) => {
    try {
      const res = await analyticsService.updateProfile(updated);
      setProfile(res.data);
      if (updated.theme) {
        setThemeState(updated.theme);
      }
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your profile and preferences have been updated successfully.'
      });
      triggerRefresh();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not update settings.'
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        currency: profile?.currency || 'INR',
        currencySymbol: profile?.currencySymbol || '₹',
        refreshTrigger,
        triggerRefresh,
        updateProfile: updateProfileData,
        toasts,
        addToast,
        removeToast,
        isQuickAddOpen,
        openQuickAdd,
        closeQuickAdd,
        theme,
        setTheme,
        budgetAlerts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
