import React from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../../types';
import TransactionForm from './TransactionForm';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1B3111] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#294C18] p-6 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#294C18] mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {transaction ? 'Edit Transaction' : 'Record New Transaction'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A3D977]/80">
              {transaction ? `Modifying record #${transaction.id}` : 'Fill in details to log your income or expense'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-[#BCE842] rounded-xl hover:bg-slate-100 dark:hover:bg-[#294C18] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TransactionForm
          initialData={transaction}
          onSuccess={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};

export default TransactionModal;
