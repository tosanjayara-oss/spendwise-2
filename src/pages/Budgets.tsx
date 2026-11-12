import React, { useState, useEffect } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import budgetService from '../services/budgetService';
import transactionService from '../services/transactionService';
import { Budget, Category } from '../types';
import { formatCurrency } from '../utils/formatters';

export const Budgets: React.FC = () => {
  const { currency, currencySymbol, refreshTrigger, triggerRefresh, addToast } = useApp();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [limitInput, setLimitInput] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const [budgetRes, catRes] = await Promise.all([
          budgetService.getBudgets(),
          transactionService.getCategories()
        ]);
        if (isMounted) {
          if (budgetRes.data) setBudgets(budgetRes.data);
          if (catRes.data) setCategories(catRes.data.filter(c => c.type === 'expense'));
        }
      } catch (err) {
        console.error('Failed to load budgets', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBudgetData();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const totalBudget = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const exceededCount = budgets.filter(b => b.spent > b.monthlyLimit).length;

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setCategoryInput(categories[0]?.name || 'Food & Dining');
    setLimitInput('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setEditingBudget(b);
    setCategoryInput(b.category);
    setLimitInput(b.monthlyLimit.toString());
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitInput || isNaN(Number(limitInput)) || Number(limitInput) <= 0) {
      setFormError('Please enter a valid monthly limit greater than 0');
      return;
    }
    if (!categoryInput) {
      setFormError('Please select a category');
      return;
    }

    setSaving(true);
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, {
          category: categoryInput,
          monthlyLimit: Number(limitInput)
        });
        addToast({
          type: 'success',
          title: 'Budget Updated',
          message: `${categoryInput} budget limit updated to ${currencySymbol}${Number(limitInput).toLocaleString('en-IN')}`
        });
      } else {
        await budgetService.createBudget({
          category: categoryInput,
          monthlyLimit: Number(limitInput)
        });
        addToast({
          type: 'success',
          title: 'Budget Created',
          message: `Monthly budget configured for ${categoryInput}`
        });
      }
      setIsModalOpen(false);
      triggerRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, category: string) => {
    try {
      await budgetService.deleteBudget(id);
      addToast({
        type: 'info',
        title: 'Budget Deleted',
        message: `Removed ${category} budget`
      });
      triggerRefresh();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Monthly Expense Budgets
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/80">
            Enforce spending limits across categories to stay disciplined with targets
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] text-xs font-black rounded-xl shadow-sm shadow-[#BCE842]/20 transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#294C18] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-[#294C18]">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-[#A3D977]/90 uppercase tracking-wider">
              Total Monthly Budget Limit
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {formatCurrency(totalBudget, currency, currencySymbol)}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-[#A3D977]/90 uppercase tracking-wider">
              Total Spent in Categories
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {formatCurrency(totalSpent, currency, currencySymbol)}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-[#A3D977]/90 uppercase tracking-wider">
              Remaining Safe Spending
            </span>
            <div className={`text-2xl font-extrabold font-mono mt-1 tabular-nums ${totalRemaining > 0 ? 'text-emerald-600 dark:text-[#BCE842]' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatCurrency(totalRemaining, currency, currencySymbol)}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-slate-700 dark:text-emerald-100">
              Aggregated Utilization: {overallPercentage}%
            </span>
            {exceededCount > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {exceededCount} Category Exceeded
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-[#BCE842] flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All Budgets On Track
              </span>
            )}
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#182E0E] rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallPercentage > 100
                  ? 'bg-rose-500'
                  : overallPercentage > 80
                  ? 'bg-amber-500'
                  : 'bg-[#BCE842]'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map(budget => {
          const percentage = budget.monthlyLimit > 0 ? Math.round((budget.spent / budget.monthlyLimit) * 100) : 0;
          const isOver = budget.spent > budget.monthlyLimit;
          const remaining = Math.max(0, budget.monthlyLimit - budget.spent);
          const isNearLimit = percentage >= 80 && !isOver;

          return (
            <div
              key={budget.id}
              className={`bg-white dark:bg-[#1B3111] rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                isOver
                  ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/20 dark:bg-rose-950/40'
                  : 'border-emerald-900/10 dark:border-[#294C18] hover:border-[#3B6622]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18]">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        isOver ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-[#BCE842]'
                      }`}
                    />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {budget.category}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(budget)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-[#BCE842] hover:bg-slate-100 dark:hover:bg-[#294C18] rounded-lg transition-colors"
                      title="Edit budget limit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id, budget.category)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-[#294C18] rounded-lg transition-colors"
                      title="Delete budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 dark:text-emerald-300/80 font-semibold">Spent:</span>
                    <span className={`text-base font-extrabold font-mono tabular-nums ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                      {formatCurrency(budget.spent, currency, currencySymbol)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-slate-500 dark:text-emerald-300/80">
                    <span className="font-semibold">Limit:</span>
                    <span className="font-mono tabular-nums font-bold text-slate-700 dark:text-emerald-100">
                      {formatCurrency(budget.monthlyLimit, currency, currencySymbol)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-100 dark:border-[#294C18]">
                    <span className="text-slate-500 dark:text-emerald-300/80 font-semibold">Remaining:</span>
                    <span
                      className={`font-mono tabular-nums font-bold ${
                        isOver ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-[#BCE842]'
                      }`}
                    >
                      {isOver
                        ? `-${formatCurrency(budget.spent - budget.monthlyLimit, currency, currencySymbol)} (Over)`
                        : formatCurrency(remaining, currency, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-emerald-300">
                    <span>{percentage}% utilized</span>
                    {isOver && (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Exceeded!
                      </span>
                    )}
                    {isNearLimit && (
                      <span className="text-amber-600 dark:text-amber-400">
                        80%+ Warning
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#182E0E] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-[#BCE842]'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {isOver && (
                <div className="mt-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <p>
                    Spending exceeded by {formatCurrency(budget.spent - budget.monthlyLimit, currency, currencySymbol)}. Review recent transactions.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#1B3111] rounded-3xl p-6 border border-slate-200 dark:border-[#294C18] shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18] mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingBudget ? 'Adjust Budget Limit' : 'Configure New Budget'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-[#BCE842] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-[#A3D977] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  disabled={!!editingBudget}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#BCE842]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-[#A3D977] uppercase tracking-wider mb-1.5">
                  Monthly Limit ({currencySymbol}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 dark:text-[#BCE842] font-mono text-base">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={limitInput}
                    onChange={e => setLimitInput(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] rounded-xl text-base font-black font-mono tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#BCE842]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-[#294C18] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBudget ? 'Save Changes' : 'Create Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
