import React, { useState, useEffect } from 'react';
import { Fuel, RefreshCw, GitCompare, ArrowUpDown } from 'lucide-react';
import fuelService, { FuelPriceCityData, CITIES_LIST } from '../../services/fuelService';

export const FuelPricesWidget: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Chennai');
  const [compareCity, setCompareCity] = useState<string>('Bengaluru');
  const [showCompare, setShowCompare] = useState<boolean>(false);
  
  const [cityData, setCityData] = useState<FuelPriceCityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchFuelPrices = async () => {
    try {
      setIsRefreshing(true);
      const res = await fuelService.getCityFuelPrice(selectedCity);
      setCityData(res);
    } catch (err) {
      console.error('Failed to fetch fuel prices:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFuelPrices();
  }, [selectedCity]);

  const comparison = fuelService.compareCities(selectedCity, compareCity);

  return (
    <div className="bg-white dark:bg-[#1B3111] rounded-2xl p-5 border border-emerald-900/10 dark:border-[#294C18] shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294C18]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#294C18] text-[#BCE842]">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Fuel Prices (India)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/80">
              Daily Retail Petrol & Diesel Rates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              showCompare
                ? 'bg-[#BCE842] text-[#14240B]'
                : 'text-slate-400 hover:text-emerald-600 dark:hover:text-[#BCE842]'
            }`}
            title="Compare city fuel prices"
          >
            <GitCompare className="w-4 h-4" />
          </button>
          <button
            onClick={fetchFuelPrices}
            disabled={isRefreshing}
            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-[#BCE842] rounded-lg transition-colors disabled:opacity-50"
            title="Refresh fuel rates"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#BCE842]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        {/* City Select Dropdown */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-600 dark:text-[#A3D977] uppercase tracking-wider shrink-0">
            Select City:
          </label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-[#182E0E] border border-slate-200 dark:border-[#294C18] text-xs font-extrabold rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#BCE842] transition-colors"
          >
            {CITIES_LIST.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {loading || !cityData ? (
          <div className="py-6 text-center text-xs text-slate-400">
            <div className="inline-block w-5 h-5 border-2 border-[#BCE842] border-t-transparent rounded-full animate-spin mb-1" />
            <p>Loading city fuel rates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Petrol Card */}
            <div className="p-3 bg-amber-50/50 dark:bg-[#182E0E] rounded-xl border border-amber-200/60 dark:border-[#294C18] text-center">
              <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                ⛽ Petrol (1L)
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-[#BCE842] mt-1 tabular-nums">
                ₹{cityData.petrolPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-emerald-300/70 block mt-0.5 font-mono">
                {cityData.city}, {cityData.state}
              </span>
            </div>

            {/* Diesel Card */}
            <div className="p-3 bg-slate-50 dark:bg-[#182E0E] rounded-xl border border-slate-200/60 dark:border-[#294C18] text-center">
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-emerald-200 uppercase tracking-wider block">
                🚚 Diesel (1L)
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                ₹{cityData.dieselPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-emerald-300/70 block mt-0.5 font-mono">
                {cityData.city}, {cityData.state}
              </span>
            </div>
          </div>
        )}

        {/* City Comparison Feature */}
        {showCompare && (
          <div className="mt-3 p-3 bg-slate-100 dark:bg-[#182E0E] rounded-xl border border-slate-200 dark:border-[#294C18] space-y-2 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white pb-1.5 border-b border-slate-200 dark:border-[#294C18]">
              <span>City Rate Comparison</span>
              <span className="text-[10px] text-[#BCE842]">{selectedCity} vs {compareCity}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-emerald-300/80 text-[11px]">Compare to:</span>
              <select
                value={compareCity}
                onChange={e => setCompareCity(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-[#213D13] border border-slate-200 dark:border-[#294C18] text-xs font-bold rounded-lg text-slate-900 dark:text-white focus:outline-none"
              >
                {CITIES_LIST.filter(c => c !== selectedCity).map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-1.5 bg-white dark:bg-[#213D13] rounded-lg border border-slate-200 dark:border-[#294C18]">
                <div className="text-slate-500 dark:text-emerald-300/80">Petrol Diff:</div>
                <div className={`font-bold ${comparison.petrolDiff > 0 ? 'text-rose-500' : comparison.petrolDiff < 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {comparison.petrolDiff > 0 ? `+₹${comparison.petrolDiff}` : `₹${comparison.petrolDiff}`} /L
                </div>
              </div>

              <div className="p-1.5 bg-white dark:bg-[#213D13] rounded-lg border border-slate-200 dark:border-[#294C18]">
                <div className="text-slate-500 dark:text-emerald-300/80">Diesel Diff:</div>
                <div className={`font-bold ${comparison.dieselDiff > 0 ? 'text-rose-500' : comparison.dieselDiff < 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {comparison.dieselDiff > 0 ? `+₹${comparison.dieselDiff}` : `₹${comparison.dieselDiff}`} /L
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Timestamp & Source */}
      {cityData && (
        <div className="pt-2 border-t border-slate-100 dark:border-[#294C18] flex items-center justify-between text-[10px] text-slate-400 dark:text-emerald-400/70">
          <span className="truncate">{cityData.source}</span>
          <span className="shrink-0 font-mono">Updated Today</span>
        </div>
      )}
    </div>
  );
};

export default FuelPricesWidget;
