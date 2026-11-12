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
  let accentBorder = 'border-emerald-900/10 dark:border-[#294C18]';
  let iconBg = 'bg-emerald-500/10 text-emerald-700 dark:bg-[#294C18] dark:text-[#BCE842]';

  if (accentColor === 'green') {
    iconBg = 'bg-emerald-50 text-emerald-700 dark:bg-[#294C18] dark:text-[#BCE842]';
  } else if (accentColor === 'red') {
    iconBg = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
  } else if (accentColor === 'blue') {
    iconBg = 'bg-emerald-50 text-emerald-700 dark:bg-[#294C18] dark:text-[#BCE842]';
  }

  return (
    <div className={`bg-white dark:bg-[#1B3111] rounded-2xl p-5 border ${accentBorder} shadow-sm transition-all duration-150 hover:shadow-md hover:border-[#3B6622] flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A3D977]/90">
          {title}
        </span>
        {icon && (
          <div className={`p-2 rounded-xl ${iconBg} shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans tabular-nums">
          {value}
        </div>

        {(trend || subtext) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-bold tabular-nums ${
                  trend.isPositive ? 'text-emerald-600 dark:text-[#BCE842]' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
            {trend?.label && (
              <span className="text-slate-500 dark:text-emerald-300/70">
                {trend.label}
              </span>
            )}
            {!trend && subtext && (
              <span className="text-slate-500 dark:text-emerald-300/70 truncate">
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
