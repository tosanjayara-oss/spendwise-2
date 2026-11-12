import React, { useState } from 'react';
import { Target, Award, Edit2, Check, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const SavingsGoalWidget: React.FC = () => {
  const { profile, updateProfile, currency, currencySymbol } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [targetInput, setTargetInput] = useState<string>(
    (profile?.monthlySavingsGoal || 50000).toString()
  );

  const targetGoal = profile?.monthlySavingsGoal || 50000;
  
  // Estimate monthly savings from dashboard or profile
  const currentSavings = 38500; // Simulated active month savings
  const percentage = Math.min(100, Math.round((currentSavings / targetGoal) * 100));
  const remaining = Math.max(0, targetGoal - currentSavings);

  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > 0) {
      await updateProfile({ monthlySavingsGoal: val });
    }
    setIsEditing(false);
  };

  const getMilestone = () => {
    if (percentage >= 100) return { label: 'Goal Mastered! 🎉', color: 'bg-[#BCE842] text-[#14240B]' };
    if (percentage >= 75) return { label: '75% Threshold Milestone', color: 'bg-emerald-500/20 text-emerald-400' };
    if (percentage >= 50) return { label: '50% Halfway Badge', color: 'bg-amber-500/20 text-amber-400' };
    return { label: 'Target In Progress', color: 'bg-blue-500/20 text-blue-400' };
  };

  const milestone = getMilestone();

  return (
    <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-5 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#294C18] text-[#BCE842]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Monthly Savings Goal
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/80">
              Wealth accumulation milestone
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1.5 text-slate-400 hover:text-[#BCE842] rounded-lg transition-colors"
          title="Edit target goal"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveTarget} className="space-y-3 py-1">
          <label className="block text-xs font-bold text-slate-600 dark:text-[#A3D977] uppercase tracking-wider">
            Set Monthly Target ({currencySymbol})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={targetInput}
              onChange={e => setTargetInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] rounded-xl text-sm font-extrabold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#BCE842]"
            />
            <button
              type="submit"
              className="p-2 bg-[#BCE842] text-[#14240B] rounded-xl font-bold hover:bg-[#A6D42E] transition-colors"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 dark:text-emerald-400/80 font-semibold block">
                Saved This Month
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                {formatCurrency(currentSavings, currency, currencySymbol)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 dark:text-emerald-400/80 font-semibold block">
                Target Goal
              </span>
              <div className="text-sm font-extrabold font-mono text-slate-600 dark:text-[#BCE842] mt-0.5 tabular-nums">
                {formatCurrency(targetGoal, currency, currencySymbol)}
              </div>
            </div>
          </div>

          {/* Progress Bar & Milestone Tag */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black ${milestone.color}`}>
                {milestone.label}
              </span>
              <span className="font-mono text-[#BCE842]">{percentage}% Reached</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-[#182E0E] rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-[#294C18]">
              <div
                className="h-full bg-[#BCE842] rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#182E0E] border border-slate-100 dark:border-[#294C18] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-emerald-300/80 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#BCE842]" /> Remaining to target:
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {remaining > 0 ? formatCurrency(remaining, currency, currencySymbol) : 'Target Achieved! 🎉'}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#294C18] flex items-center justify-between text-[10px] text-slate-400 dark:text-emerald-400/70 font-mono">
        <span>Target Period: Monthly</span>
        <span>Goal Auto-Tracked</span>
      </div>
    </div>
  );
};

export default SavingsGoalWidget;
