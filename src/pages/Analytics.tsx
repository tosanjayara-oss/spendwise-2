import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  CreditCard,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import analyticsService from '../services/analyticsService';
import { AnalyticsSummary } from '../types';
import StatCard from '../components/common/StatCard';
import { formatCurrency } from '../utils/formatters';

export const Analytics: React.FC = () => {
  const { currency, currencySymbol, refreshTrigger } = useApp();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '6m'>('30d');

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getAnalyticsData(timeframe);
        if (isMounted && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, [timeframe, refreshTrigger]);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
        <div className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  const {
    monthlyIncomeVsExpense = [],
    categoryBreakdown = [],
    dailySpendingTrends = [],
    paymentMethodBreakdown = [],
    keyMetrics = {
      averageDailySpending: 0,
      highestSpendingCategory: { name: 'Housing & Rent', amount: 0 },
      savingsRate: 0,
      projectedMonthEndExpense: 0,
      largestTransaction: { description: '', amount: 0, date: '' }
    }
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial & Spending Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deep dive into spending velocity, category allocations, and savings velocity
          </p>
        </div>

        {/* Timeframe Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeframe === '30d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeframe === '90d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last Quarter
          </button>
          <button
            onClick={() => setTimeframe('6m')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeframe === '6m'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past 6 Months
          </button>
        </div>
      </div>

      {/* 4 Analytical KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Daily Spending"
          value={formatCurrency(keyMetrics.averageDailySpending, currency, currencySymbol)}
          subtext="Computed over 30 days"
          icon={<TrendingUp className="w-4 h-4" />}
          accentColor="blue"
        />
        <StatCard
          title="Highest Spending Category"
          value={keyMetrics.highestSpendingCategory.name}
          subtext={`${formatCurrency(keyMetrics.highestSpendingCategory.amount, currency, currencySymbol)} total`}
          icon={<Target className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          title="Savings Analysis"
          value={`${keyMetrics.savingsRate}%`}
          trend={{ value: '+4.5%', isPositive: true, label: 'savings margin' }}
          icon={<Sparkles className="w-4 h-4" />}
          accentColor="green"
        />
        <StatCard
          title="Projected Month-End"
          value={formatCurrency(keyMetrics.projectedMonthEndExpense, currency, currencySymbol)}
          subtext="Forecasted based on current run-rate"
          icon={<Zap className="w-4 h-4" />}
          accentColor="neutral"
        />
      </div>

      {/* Main Income, Expense & Savings Trend Area Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              6-Month Income, Expense & Net Savings Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historical performance demonstrating capital accumulation over time
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Net Savings
            </span>
          </div>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyIncomeVsExpense} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val), currency, currencySymbol), '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Category Breakdown & Daily Spending Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table with Progress Bars */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category-Wise Spending Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranking and share of wallet across all expenditure categories
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {categoryBreakdown.map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.category}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({item.transactionCount} entries)</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="text-slate-400">{item.percentage}%</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount, currency, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending & Payment Method Breakdown */}
        <div className="space-y-6">
          {/* Daily Spending Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Spending Rhythm (Recent 7 Days)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identifies high-expenditure days (e.g. rent / weekend spending)
              </p>
            </div>

            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySpendingTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={val => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), currency, currencySymbol), 'Spent']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Payment Channel Distribution</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                UPI vs Cards vs Net Banking distribution
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {paymentMethodBreakdown.map(pm => (
                <div key={pm.method} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                    {pm.method}
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
                    {formatCurrency(pm.amount, currency, currencySymbol)}
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {pm.percentage}% of total
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
