import { Transaction, Budget, Category, UserProfile } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // Expense Categories
  { id: 'cat-housing', name: 'Housing & Rent', type: 'expense', color: '#6366F1', icon: 'Home' },
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', color: '#F97316', icon: 'Utensils' },
  { id: 'cat-groceries', name: 'Groceries & Supplies', type: 'expense', color: '#10B981', icon: 'ShoppingBag' },
  { id: 'cat-transport', name: 'Transportation & Fuel', type: 'expense', color: '#EC4899', icon: 'Car' },
  { id: 'cat-utilities', name: 'Utilities & Bills', type: 'expense', color: '#0EA5E9', icon: 'Zap' },
  { id: 'cat-entertainment', name: 'Entertainment & OTT', type: 'expense', color: '#8B5CF6', icon: 'Film' },
  { id: 'cat-shopping', name: 'Shopping & Apparel', type: 'expense', color: '#F43F5E', icon: 'Package' },
  { id: 'cat-healthcare', name: 'Healthcare & Fitness', type: 'expense', color: '#14B8A6', icon: 'Activity' },
  { id: 'cat-education', name: 'Education & Courses', type: 'expense', color: '#3B82F6', icon: 'BookOpen' },
  { id: 'cat-travel', name: 'Travel & Vacations', type: 'expense', color: '#EAB308', icon: 'Compass' },
  
  // Income Categories
  { id: 'cat-salary', name: 'Tech Salary', type: 'income', color: '#16A34A', icon: 'Briefcase' },
  { id: 'cat-freelance', name: 'Freelance & Consulting', type: 'income', color: '#059669', icon: 'Laptop' },
  { id: 'cat-investments', name: 'Dividends & Mutual Funds', type: 'income', color: '#0D9488', icon: 'TrendingUp' },
  { id: 'cat-rental', name: 'Rental Income', type: 'income', color: '#2563EB', icon: 'Building' },
  { id: 'cat-cashback', name: 'Rewards & Cashback', type: 'income', color: '#84CC16', icon: 'Gift' }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-1001',
    date: '2026-11-10',
    description: 'TechCorp Monthly Salary Credit',
    category: 'Tech Salary',
    type: 'income',
    paymentMethod: 'Net Banking',
    amount: 145000,
    notes: 'Base salary after tax deduction for November',
    createdAt: '2026-11-10T10:00:00Z'
  },
  {
    id: 'TXN-1002',
    date: '2026-11-09',
    description: 'Apartment Rent (Indiranagar 3BHK)',
    category: 'Housing & Rent',
    type: 'expense',
    paymentMethod: 'Net Banking',
    amount: 32000,
    notes: 'Paid to landlord Suresh Reddy',
    createdAt: '2026-11-09T09:30:00Z'
  },
  {
    id: 'TXN-1003',
    date: '2026-11-08',
    description: 'Blinkit Instant Grocery Delivery',
    category: 'Groceries & Supplies',
    type: 'expense',
    paymentMethod: 'UPI',
    amount: 2450,
    notes: 'Vegetables, dairy, and breakfast items',
    createdAt: '2026-11-08T18:45:00Z'
  },
  {
    id: 'TXN-1004',
    date: '2026-11-08',
    description: 'Freelance UI/UX Design Milestone',
    category: 'Freelance & Consulting',
    type: 'income',
    paymentMethod: 'Net Banking',
    amount: 38000,
    notes: 'Fintech client dashboard prototype completion',
    createdAt: '2026-11-08T14:15:00Z'
  },
  {
    id: 'TXN-1005',
    date: '2026-11-07',
    description: 'Zomato Weekend Dinner - Toit Microbrewery',
    category: 'Food & Dining',
    type: 'expense',
    paymentMethod: 'Credit Card',
    amount: 3850,
    notes: 'Dinner with college friends',
    createdAt: '2026-11-07T21:30:00Z'
  },
  {
    id: 'TXN-1006',
    date: '2026-11-06',
    description: 'BESCOM Electricity Bill',
    category: 'Utilities & Bills',
    type: 'expense',
    paymentMethod: 'UPI',
    amount: 2850,
    notes: 'Electricity bill for October consumption',
    createdAt: '2026-11-06T11:20:00Z'
  },
  {
    id: 'TXN-1007',
    date: '2026-11-05',
    description: 'HP Petrol Pump Fuel Refill',
    category: 'Transportation & Fuel',
    type: 'expense',
    paymentMethod: 'Credit Card',
    amount: 3200,
    notes: 'Full tank for Honda City',
    createdAt: '2026-11-05T08:15:00Z'
  },
  {
    id: 'TXN-1008',
    date: '2026-11-05',
    description: 'Uber Commute to Tech Park',
    category: 'Transportation & Fuel',
    type: 'expense',
    paymentMethod: 'UPI',
    amount: 480,
    notes: 'Peak hour cab fare',
    createdAt: '2026-11-05T09:45:00Z'
  },
  {
    id: 'TXN-1009',
    date: '2026-11-04',
    description: 'Cult.Fit Gym Annual Membership EMI',
    category: 'Healthcare & Fitness',
    type: 'expense',
    paymentMethod: 'Debit Card',
    amount: 2100,
    notes: 'Fitness and yoga center pass',
    createdAt: '2026-11-04T07:30:00Z'
  },
  {
    id: 'TXN-1010',
    date: '2026-11-03',
    description: 'Netflix & Spotify Premium Bundle',
    category: 'Entertainment & OTT',
    type: 'expense',
    paymentMethod: 'Credit Card',
    amount: 1199,
    notes: 'Monthly recurring entertainment subscriptions',
    createdAt: '2026-11-03T16:00:00Z'
  },
  {
    id: 'TXN-1011',
    date: '2026-11-02',
    description: 'Tata Neu / Croma Electronics - Mechanical Keyboard',
    category: 'Shopping & Apparel',
    type: 'expense',
    paymentMethod: 'Credit Card',
    amount: 6499,
    notes: 'Keychron wireless keyboard for home office',
    createdAt: '2026-11-02T19:10:00Z'
  },
  {
    id: 'TXN-1012',
    date: '2026-11-02',
    description: 'Mutual Fund SIP Dividend Pay-out',
    category: 'Dividends & Mutual Funds',
    type: 'income',
    paymentMethod: 'Net Banking',
    amount: 12500,
    notes: 'Nifty 50 Index Fund quarterly distribution',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'TXN-1013',
    date: '2026-11-01',
    description: 'Airtel Xstream Fiber Broadband',
    category: 'Utilities & Bills',
    type: 'expense',
    paymentMethod: 'UPI',
    amount: 1415,
    notes: '300 Mbps unlimited plan with OTT perks',
    createdAt: '2026-11-01T12:00:00Z'
  },
  {
    id: 'TXN-1014',
    date: '2026-10-28',
    description: 'Nature Basket Gourmet Groceries',
    category: 'Groceries & Supplies',
    type: 'expense',
    paymentMethod: 'Debit Card',
    amount: 3450,
    notes: 'Olive oil, cheeses, whole grain bread and snacks',
    createdAt: '2026-10-28T17:30:00Z'
  },
  {
    id: 'TXN-1015',
    date: '2026-10-25',
    description: 'Cred App Cashback & Coins Redemption',
    category: 'Rewards & Cashback',
    type: 'income',
    paymentMethod: 'UPI',
    amount: 1250,
    notes: 'Credit card bill payment cashback reward',
    createdAt: '2026-10-25T11:45:00Z'
  },
  {
    id: 'TXN-1016',
    date: '2026-10-22',
    description: 'Third Wave Coffee Roasters Meetup',
    category: 'Food & Dining',
    type: 'expense',
    paymentMethod: 'UPI',
    amount: 680,
    notes: 'Pour-over and croissant during client call',
    createdAt: '2026-10-22T16:15:00Z'
  },
  {
    id: 'TXN-1017',
    date: '2026-10-20',
    description: 'Bangalore Metro Smart Card Recharge',
    category: 'Transportation & Fuel',
    type: 'expense',
    paymentMethod: 'UPI',
    amount: 1000,
    notes: 'Monthly Namma Metro card top-up',
    createdAt: '2026-10-20T08:30:00Z'
  },
  {
    id: 'TXN-1018',
    date: '2026-10-18',
    description: 'Coursera UI/UX Certification',
    category: 'Education & Courses',
    type: 'expense',
    paymentMethod: 'Credit Card',
    amount: 3999,
    notes: 'Design systems and advanced interaction design',
    createdAt: '2026-10-18T14:20:00Z'
  },
  {
    id: 'TXN-1019',
    date: '2026-10-15',
    description: 'Weekly Organic Vegetables - Farmizen',
    category: 'Groceries & Supplies',
    type: 'expense',
    paymentMethod: 'Cash',
    amount: 1800,
    notes: 'Fresh organic greens and roots',
    createdAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'TXN-1020',
    date: '2026-10-10',
    description: 'TechCorp Monthly Salary Credit (Oct)',
    category: 'Tech Salary',
    type: 'income',
    paymentMethod: 'Net Banking',
    amount: 145000,
    notes: 'Salary for October',
    createdAt: '2026-10-10T10:00:00Z'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bgt-1',
    category: 'Housing & Rent',
    monthlyLimit: 35000,
    spent: 32000,
    month: '2026-11'
  },
  {
    id: 'bgt-2',
    category: 'Food & Dining',
    monthlyLimit: 12000,
    spent: 10450,
    month: '2026-11'
  },
  {
    id: 'bgt-3',
    category: 'Groceries & Supplies',
    monthlyLimit: 10000,
    spent: 7700,
    month: '2026-11'
  },
  {
    id: 'bgt-4',
    category: 'Transportation & Fuel',
    monthlyLimit: 7500,
    spent: 8680, // Exceeded! Triggers warning
    month: '2026-11'
  },
  {
    id: 'bgt-5',
    category: 'Utilities & Bills',
    monthlyLimit: 6000,
    spent: 4265,
    month: '2026-11'
  },
  {
    id: 'bgt-6',
    category: 'Entertainment & OTT',
    monthlyLimit: 4000,
    spent: 2800,
    month: '2026-11'
  },
  {
    id: 'bgt-7',
    category: 'Shopping & Apparel',
    monthlyLimit: 12000,
    spent: 8500,
    month: '2026-11'
  },
  {
    id: 'bgt-8',
    category: 'Healthcare & Fitness',
    monthlyLimit: 5000,
    spent: 2600,
    month: '2026-11'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@spendwise.app',
  occupation: 'Senior Staff Product Engineer',
  location: 'Bengaluru, Karnataka, India',
  currency: 'INR',
  currencySymbol: '₹',
  monthlySavingsGoal: 50000,
  avatarUrl: '/src/assets/images/user_avatar_1794458059728.jpg',
  bio: 'Building scalable software and optimizing personal finances for financial independence.',
  theme: 'light',
  notifications: {
    budgetAlerts: true,
    weeklyReport: true,
    largeTransactions: true,
    largeTransactionThreshold: 10000
  }
};

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendwise_transactions_v1',
  BUDGETS: 'spendwise_budgets_v1',
  CATEGORIES: 'spendwise_categories_v1',
  PROFILE: 'spendwise_profile_v1'
};

// Safe local storage helpers
export function getStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(txns: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
  } catch (err) {
    console.error('Failed to save transactions to localStorage', err);
  }
}

export function getStoredBudgets(): Budget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
      return INITIAL_BUDGETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BUDGETS;
  }
}

export function saveStoredBudgets(budgets: Budget[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error('Failed to save budgets to localStorage', err);
  }
}

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
}
