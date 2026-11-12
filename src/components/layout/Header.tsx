import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  Plus,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const { theme, setTheme, openQuickAdd, budgetAlerts, currency, currencySymbol } = useApp();
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  // Derive title from pathname
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return { title: 'Financial Dashboard', subtitle: 'Overview & Key Metrics' };
    if (path.startsWith('/transactions')) return { title: 'Transactions Ledger', subtitle: 'Manage, Filter & Export Records' };
    if (path.startsWith('/add-transaction')) return { title: 'Record Transaction', subtitle: 'Add New Income or Expense Entry' };
    if (path.startsWith('/analytics')) return { title: 'Spending Analytics', subtitle: 'Trends, Patterns & Savings Intelligence' };
    if (path.startsWith('/budgets')) return { title: 'Monthly Budgets', subtitle: 'Category Spending Limits & Targets' };
    if (path.startsWith('/settings')) return { title: 'Preferences & Settings', subtitle: 'Profile, Currency & Alert Controls' };
    return { title: 'SpendWise', subtitle: 'Personal Finance' };
  };

  const { title, subtitle } = getPageInfo();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Menu Toggle & Breadcrumb / Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Preferences */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Budget Warning Popover if any */}
        {budgetAlerts.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-800/60 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">{budgetAlerts.length} Budget Alert</span>
              <ChevronDown className="w-3 h-3 text-rose-500" />
            </button>

            {showAlertMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-rose-200 dark:border-rose-900/60 p-3 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowAlertMenu(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    Spending Limit Exceeded
                  </span>
                  <Link
                    to="/budgets"
                    onClick={() => setShowAlertMenu(false)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Manage
                  </Link>
                </div>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {budgetAlerts.map(alert => (
                    <div key={alert.category} className="text-xs p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/20">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{alert.category}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Spent: <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">{formatCurrency(alert.spent, currency, currencySymbol)}</span> / Limit: {formatCurrency(alert.limit, currency, currencySymbol)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Currency Pill */}
        <div className="hidden sm:flex items-center px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md tabular-nums">
          {currency} ({currencySymbol})
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Primary CTA: Add Transaction Button */}
        <button
          onClick={openQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
