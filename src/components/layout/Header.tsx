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
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#182E0E]/95 backdrop-blur-md border-b border-emerald-900/10 dark:border-[#294C18] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-700 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-[#213D13] rounded-xl transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-emerald-300/80 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Preferences */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Budget Warning Popover */}
        {budgetAlerts.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800/80 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">{budgetAlerts.length} Budget Alert</span>
              <ChevronDown className="w-3 h-3 text-rose-500" />
            </button>

            {showAlertMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#213D13] rounded-xl shadow-2xl border border-rose-200 dark:border-rose-900/80 p-3 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowAlertMenu(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294C18]">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                    Limit Exceeded
                  </span>
                  <Link
                    to="/budgets"
                    onClick={() => setShowAlertMenu(false)}
                    className="text-[11px] text-[#BCE842] hover:underline font-bold"
                  >
                    Manage
                  </Link>
                </div>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {budgetAlerts.map(alert => (
                    <div key={alert.category} className="text-xs p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 border border-rose-800/40">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{alert.category}</div>
                      <div className="text-[11px] text-slate-500 dark:text-emerald-300/80 mt-0.5">
                        Spent: <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">{formatCurrency(alert.spent, currency, currencySymbol)}</span> / Limit: {formatCurrency(alert.limit, currency, currencySymbol)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Currency Pill */}
        <div className="hidden sm:flex items-center px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-[#BCE842] bg-emerald-100/60 dark:bg-[#213D13] rounded-md tabular-nums border border-emerald-200/50 dark:border-[#34601E]">
          {currency} ({currencySymbol})
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-[#213D13] rounded-xl transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#BCE842]" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Primary CTA in Chartreuse Lime */}
        <button
          onClick={openQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] font-extrabold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#BCE842]/20 transition-all whitespace-nowrap hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Transaction</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
