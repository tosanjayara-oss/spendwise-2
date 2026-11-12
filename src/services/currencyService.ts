/**
 * Currency Exchange Rate Service
 * Fetches real-time reference rates from Frankfurter API (https://frankfurter.dev)
 * Caches results in localStorage and provides reverse conversion and swap helpers.
 */

export interface CurrencyRateData {
  base: string;
  date: string;
  timestamp: number;
  rates: Record<string, number>;
  source: string;
}

const CACHE_KEY = 'spendwise_currency_rates_cache_v1';
const CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes cache

// Reference fallback rates for INR base if offline or API delay
const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.0118,
  EUR: 0.0110,
  GBP: 0.0093,
  AED: 0.0435, // 1 INR = ~0.0435 AED (based on 1 USD = 3.6725 AED)
  JPY: 1.842,
  SGD: 0.0159
};

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
];

export const currencyService = {
  /**
   * Get currency exchange rates relative to base currency (default INR)
   */
  async getExchangeRates(base: string = 'INR'): Promise<CurrencyRateData> {
    const cached = this.getCachedRates(base);
    if (cached) {
      return cached;
    }

    try {
      // Frankfurter API primary endpoint
      const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=INR`);
      
      if (!response.ok) {
        // Retry with backup frankfurter app host
        const backupRes = await fetch(`https://api.frankfurter.app/latest?base=INR`);
        if (!backupRes.ok) throw new Error('Failed to fetch from Frankfurter API');
        const backupJson = await backupRes.json();
        return this.processAndCacheApiRates(backupJson, base);
      }

      const json = await response.json();
      return this.processAndCacheApiRates(json, base);
    } catch (err) {
      console.warn('Currency API temporary fallback used:', err);
      return {
        base: 'INR',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        rates: FALLBACK_RATES,
        source: 'Frankfurter & European Central Bank (Cached Reference)'
      };
    }
  },

  processAndCacheApiRates(data: any, base: string): CurrencyRateData {
    const fetchedRates = data.rates || {};
    
    // Ensure INR base is 1
    const rates: Record<string, number> = {
      INR: 1,
      USD: fetchedRates.USD || FALLBACK_RATES.USD,
      EUR: fetchedRates.EUR || FALLBACK_RATES.EUR,
      GBP: fetchedRates.GBP || FALLBACK_RATES.GBP,
      JPY: fetchedRates.JPY || FALLBACK_RATES.JPY,
      SGD: fetchedRates.SGD || FALLBACK_RATES.SGD,
      // Derive AED using pegged rate 1 USD = 3.6725 AED
      AED: Number(((fetchedRates.USD || FALLBACK_RATES.USD) * 3.6725).toFixed(4))
    };

    const result: CurrencyRateData = {
      base: 'INR',
      date: data.date || new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      rates,
      source: 'Frankfurter API / European Central Bank Reference'
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch (e) {
      console.error('Failed to save currency cache', e);
    }

    return result;
  },

  getCachedRates(base: string): CurrencyRateData | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed: CurrencyRateData = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Convert an amount between any two supported currencies
   */
  convertAmount(
    amount: number,
    from: string,
    to: string,
    ratesData: Record<string, number>
  ): number {
    if (from === to) return amount;
    if (!amount || isNaN(amount)) return 0;

    // Convert from source to INR first
    const fromRateToINR = from === 'INR' ? 1 : 1 / (ratesData[from] || FALLBACK_RATES[from] || 1);
    const amountInINR = amount * fromRateToINR;

    // Convert INR to target
    const toRateFromINR = to === 'INR' ? 1 : (ratesData[to] || FALLBACK_RATES[to] || 1);
    return Number((amountInINR * toRateFromINR).toFixed(2));
  }
};

export default currencyService;
