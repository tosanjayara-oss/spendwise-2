/**
 * Formatting utilities for Indian Rupees (INR) and other currencies
 */

export function formatCurrency(amount: number, currency: string = 'INR', symbol: string = '₹'): string {
  if (isNaN(amount)) return `${symbol}0`;

  // Format with Indian numbering system when INR
  if (currency === 'INR') {
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }

  // Standard international formatting
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
}
