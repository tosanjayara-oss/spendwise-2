import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { currency, currencySymbol } = useApp();

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  const handleDownload = () => {
    if (!transaction.receiptUrl) return;
    const link = document.createElement('a');
    link.href = transaction.receiptUrl;
    link.download = `Receipt_${transaction.id}_${transaction.description.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-[#1B3111] rounded-2xl border border-emerald-900/10 dark:border-[#294C18] shadow-2xl max-w-lg w-full p-6 z-10 animate-in fade-in zoom-in-95 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18]">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Receipt Attachment</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-[#BCE842] bg-[#BCE842]/10 px-2 py-0.5 rounded-full">
                #{transaction.id}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80">
              {transaction.description} • {formatDate(transaction.date)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#294C18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Image / Preview Area */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 flex items-center justify-center min-h-[240px] max-h-[380px]">
          {transaction.receiptUrl ? (
            <img
              src={transaction.receiptUrl}
              alt={`Receipt for ${transaction.description}`}
              className="max-h-[360px] w-auto object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-semibold">No receipt image attached to this record.</p>
            </div>
          )}
        </div>

        {/* Transaction Summary Details */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-[#182E0E] rounded-xl border border-slate-100 dark:border-[#294C18] text-xs">
          <div>
            <span className="text-slate-400 dark:text-emerald-400/80 block font-medium">Category</span>
            <span className="font-bold text-slate-800 dark:text-white">{transaction.category}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-emerald-400/80 block font-medium">Payment Method</span>
            <span className="font-bold text-slate-800 dark:text-white">{transaction.paymentMethod}</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-[#294C18] flex items-center justify-between">
            <span className="text-slate-400 dark:text-emerald-400/80 font-medium">Total Amount</span>
            <span className={`text-base font-black font-mono ${isIncome ? 'text-emerald-600 dark:text-[#BCE842]' : 'text-rose-600 dark:text-rose-400'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency, currencySymbol)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {transaction.receiptUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-[#294C18] hover:bg-slate-200 dark:hover:bg-[#34601E] text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-[#BCE842]" />
              <span>Download Image</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] text-xs font-black rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
