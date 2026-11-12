import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LayoutDashboard, Receipt, LineChart, Target, Settings, Sun, Moon, Download, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme, setTheme, openQuickAdd } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'act-add',
      title: 'Record New Transaction',
      subtitle: 'Add an income or expense log',
      icon: Plus,
      action: () => {
        onClose();
        openQuickAdd();
      }
    },
    {
      id: 'page-dash',
      title: 'Go to Financial Dashboard',
      subtitle: 'Overview & key metrics',
      icon: LayoutDashboard,
      action: () => {
        onClose();
        navigate('/dashboard');
      }
    },
    {
      id: 'page-txns',
      title: 'Go to Transactions Ledger',
      subtitle: 'Filter, search & manage history',
      icon: Receipt,
      action: () => {
        onClose();
        navigate('/transactions');
      }
    },
    {
      id: 'page-[#BCE842]',
      title: 'Go to Spending Analytics',
      subtitle: 'Velocity, categories & savings rate',
      icon: LineChart,
      action: () => {
        onClose();
        navigate('/analytics');
      }
    },
    {
      id: 'page-budgets',
      title: 'Go to Monthly Budgets',
      subtitle: 'Category limit caps & alerts',
      icon: Target,
      action: () => {
        onClose();
        navigate('/budgets');
      }
    },
    {
      id: 'page-settings',
      title: 'Go to Settings & Profile',
      subtitle: 'Preferences, currency & notifications',
      icon: Settings,
      action: () => {
        onClose();
        navigate('/settings');
      }
    },
    {
      id: 'act-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`,
      subtitle: 'Toggle interface visual theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        onClose();
      }
    }
  ];

  const filtered = actions.filter(
    a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Command Palette Card */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1B3111] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#294C18] overflow-hidden z-10 animate-in fade-in zoom-in-95">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-[#294C18] bg-slate-50/50 dark:bg-[#182E0E]">
          <Search className="w-5 h-5 text-[#BCE842] shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, page name, or action (e.g., Add Transaction)..."
            autoFocus
            className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-emerald-400/60 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-200 dark:bg-[#294C18] text-slate-700 dark:text-[#BCE842] rounded-md">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-emerald-300/70 font-medium">
              No command found matching "{query}"
            </div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between rounded-xl hover:bg-slate-100 dark:hover:bg-[#294C18] text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#182E0E] text-slate-700 dark:text-[#BCE842] group-hover:bg-[#BCE842] group-hover:text-[#14240B] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-emerald-300/70">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#BCE842] opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#182E0E] border-t border-slate-100 dark:border-[#294C18] flex items-center justify-between text-[11px] text-slate-400 dark:text-emerald-400/80 font-mono">
          <span>Navigation Shortcut</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-[#294C18] rounded text-[#BCE842] font-bold">⌘K</kbd> anytime</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
