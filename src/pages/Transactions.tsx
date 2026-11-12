import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  X,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import transactionService from '../services/transactionService';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionModal from '../components/transactions/TransactionModal';

export const Transactions: React.FC = () => {
  const { currency, currencySymbol, refreshTrigger, triggerRefresh, addToast, openQuickAdd } = useApp();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, totalPages: 1 });

  // Modal & Deletion states
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await transactionService.getCategories();
        if (res.data) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchTxns = async () => {
      try {
        setLoading(true);
        const res = await transactionService.getTransactions({
          search,
          category: selectedCategory,
          type: selectedType,
          paymentMethod: selectedPaymentMethod,
          startDate,
          endDate,
          sortBy,
          sortOrder,
          page,
          limit
        });

        if (isMounted && res.data) {
          setTransactions(res.data);
          if (res.pagination) {
            setPaginationInfo({
              total: res.pagination.total,
              totalPages: res.pagination.totalPages
            });
          }
        }
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTxns();
    return () => {
      isMounted = false;
    };
  }, [
    search,
    selectedCategory,
    selectedType,
    selectedPaymentMethod,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    page,
    limit,
    refreshTrigger
  ]);

  const handleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleDelete = async (id: string, description: string) => {
    try {
      await transactionService.deleteTransaction(id);
      addToast({
        type: 'success',
        title: 'Transaction Deleted',
        message: `Removed ${description} from ledger.`
      });
      setDeletingId(null);
      triggerRefresh();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete transaction.'
      });
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Payment Method', 'Amount', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.type,
      t.paymentMethod,
      t.amount,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedPaymentMethod('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters =
    search || selectedCategory !== 'all' || selectedType !== 'all' || selectedPaymentMethod !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transactions History Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/80">
            Total of {paginationInfo.total} transactions logged in your financial system
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#06281c] border border-emerald-900/10 dark:border-[#0d4a34] text-slate-700 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-[#093727] text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#0d5c3a] dark:text-[#c2f138]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openQuickAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#c2f138] hover:bg-[#b1df2f] text-[#06281c] text-xs font-black rounded-xl shadow-sm shadow-[#c2f138]/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#06281c] rounded-2xl p-4 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search description, category, ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2f138] text-slate-900 dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2f138] text-slate-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.type})
                </option>
              ))}
            </select>
          </div>

          {/* Type Segmented Control */}
          <div className="flex p-1 bg-slate-100 dark:bg-[#093727] rounded-xl border border-emerald-900/10 dark:border-[#0d4a34]">
            <button
              onClick={() => { setSelectedType('all'); setPage(1); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-[#0d4a34] text-slate-900 dark:text-[#c2f138] shadow-xs'
                  : 'text-slate-500 dark:text-emerald-300/70'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => { setSelectedType('income'); setPage(1); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'income'
                  ? 'bg-[#c2f138] text-[#06281c] shadow-xs'
                  : 'text-slate-500 dark:text-emerald-300/70'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => { setSelectedType('expense'); setPage(1); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-emerald-300/70'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Payment Method */}
          <div>
            <select
              value={selectedPaymentMethod}
              onChange={e => {
                setSelectedPaymentMethod(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2f138] text-slate-900 dark:text-white"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Date Filter Range */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-[#0d4a34] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 dark:text-emerald-300/80 flex items-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#0d5c3a] dark:text-[#c2f138]" /> Date Range:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setPage(1); }}
              className="px-2 py-1 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-lg text-slate-700 dark:text-emerald-100"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setPage(1); }}
              className="px-2 py-1 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-lg text-slate-700 dark:text-emerald-100"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-[#06281c] rounded-2xl border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-[#093727]/80 border-b border-slate-200 dark:border-[#0d4a34] text-[11px] font-bold text-slate-500 dark:text-emerald-300/80 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-[#c2f138] transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-[#c2f138] transition-colors"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center gap-1">
                    <span>Description</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Method</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#c2f138] transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#0d4a34] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-[#c2f138] border-t-transparent rounded-full animate-spin" />
                    <p className="mt-2 text-xs font-semibold">Loading ledger entries...</p>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-400 dark:text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700 dark:text-white">
                      No transactions match your search or filter criteria
                    </p>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
                      Try resetting your filters or add a new transaction.
                    </p>
                    <button
                      onClick={openQuickAdd}
                      className="mt-4 px-4 py-2 bg-[#c2f138] text-[#06281c] font-black text-xs rounded-xl transition-all"
                    >
                      Record First Transaction
                    </button>
                  </td>
                </tr>
              ) : (
                transactions.map(txn => {
                  const isIncome = txn.type === 'income';
                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#093727] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 dark:text-emerald-400/80 whitespace-nowrap">
                        #{txn.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-emerald-200 whitespace-nowrap font-medium">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">
                          {txn.description}
                        </div>
                        {txn.notes && (
                          <div className="text-[11px] text-slate-400 dark:text-emerald-400/60 truncate max-w-xs">
                            {txn.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-emerald-100 whitespace-nowrap font-medium">
                        {txn.category}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            isIncome
                              ? 'bg-emerald-100/80 text-emerald-800 dark:bg-[#c2f138]/20 dark:text-[#c2f138]'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-emerald-200 whitespace-nowrap">
                        {txn.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            isIncome
                              ? 'text-emerald-600 dark:text-[#c2f138]'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(txn.amount, currency, currencySymbol)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTransaction(txn);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-[#c2f138] hover:bg-slate-100 dark:hover:bg-[#0d4a34] rounded transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(txn.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-[#0d4a34] rounded transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#093727]/60 border-t border-slate-200 dark:border-[#0d4a34] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-emerald-300/80 font-medium">
            Showing Page <span className="font-bold text-slate-800 dark:text-white">{page}</span> of{' '}
            <span className="font-bold text-slate-800 dark:text-white">{paginationInfo.totalPages}</span> ({paginationInfo.total} items)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-[#0d4a34] bg-white dark:bg-[#06281c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#093727] transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-emerald-200" />
            </button>
            <div className="px-3 py-1 font-mono tabular-nums font-bold text-slate-700 dark:text-[#c2f138]">
              {page} / {paginationInfo.totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(paginationInfo.totalPages, p + 1))}
              disabled={page >= paginationInfo.totalPages}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-[#0d4a34] bg-white dark:bg-[#06281c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#093727] transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-emerald-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {isEditModalOpen && (
        <TransactionModal
          isOpen={isEditModalOpen}
          transaction={editingTransaction}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setDeletingId(null)}
          />
          <div className="relative bg-white dark:bg-[#06281c] rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-[#0d4a34] shadow-xl z-10 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80 mt-2">
              Are you sure you want to delete transaction #{deletingId}? This action will permanently remove it from your balance.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-[#0d4a34] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = transactions.find(t => t.id === deletingId);
                  if (deletingId) handleDelete(deletingId, target?.description || 'Transaction');
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
