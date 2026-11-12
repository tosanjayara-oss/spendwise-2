import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
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
  ResponsiveContainer
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
            <div key={i} className="h-28 bg-white dark:bg-[#06281c] rounded-2xl border border-emerald-900/10 dark:border-[#0d4a34]" />
          ))}
        </div>
        <div className="h-80 bg-white dark:bg-[#06281c] rounded-2xl border border-emerald-900/10 dark:border-[#0d4a34]" />
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

  const CATEGORY_COLORS = ['#c2f138', '#10b981', '#06b6d4', '#84cc16', '#eab308', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Top Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial & Spending Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/80">
            Deep dive into spending velocity, category allocations, and savings performance
          </p>
        </div>

        {/* Timeframe Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#093727] rounded-xl border border-emerald-900/10 dark:border-[#0d4a34]">
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === '30d'
                ? 'bg-white dark:bg-[#0d4a34] text-slate-900 dark:text-[#c2f138] shadow-xs'
                : 'text-slate-600 dark:text-emerald-300/70'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === '90d'
                ? 'bg-white dark:bg-[#0d4a34] text-slate-900 dark:text-[#c2f138] shadow-xs'
                : 'text-slate-600 dark:text-emerald-300/70'
            }`}
          >
            Last Quarter
          </button>
          <button
            onClick={() => setTimeframe('6m')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === '6m'
                ? 'bg-white dark:bg-[#0d4a34] text-slate-900 dark:text-[#c2f138] shadow-xs'
                : 'text-slate-600 dark:text-emerald-300/70'
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
          icon={<TrendingUp className="w-4 h-4 text-[#0d5c3a] dark:text-[#c2f138]" />}
          accentColor="blue"
        />
        <StatCard
          title="Highest Spending Category"
          value={keyMetrics.highestSpendingCategory.name}
          subtext={`${formatCurrency(keyMetrics.highestSpendingCategory.amount, currency, currencySymbol)} total`}
          icon={<Target className="w-4 h-4 text-rose-500" />}
          accentColor="red"
        />
        <StatCard
          title="Savings Margin"
          value={`${keyMetrics.savingsRate}%`}
          trend={{ value: '+4.5%', isPositive: true, label: 'savings margin' }}
          icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
          accentColor="green"
        />
        <StatCard
          title="Projected Month-End"
          value={formatCurrency(keyMetrics.projectedMonthEndExpense, currency, currencySymbol)}
          subtext="Forecasted based on current run-rate"
          icon={<Zap className="w-4 h-4 text-[#c2f138]" />}
          accentColor="neutral"
        />
      </div>

      {/* Main Area Chart */}
      <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-[#0d4a34] gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              6-Month Income, Expense & Net Savings Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80">
              Historical performance demonstrating capital accumulation
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-[#c2f138]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c2f138]" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Net Savings
            </span>
          </div>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyIncomeVsExpense} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c2f138" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c2f138" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#125e43" opacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#10b981' }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#10b981' }}
                tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val), currency, currencySymbol), '']}
                contentStyle={{
                  backgroundColor: '#06281c',
                  border: '1px solid #0d4a34',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="income" name="Income" stroke="#c2f138" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm">
          <div className="pb-4 border-b border-slate-100 dark:border-[#0d4a34]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Spending Allocation
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80">
              Ranking and share of wallet across all categories
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {categoryBreakdown.map((item, idx) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                    <span>{item.category}</span>
                    <span className="text-[11px] text-slate-400 dark:text-emerald-400/60 font-normal">({item.transactionCount} entries)</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="text-slate-400 dark:text-emerald-400/80">{item.percentage}%</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount, currency, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-[#093727] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%`, backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending & Payment Method Breakdown */}
        <div className="space-y-6">
          {/* Daily Spending Timeline */}
          <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm">
            <div className="pb-4 border-b border-slate-100 dark:border-[#0d4a34]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Spending Velocity (Recent 7 Days)
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/80">
                Identifies high expenditure days
              </p>
            </div>

            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySpendingTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#125e43" opacity={0.2} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#10b981' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#10b981' }}
                    tickFormatter={val => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), currency, currencySymbol), 'Spent']}
                    contentStyle={{
                      backgroundColor: '#06281c',
                      border: '1px solid #0d4a34',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="amount" fill="#c2f138" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm">
            <div className="pb-3 border-b border-slate-100 dark:border-[#0d4a34]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0d5c3a] dark:text-[#c2f138]" />
                <span>Payment Channels</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/80">
                UPI vs Cards vs Net Banking breakdown
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {paymentMethodBreakdown.map(pm => (
                <div key={pm.method} className="p-3 bg-slate-50 dark:bg-[#093727] rounded-xl border border-slate-100 dark:border-[#0d4a34]">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-emerald-300/80 block truncate">
                    {pm.method}
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
                    {formatCurrency(pm.amount, currency, currencySymbol)}
                  </div>
                  <span className="text-[10px] text-[#0d5c3a] dark:text-[#c2f138] font-bold">
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
