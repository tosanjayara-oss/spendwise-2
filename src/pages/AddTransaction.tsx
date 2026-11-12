import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, ShieldCheck, Sparkles, Receipt } from 'lucide-react';
import TransactionForm from '../components/transactions/TransactionForm';

export const AddTransaction: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A3D977] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transactions Ledger</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#1B3111] rounded-2xl border border-slate-200 dark:border-[#294C18] shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-[#294C18]">
          <div className="w-12 h-12 rounded-xl bg-[#294C18] text-[#BCE842] flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Record New Transaction
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80 mt-1">
              Add income earnings or track an expense item. Your dashboard balances and monthly category budgets will update automatically in real-time.
            </p>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="mt-6">
          <TransactionForm />
        </div>
      </div>

      {/* Security & Validation Notice */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] text-xs text-slate-600 dark:text-emerald-300/90 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#BCE842] shrink-0" />
        <p>
          All submitted transactions are validated and synced across the REST API service layer. Budget limits are monitored for real-time thresholds.
        </p>
      </div>
    </div>
  );
};

export default AddTransaction;
