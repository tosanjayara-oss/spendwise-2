import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw, Landmark, AlertCircle } from 'lucide-react';
import currencyService, { SUPPORTED_CURRENCIES, CurrencyRateData } from '../../services/currencyService';

export const CurrencyConverterWidget: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  const [rateData, setRateData] = useState<CurrencyRateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchRates = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const data = await currencyService.getExchangeRates('INR');
      setRateData(data);
    } catch (err: any) {
      setError('Temporarily unavailable. Showing cached rates.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const numAmount = parseFloat(amount) || 0;
  const convertedValue = rateData
    ? currencyService.convertAmount(numAmount, fromCurrency, toCurrency, rateData.rates)
    : 0;

  const fromSymbol = SUPPORTED_CURRENCIES.find(c => c.code === fromCurrency)?.symbol || '';
  const toSymbol = SUPPORTED_CURRENCIES.find(c => c.code === toCurrency)?.symbol || '';

  // Single unit exchange rate calculation
  const singleUnitRate = rateData
    ? currencyService.convertAmount(1, fromCurrency, toCurrency, rateData.rates)
    : 0;

  return (
    <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-5 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#294C18] text-[#BCE842]">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Currency Exchange Rate
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/80">
              Frankfurter API / ECB Reference Rates
            </p>
          </div>
        </div>
        <button
          onClick={fetchRates}
          disabled={isRefreshing}
          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-[#BCE842] rounded-lg transition-colors disabled:opacity-50"
          title="Refresh rates"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#BCE842]' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <div className="inline-block w-5 h-5 border-2 border-[#BCE842] border-t-transparent rounded-full animate-spin mb-1" />
          <p>Fetching real-time exchange rates...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {error && (
            <div className="p-2 text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-[#A3D977] uppercase tracking-wider mb-1">
              Amount to Convert
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 dark:text-[#BCE842] text-sm">
                {fromSymbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="100"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] text-sm font-extrabold font-mono text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BCE842]"
              />
            </div>
          </div>

          {/* Currency Selectors & Swap Button */}
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-emerald-400/80 mb-0.5">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] text-xs font-bold rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#BCE842]"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center pt-3">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#294C18] hover:bg-slate-200 dark:hover:bg-[#34601E] text-slate-700 dark:text-[#BCE842] transition-colors"
                title="Swap currencies"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-emerald-400/80 mb-0.5">
                To
              </label>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] text-xs font-bold rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#BCE842]"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Output Card */}
          <div className="p-3 bg-slate-50 dark:bg-[#182E0E] rounded-xl border border-slate-100 dark:border-[#294C18] text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-emerald-300/80 block">
              Converted Amount
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#3B6622] dark:text-[#BCE842] mt-0.5 tabular-nums">
              {toSymbol} {convertedValue.toLocaleString('en-IN')} {toCurrency}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-emerald-200/80 font-mono">
              1 {fromCurrency} = {toSymbol}{singleUnitRate} {toCurrency}
            </div>
          </div>
        </div>
      )}

      {/* Footer Timestamp & Source */}
      {rateData && (
        <div className="pt-2 border-t border-slate-100 dark:border-[#294C18] flex items-center justify-between text-[10px] text-slate-400 dark:text-emerald-400/70">
          <span className="truncate">Source: {rateData.source}</span>
          <span className="shrink-0 font-mono">Updated: {new Date(rateData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverterWidget;
