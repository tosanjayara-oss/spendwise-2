import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Target,
  Clock,
  ArrowRight,
  AlertTriangle,
  Receipt,
  Eye,
  EyeOff,
  QrCode,
  Globe,
  ChevronUp,
  ChevronDown
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
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import dashboardService from '../services/dashboardService';
import { DashboardSummary } from '../types';
import StatCard from '../components/common/StatCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import CurrencyConverterWidget from '../components/widgets/CurrencyConverterWidget';
import GoldSilverPricesWidget from '../components/widgets/GoldSilverPricesWidget';
import FuelPricesWidget from '../components/widgets/FuelPricesWidget';

export const Dashboard: React.FC = () => {
  const { currency, currencySymbol, refreshTrigger, openQuickAdd } = useApp();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showLiveWidgets, setShowLiveWidgets] = useState<boolean>(true);

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
        <div className="h-64 bg-[#3B6622]/20 rounded-3xl border border-[#294C18]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-[#1B3111] rounded-2xl border border-emerald-900/10 dark:border-[#294C18]" />
          ))}
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

  const CHART_COLORS = ['#BCE842', '#10B981', '#06B6D4', '#84CC16', '#EAB308', '#F43F5E', '#A855F7'];

  return (
    <div className="space-y-6">
      {/* Top Main Featured Financial Card - Artichoke Botanical Green Theme (#3B6622) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#3B6622] text-white p-6 sm:p-8 shadow-xl shadow-[#3B6622]/30 border border-[#4E7933] bg-card-concentric">
        {/* Subtle decorative concentric vector circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full border border-white/10 -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/5 -mr-28 -mt-28 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between space-y-6">
          {/* Top Row: Total Balance label & Eye Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-100 tracking-wide">
              Total Balance
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              title={showBalance ? "Hide balance" : "Show balance"}
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5 text-[#BCE842]" />}
            </button>
          </div>

          {/* Main Amount & Virtual Card Mask */}
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white drop-shadow-xs">
              {showBalance ? (
                formatCurrency(totalBalance, currency, currencySymbol)
              ) : (
                <span className="font-mono text-emerald-200/60">••••••••</span>
              )}
            </div>
            <div className="mt-2 text-xs font-mono tracking-widest text-emerald-200/90 font-medium">
              **** **** 9876
            </div>
          </div>

          {/* Progress Bar & Limit Info */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-100">
              <span>Transfer / Monthly Limit</span>
              <span className="font-mono font-bold text-white">{formatCurrency(monthlyBudget || 100000, currency, currencySymbol)}</span>
            </div>
            <div className="w-full bg-[#182E0E] rounded-full h-3 p-0.5 border border-[#2B4C1A] overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 shadow-xs"
                style={{
                  width: `${Math.min(100, (totalExpenses / (monthlyBudget || 100000)) * 100)}%`
                }}
              />
            </div>
            <div className="text-xs text-emerald-100 font-bold">
              Spent in a month {formatCurrency(totalExpenses, currency, currencySymbol)}
            </div>
          </div>

          {/* Bottom Action Pill Buttons Row */}
          <div className="pt-3 grid grid-cols-3 gap-3 max-w-lg">
            <button
              onClick={openQuickAdd}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#294C18] hover:bg-[#34601E] text-white text-xs font-bold rounded-xl transition-all shadow-xs border border-[#427B27]/40 hover:scale-[1.02]"
            >
              <ArrowUpRight className="w-4 h-4 text-[#BCE842]" />
              <span>↑ Send</span>
            </button>

            <button
              onClick={openQuickAdd}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#294C18] hover:bg-[#34601E] text-white text-xs font-bold rounded-xl transition-all shadow-xs border border-[#427B27]/40 hover:scale-[1.02]"
            >
              <ArrowDownLeft className="w-4 h-4 text-[#BCE842]" />
              <span>↓ Receive</span>
            </button>

            <button
              onClick={openQuickAdd}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] text-xs font-black rounded-xl transition-all shadow-md shadow-[#BCE842]/20 hover:scale-[1.02]"
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
              <span>Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance, currency, currencySymbol)}
          subtext="Liquid capital available"
          icon={<Wallet className="w-4 h-4 text-[#3B6622] dark:text-[#BCE842]" />}
          accentColor="blue"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome, currency, currencySymbol)}
          trend={{ value: '+14.2%', isPositive: true, label: 'vs last month' }}
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-[#BCE842]" />}
          accentColor="green"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses, currency, currencySymbol)}
          trend={{ value: '-3.8%', isPositive: true, label: 'vs average' }}
          icon={<ArrowDownLeft className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          accentColor="red"
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(totalSavings, currency, currencySymbol)}
          subtext={`${savingsRate}% savings rate`}
          icon={<PiggyBank className="w-4 h-4 text-emerald-600 dark:text-[#BCE842]" />}
          accentColor="green"
        />
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(monthlyBudget, currency, currencySymbol)}
          subtext="Active limit caps"
          icon={<Target className="w-4 h-4 text-[#3B6622] dark:text-[#BCE842]" />}
          accentColor="blue"
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget, currency, currencySymbol)}
          subtext={remainingBudget > 0 ? 'Within threshold' : 'Limit exceeded'}
          icon={<Clock className="w-4 h-4 text-emerald-600 dark:text-[#BCE842]" />}
          accentColor={remainingBudget > 0 ? 'green' : 'red'}
        />
      </div>

      {/* LIVE FINANCIAL INFORMATION Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#BCE842]" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
              LIVE FINANCIAL INFORMATION
            </h2>
            <span className="text-[10px] font-mono bg-[#BCE842]/20 text-[#BCE842] font-bold px-2 py-0.5 rounded-full">
              Real-Time Feed
            </span>
          </div>
          <button
            onClick={() => setShowLiveWidgets(!showLiveWidgets)}
            className="flex items-center gap-1 text-xs font-bold text-[#BCE842] hover:underline"
          >
            <span>{showLiveWidgets ? 'Hide Widgets' : 'Show Widgets'}</span>
            {showLiveWidgets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showLiveWidgets && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in zoom-in-95">
            <CurrencyConverterWidget />
            <GoldSilverPricesWidget />
            <FuelPricesWidget />
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income vs Expense Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1B3111] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-[#294C18] gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Income vs Expenses Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/80">
                Monthly comparison showing earnings against expenditure
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-[#BCE842]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#BCE842]" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Expense
              </span>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseMonthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#294C18" opacity={0.3} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#bce842' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#bce842' }}
                  tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency, currencySymbol), '']}
                  contentStyle={{
                    backgroundColor: '#182E0E',
                    border: '1px solid #294C18',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#bce842" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-[#294C18]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Expenses by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80">
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
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency, currencySymbol), 'Spent']}
                  contentStyle={{
                    backgroundColor: '#182E0E',
                    border: '1px solid #294C18',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto text-xs">
            {categoryExpenses.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-slate-700 dark:text-emerald-100">
                <span className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(cat.value, currency, currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1B3111] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#294C18] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#294C18]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#3B6622] dark:text-[#BCE842]" />
                <span>Recent Ledger Entries</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/80">
                Latest 5 financial logs
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-bold text-[#3B6622] dark:text-[#BCE842] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#294C18] text-[11px] font-bold text-slate-500 dark:text-emerald-400/80 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#294C18] text-xs">
                {recentTransactions.map(txn => {
                  const isIncome = txn.type === 'income';
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/80 dark:hover:bg-[#213D13] transition-colors">
                      <td className="py-3 px-3 text-slate-500 dark:text-emerald-300/80 whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                          {txn.description}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-emerald-500 font-mono">#{txn.id}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-emerald-200 whitespace-nowrap">
                        {txn.category}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-emerald-300/80 whitespace-nowrap">
                        {txn.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono tabular-nums whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-600 dark:text-[#BCE842]' : 'text-rose-600 dark:text-rose-400'}>
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

        {/* Budget Progress */}
        <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#294C18]">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#3B6622] dark:text-[#BCE842]" />
                  <span>Budget Limits</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/80">
                  Monthly caps & limits
                </p>
              </div>
              <Link
                to="/budgets"
                className="text-xs font-bold text-[#3B6622] dark:text-[#BCE842] hover:underline flex items-center gap-1"
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
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        {isOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        <span>{b.category}</span>
                      </span>
                      <span className="text-slate-500 dark:text-emerald-300/70 font-mono tabular-nums text-[11px]">
                        {formatCurrency(b.spent, currency, currencySymbol)} / {formatCurrency(b.limit, currency, currencySymbol)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-[#213D13] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-500' : b.percentage > 85 ? 'bg-amber-500' : 'bg-[#BCE842]'
                        }`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#294C18]">
            <Link
              to="/budgets"
              className="w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#BCE842] bg-slate-100 dark:bg-[#213D13] hover:bg-slate-200 dark:hover:bg-[#294C18] rounded-xl transition-colors"
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
