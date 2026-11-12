import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import goldService, { MetalPriceData } from '../../services/goldService';
import { formatCurrency } from '../../utils/formatters';

export const GoldSilverPricesWidget: React.FC = () => {
  const [data, setData] = useState<MetalPriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchMetals = async () => {
    try {
      setIsRefreshing(true);
      const res = await goldService.getMetalPrices();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch metal prices:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetals();
  }, []);

  const isGoldUp = (data?.goldChange24h || 0) >= 0;
  const isSilverUp = (data?.silverChange24h || 0) >= 0;

  return (
    <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-5 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#294C18] text-[#BCE842]">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Gold & Silver Rates (India)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/80">
              IBJA Spot & MCX Retail Indicative Rates
            </p>
          </div>
        </div>
        <button
          onClick={fetchMetals}
          disabled={isRefreshing}
          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-[#BCE842] rounded-lg transition-colors disabled:opacity-50"
          title="Refresh metal prices"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#BCE842]' : ''}`} />
        </button>
      </div>

      {loading || !data ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <div className="inline-block w-5 h-5 border-2 border-[#BCE842] border-t-transparent rounded-full animate-spin mb-1" />
          <p>Loading precious metal benchmarks...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Gold Section */}
          <div className="p-3 bg-slate-50 dark:bg-[#182E0E] rounded-xl border border-slate-100 dark:border-[#294C18]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>🥇 Gold Retail (per gram)</span>
              </span>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isGoldUp ? 'text-emerald-600 dark:text-[#BCE842]' : 'text-rose-600 dark:text-rose-400'}`}>
                {isGoldUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isGoldUp ? '+' : ''}{data.goldChange24h} ({(isGoldUp ? '+' : '')}{data.goldChangePercent24h}%)
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 rounded-lg bg-white dark:bg-[#213D13] border border-slate-200 dark:border-[#294C18]">
                <div className="text-[10px] text-slate-400 dark:text-emerald-300/80 font-bold uppercase">24K (999)</div>
                <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  ₹{data.gold24kPerGram.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-white dark:bg-[#213D13] border border-slate-200 dark:border-[#294C18]">
                <div className="text-[10px] text-slate-400 dark:text-emerald-300/80 font-bold uppercase">22K (916)</div>
                <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  ₹{data.gold22kPerGram.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-white dark:bg-[#213D13] border border-slate-200 dark:border-[#294C18]">
                <div className="text-[10px] text-slate-400 dark:text-emerald-300/80 font-bold uppercase">18K (750)</div>
                <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  ₹{data.gold18kPerGram.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Silver Section */}
          <div className="p-3 bg-slate-50 dark:bg-[#182E0E] rounded-xl border border-slate-100 dark:border-[#294C18]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-600 dark:text-slate-200 flex items-center gap-1">
                <span>🥈 Silver Benchmark</span>
              </span>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isSilverUp ? 'text-emerald-600 dark:text-[#BCE842]' : 'text-rose-600 dark:text-rose-400'}`}>
                {isSilverUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isSilverUp ? '+' : ''}{data.silverChange24h} ({(isSilverUp ? '+' : '')}{data.silverChangePercent24h}%)
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white dark:bg-[#213D13] border border-slate-200 dark:border-[#294C18]">
                <div className="text-[10px] text-slate-400 dark:text-emerald-300/80 font-bold uppercase">Silver per Gram</div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-[#BCE842] mt-0.5 tabular-nums">
                  ₹{data.silverPerGram.toFixed(2)}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white dark:bg-[#213D13] border border-slate-200 dark:border-[#294C18]">
                <div className="text-[10px] text-slate-400 dark:text-emerald-300/80 font-bold uppercase">Silver per Kg</div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-[#BCE842] mt-0.5 tabular-nums">
                  ₹{data.silverPerKg.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Timestamp & Source */}
      {data && (
        <div className="pt-2 border-t border-slate-100 dark:border-[#294C18] flex items-center justify-between text-[10px] text-slate-400 dark:text-emerald-400/70">
          <span className="truncate">{data.priceType}</span>
          <span className="shrink-0 font-mono">Updated: {new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
};

export default GoldSilverPricesWidget;
