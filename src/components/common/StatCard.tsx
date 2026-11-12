import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  accentColor?: 'blue' | 'green' | 'red' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  accentColor = 'neutral'
}) => {
  let accentBorder = 'border-slate-200 dark:border-slate-800';
  let iconBg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  if (accentColor === 'blue') {
    iconBg = 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400';
  } else if (accentColor === 'green') {
    iconBg = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400';
  } else if (accentColor === 'red') {
    iconBg = 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400';
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl p-5 border ${accentBorder} shadow-sm transition-all duration-150 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className={`p-2 rounded-lg ${iconBg} shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
          {value}
        </div>

        {(trend || subtext) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-semibold tabular-nums ${
                  trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
            {trend?.label && (
              <span className="text-slate-500 dark:text-slate-400">
                {trend.label}
              </span>
            )}
            {!trend && subtext && (
              <span className="text-slate-500 dark:text-slate-400 truncate">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
