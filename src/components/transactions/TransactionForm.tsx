import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  Check,
  AlertCircle
} from 'lucide-react';
import { Transaction, Category, PaymentMethod, TransactionType } from '../../types';
import transactionService from '../../services/transactionService';
import { useApp } from '../../context/AppContext';

interface TransactionFormProps {
  initialData?: Transaction | null;
  onSuccess?: () => void;
  isModal?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSuccess,
  isModal = false
}) => {
  const navigate = useNavigate();
  const { currencySymbol, triggerRefresh, addToast } = useApp();

  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [amount, setAmount] = useState<string>(initialData ? initialData.amount.toString() : '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [date, setDate] = useState<string>(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialData?.paymentMethod || 'UPI'
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await transactionService.getCategories();
        if (res.data) {
          setCategories(res.data);
          // Set default category if none chosen
          if (!category) {
            const firstOfType = res.data.find(c => c.type === type);
            if (firstOfType) setCategory(firstOfType.name);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, [type]);

  // When type changes, switch to first category of that type if current category doesn't match
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const validCat = categories.find(c => c.type === newType);
    if (validCat) {
      setCategory(validCat.name);
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }

    if (!description.trim()) {
      errs.description = 'Description is required';
    } else if (description.trim().length < 3) {
      errs.description = 'Description must be at least 3 characters';
    }

    if (!category.trim()) {
      errs.category = 'Please select a category';
    }

    if (!date) {
      errs.date = 'Date is required';
    }

    if (!paymentMethod) {
      errs.paymentMethod = 'Please choose a payment method';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (initialData?.id) {
        // Edit existing transaction
        await transactionService.updateTransaction(initialData.id, {
          type,
          amount: parseFloat(amount),
          description: description.trim(),
          category,
          date,
          paymentMethod,
          notes: notes.trim()
        });
        addToast({
          type: 'success',
          title: 'Transaction Updated',
          message: `${description} updated successfully.`
        });
      } else {
        // Create new transaction
        await transactionService.createTransaction({
          type,
          amount: parseFloat(amount),
          description: description.trim(),
          category,
          date,
          paymentMethod,
          notes: notes.trim()
        });
        addToast({
          type: 'success',
          title: 'Transaction Recorded',
          message: `₹${Number(amount).toLocaleString('en-IN')} ${type} recorded.`
        });
      }

      triggerRefresh();

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/transactions');
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'An error occurred while saving.'
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Segmented Toggle */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Income</span>
          </button>
        </div>
      </div>

      {/* Amount Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Amount ({currencySymbol}) *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 font-mono">
            {currencySymbol}
          </span>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
              if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
            }}
            placeholder="0.00"
            className={`w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/80 border text-2xl font-bold font-mono tabular-nums rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors ${
              errors.amount ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
        </div>
        {errors.amount && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.amount}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Description / Merchant *
        </label>
        <div className="relative">
          <input
            type="text"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            placeholder={type === 'expense' ? 'e.g. Swiggy, BESCOM Electricity, Amazon' : 'e.g. Monthly Salary, Freelance project'}
            className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800/80 border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors ${
              errors.description ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
        </div>
        {errors.description && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Category & Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Category *
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
              }}
              className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800/80 border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors ${
                errors.category ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <option value="">Select Category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Date *
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={e => {
                setDate(e.target.value);
                if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
              }}
              className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800/80 border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors ${
                errors.date ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
          {errors.date && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.date}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Payment Method *
        </label>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map(pm => (
            <button
              key={pm}
              type="button"
              onClick={() => setPaymentMethod(pm)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                paymentMethod === pm
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Notes (Optional) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Notes (Optional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add tags, bill reference numbers, or context..."
          className="w-full px-4 py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none transition-colors"
        />
      </div>

      {/* Form Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3">
        {isModal && onSuccess && (
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition-all whitespace-nowrap"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>{initialData ? 'Update Transaction' : 'Save Transaction'}</span>
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
