import React, { useState, useEffect } from 'react';
import {
  User,
  Moon,
  Sun,
  Bell,
  Coins,
  RotateCcw,
  Save,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { resetAllDataToDefault } from '../services/mockData';
import { UserProfile } from '../types';

export const Settings: React.FC = () => {
  const { profile, updateProfile, theme, setTheme, currency, currencySymbol, triggerRefresh, addToast } = useApp();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    occupation: '',
    location: '',
    monthlySavingsGoal: 50000,
    bio: '',
    currency: 'INR',
    currencySymbol: '₹',
    notifications: {
      budgetAlerts: true,
      weeklyReport: true,
      largeTransactions: true,
      largeTransactionThreshold: 10000
    }
  });

  const [saving, setSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        occupation: profile.occupation || '',
        location: profile.location || '',
        monthlySavingsGoal: profile.monthlySavingsGoal || 50000,
        bio: profile.bio || '',
        currency: profile.currency || 'INR',
        currencySymbol: profile.currencySymbol || '₹',
        notifications: {
          budgetAlerts: profile.notifications?.budgetAlerts ?? true,
          weeklyReport: profile.notifications?.weeklyReport ?? true,
          largeTransactions: profile.notifications?.largeTransactions ?? true,
          largeTransactionThreshold: profile.notifications?.largeTransactionThreshold || 10000
        }
      });
    }
  }, [profile]);

  const handleCurrencyChange = (newCurrency: 'INR' | 'USD' | 'EUR' | 'GBP') => {
    let symbol = '₹';
    if (newCurrency === 'USD') symbol = '$';
    if (newCurrency === 'EUR') symbol = '€';
    if (newCurrency === 'GBP') symbol = '£';

    setFormData(prev => ({
      ...prev,
      currency: newCurrency,
      currencySymbol: symbol
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  const handleResetData = () => {
    resetAllDataToDefault();
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'All dummy transactions and budgets restored.'
    });
    setResetConfirm(false);
    triggerRefresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Preferences & Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-emerald-300/80">
          Manage personal details, default reporting currency, notifications, and visual styling
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Profile Information */}
        <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-[#0d4a34]">
            <User className="w-5 h-5 text-[#0d5c3a] dark:text-[#c2f138]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Profile Information
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={profile?.avatarUrl || '/src/assets/images/user_avatar_1794458059728.jpg'}
              alt={profile?.name || 'Profile Avatar'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#c2f138]/50 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-emerald-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-emerald-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-emerald-300 uppercase tracking-wider mb-1">
                Role / Profession
              </label>
              <input
                type="text"
                value={formData.occupation || ''}
                onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-emerald-300 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, India"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-xs font-semibold rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-emerald-300 uppercase tracking-wider mb-1">
              Monthly Savings Target ({formData.currencySymbol})
            </label>
            <input
              type="number"
              value={formData.monthlySavingsGoal || ''}
              onChange={e => setFormData({ ...formData, monthlySavingsGoal: Number(e.target.value) })}
              className="w-full sm:w-1/2 px-3 py-2 bg-slate-50 dark:bg-[#093727] border border-slate-200 dark:border-[#0d4a34] text-sm font-extrabold font-mono text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
            />
          </div>
        </div>

        {/* Section 2: Currency Selection */}
        <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-[#0d4a34]">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-[#c2f138]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Currency Selection
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-emerald-300/80">
            Select your preferred display currency across all charts, cards, and counters:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { code: 'INR', name: 'Indian Rupee', symbol: '₹', badge: 'Default' },
              { code: 'USD', name: 'US Dollar', symbol: '$' },
              { code: 'EUR', name: 'Euro', symbol: '€' },
              { code: 'GBP', name: 'British Pound', symbol: '£' }
            ].map(curr => (
              <button
                key={curr.code}
                type="button"
                onClick={() => handleCurrencyChange(curr.code as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  formData.currency === curr.code
                    ? 'border-[#c2f138] bg-[#0d4a34] text-[#c2f138] shadow-xs'
                    : 'border-slate-200 dark:border-[#0d4a34] hover:border-[#125e43]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg font-mono">{curr.symbol}</span>
                  {curr.badge && (
                    <span className="text-[10px] bg-[#c2f138]/20 text-[#c2f138] font-bold px-1.5 py-0.5 rounded">
                      {curr.badge}
                    </span>
                  )}
                </div>
                <div className="font-extrabold text-xs mt-2 text-slate-900 dark:text-white">{curr.code}</div>
                <div className="text-[11px] text-slate-400 dark:text-emerald-400/60">{curr.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Interface Theme */}
        <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-[#0d4a34]">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-[#c2f138]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Theme
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Clean Mint Light', desc: 'Light mint background & forest sidebar', icon: Sun },
              { id: 'dark', label: 'Dark Forest Theme', desc: 'Deep obsidian green & electric lime', icon: Moon },
              { id: 'system', label: 'System Default', desc: 'Syncs with operating system theme', icon: Sliders }
            ].map(t => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#c2f138] bg-[#0d4a34] text-[#c2f138] shadow-xs'
                      : 'border-slate-200 dark:border-[#0d4a34] hover:border-[#125e43]'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#c2f138]' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-emerald-300/80 mt-0.5">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Notification Preferences */}
        <div className="bg-white dark:bg-[#06281c] rounded-2xl p-6 border border-emerald-900/10 dark:border-[#0d4a34] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-[#0d4a34]">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Alerts & Notifications
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#093727] cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Budget Overrun Warnings
                </span>
                <span className="text-[11px] text-slate-400 dark:text-emerald-300/70">
                  Trigger alert notifications when category spending hits 80% or exceeds 100%
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications?.budgetAlerts ?? true}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications!, budgetAlerts: e.target.checked }
                  }))
                }
                className="w-4 h-4 text-[#0d5c3a] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#093727] cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Weekly Summary Reports
                </span>
                <span className="text-[11px] text-slate-400 dark:text-emerald-300/70">
                  Receive consolidated weekly expenditure summaries
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications?.weeklyReport ?? true}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications!, weeklyReport: e.target.checked }
                  }))
                }
                className="w-4 h-4 text-[#0d5c3a] rounded"
              />
            </label>
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Default</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#c2f138] hover:bg-[#b1df2f] text-[#06281c] font-black text-xs rounded-xl shadow-md shadow-[#c2f138]/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setResetConfirm(false)}
          />
          <div className="relative bg-white dark:bg-[#06281c] rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-[#0d4a34] shadow-xl z-10 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Demo Data</h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80 mt-2">
              This will reseed all mock transactions, category budgets, and initial dummy values.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-[#0d4a34] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                Yes, Reseed Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
