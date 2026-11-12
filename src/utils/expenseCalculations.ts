import { Transaction, Budget, Category } from '../types';

export interface DynamicCalculations {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  totalSavings: number;
  savingsRate: number;
  monthlyBudgetTotal: number;
  remainingBudget: number;
  categoryExpenses: { name: string; value: number; color: string }[];
  incomeVsExpenseMonthly: { month: string; income: number; expense: number; savings: number }[];
  recentTransactions: Transaction[];
  budgetProgress: {
    id: string;
    category: string;
    limit: number;
    spent: number;
    percentage: number;
    isOverBudget: boolean;
    color: string;
  }[];
}

/**
 * Calculates total income from a list of transactions.
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

/**
 * Calculates total expenses from a list of transactions.
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

/**
 * Calculates net balance (Income - Expenses).
 */
export function calculateTotalBalance(transactions: Transaction[], initialBalance: number = 0): number {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return initialBalance + income - expenses;
}

/**
 * Calculates net savings.
 */
export function calculateTotalSavings(transactions: Transaction[]): number {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return Math.max(0, income - expenses);
}

/**
 * Calculates savings rate percentage.
 */
export function calculateSavingsRate(transactions: Transaction[]): number {
  const income = calculateTotalIncome(transactions);
  const savings = calculateTotalSavings(transactions);
  if (income <= 0) return 0;
  return Math.round((savings / income) * 100);
}

/**
 * Calculates category-wise expense breakdown.
 */
export function calculateCategoryExpenses(
  transactions: Transaction[],
  categories: Category[]
): { name: string; value: number; color: string }[] {
  const expenseMap: Record<string, number> = {};
  const colorMap: Record<string, string> = {};

  categories.forEach(c => {
    colorMap[c.name] = c.color;
  });

  const defaultColors = ['#BCE842', '#10B981', '#84CC16', '#06B6D4', '#EAB308', '#F43F5E', '#A855F7'];
  let defaultIdx = 0;

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + Number(t.amount);
    });

  return Object.entries(expenseMap)
    .map(([name, value]) => {
      const color = colorMap[name] || defaultColors[(defaultIdx++) % defaultColors.length];
      return { name, value, color };
    })
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculates month-by-month income vs expense trends from actual transactions.
 */
export function calculateMonthlyIncomeVsExpense(
  transactions: Transaction[]
): { month: string; income: number; expense: number; savings: number }[] {
  const monthMap: Record<string, { income: number; expense: number }> = {};

  // Group by YYYY-MM
  transactions.forEach(t => {
    if (!t.date) return;
    const dateObj = new Date(t.date);
    if (isNaN(dateObj.getTime())) return;
    
    const monthKey = dateObj.toLocaleString('en-US', { month: 'short' });
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expense: 0 };
    }

    if (t.type === 'income') {
      monthMap[monthKey].income += Number(t.amount);
    } else if (t.type === 'expense') {
      monthMap[monthKey].expense += Number(t.amount);
    }
  });

  const monthOrder = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const presentMonths = Object.keys(monthMap);

  const monthsToUse = monthOrder.filter(m => presentMonths.includes(m));
  if (monthsToUse.length === 0) {
    monthsToUse.push('Oct', 'Nov');
  }

  return monthsToUse.map(m => {
    const data = monthMap[m] || { income: 0, expense: 0 };
    const savings = Math.max(0, data.income - data.expense);
    return {
      month: m,
      income: data.income,
      expense: data.expense,
      savings
    };
  });
}

/**
 * Calculates budget progress based on actual transactions.
 */
export function calculateBudgetProgress(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[]
): {
  id: string;
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  isOverBudget: boolean;
  color: string;
}[] {
  const currentMonth = new Date().toISOString().substring(0, 7);
  const categorySpentMap: Record<string, number> = {};

  // Sum active month expenses per category
  transactions
    .filter(t => t.type === 'expense' && t.date && t.date.startsWith(currentMonth))
    .forEach(t => {
      categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + Number(t.amount);
    });

  const categoryColorMap: Record<string, string> = {};
  categories.forEach(c => {
    categoryColorMap[c.name] = c.color;
  });

  return budgets.map(b => {
    const actualSpent = categorySpentMap[b.category] ?? b.spent;
    const percentage = b.monthlyLimit > 0 ? Math.round((actualSpent / b.monthlyLimit) * 100) : 0;
    return {
      id: b.id,
      category: b.category,
      limit: b.monthlyLimit,
      spent: actualSpent,
      percentage,
      isOverBudget: actualSpent > b.monthlyLimit,
      color: categoryColorMap[b.category] || '#BCE842'
    };
  });
}

/**
 * Computes all aggregate metrics from transaction & budget store.
 */
export function computeDashboardSummary(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[]
): DynamicCalculations {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const totalBalance = calculateTotalBalance(transactions);
  const totalSavings = calculateTotalSavings(transactions);
  const savingsRate = calculateSavingsRate(transactions);

  const monthlyBudgetTotal = budgets.reduce((sum, b) => sum + (Number(b.monthlyLimit) || 0), 0);
  const budgetProgress = calculateBudgetProgress(transactions, budgets, categories);
  const totalSpentInBudgets = budgetProgress.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = Math.max(0, monthlyBudgetTotal - totalSpentInBudgets);

  const categoryExpenses = calculateCategoryExpenses(transactions, categories);
  const incomeVsExpenseMonthly = calculateMonthlyIncomeVsExpense(transactions);

  // Latest 5 transactions sorted by date descending
  const sorted = [...transactions].sort((a, b) => (b.date > a.date ? 1 : -1));
  const recentTransactions = sorted.slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    totalBalance,
    totalSavings,
    savingsRate,
    monthlyBudgetTotal,
    remainingBudget,
    categoryExpenses,
    incomeVsExpenseMonthly,
    recentTransactions,
    budgetProgress
  };
}
