import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Target,
  Clock,
  ArrowRight,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import dashboardService from '../services/dashboardService';
import { DashboardSummary } from '../types';
import StatCard from '../components/common/StatCard';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const { currency, currencySymbol, refreshTrigger, openQuickAdd } = useApp();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardData();
        if (isMounted && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
          <div className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
        </div>
      </div>
    );
  }

  const {
    totalBalance = 0,
    totalIncome = 0,
    totalExpenses = 0,
    totalSavings = 0,
    monthlyBudget = 0,
    remainingBudget = 0,
    savingsRate = 0,
    incomeVsExpenseMonthly = [],
    categoryExpenses = [],
    recentTransactions = [],
    budgetProgress = []
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Banner Quick Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Financial Health Overview
          </span>
          <h2 className="text-2xl font-bold mt-1 tracking-tight">
            Net Worth Balance: <span className="text-white font-mono">{formatCurrency(totalBalance, currency, currencySymbol)}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            You have saved {savingsRate}% of your total income this period. Your monthly remaining budget is{' '}
            <span className="font-semibold text-emerald-400 font-mono">{formatCurrency(remainingBudget, currency, currencySymbol)}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openQuickAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors"
          >
            <span>Detailed Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance, currency, currencySymbol)}
          subtext="Liquid capital available"
          icon={<Wallet className="w-4 h-4" />}
          accentColor="blue"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome, currency, currencySymbol)}
          trend={{ value: '+14.2%', isPositive: true, label: 'vs last month' }}
          icon={<ArrowUpRight className="w-4 h-4" />}
          accentColor="green"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses, currency, currencySymbol)}
          trend={{ value: '-3.8%', isPositive: true, label: 'vs average' }}
          icon={<ArrowDownRight className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(totalSavings, currency, currencySymbol)}
          subtext={`${savingsRate}% savings rate`}
          icon={<PiggyBank className="w-4 h-4" />}
          accentColor="green"
        />
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(monthlyBudget, currency, currencySymbol)}
          subtext="Active limit caps"
          icon={<Target className="w-4 h-4" />}
          accentColor="blue"
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget, currency, currencySymbol)}
          subtext={remainingBudget > 0 ? 'Within threshold' : 'Limit exceeded'}
          icon={<Clock className="w-4 h-4" />}
          accentColor={remainingBudget > 0 ? 'green' : 'red'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income vs Expense Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Income vs Expenses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly comparison showing earnings against expenditure
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Expense
              </span>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseMonthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency, currencySymbol), '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Expenses by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of where your money goes
            </p>
          </div>

          <div className="h-64 w-full mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency, currencySymbol), 'Spent']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto text-xs">
            {categoryExpenses.slice(0, 4).map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(cat.value, currency, currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>Recent Transactions</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest 5 logged financial entries
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {recentTransactions.map(txn => {
                  const isIncome = txn.type === 'income';
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                          {txn.description}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">#{txn.id}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {txn.category}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {txn.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono tabular-nums whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {isIncome ? '+' : '-'}{formatCurrency(txn.amount, currency, currencySymbol)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Progress (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Budget Progress</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monthly caps & limits
                </p>
              </div>
              <Link
                to="/budgets"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {budgetProgress.slice(0, 5).map(b => {
                const isOver = b.isOverBudget;
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        {isOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        <span>{b.category}</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums text-[11px]">
                        {formatCurrency(b.spent, currency, currencySymbol)} / {formatCurrency(b.limit, currency, currencySymbol)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-500' : b.percentage > 85 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/budgets"
              className="w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <span>View All 8 Category Budgets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
