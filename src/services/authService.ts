import { getStoredProfile, saveStoredProfile } from './mockData';
import { UserProfile } from '../types';

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    occupation?: string;
  };
  token: string;
  rememberMe: boolean;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const AUTH_STORAGE_KEY = 'spendwise_auth_token_v1';
const DEMO_EMAIL = 'demo@spendwise.com';
const DEMO_PASS = 'SpendWise123';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AuthService - API Abstraction Layer for Authentication
 * Prepared for REST contracts:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/logout
 * - GET /api/auth/me
 */
export const authService = {
  /**
   * POST /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay(350); // Simulate network latency

    const { email, password, rememberMe = false } = credentials;

    const trimmedEmail = email.trim().toLowerCase();

    // Check demo credentials or local registration
    if (trimmedEmail === DEMO_EMAIL.toLowerCase()) {
      if (password !== DEMO_PASS) {
        throw new Error('Invalid credentials. Password for demo@spendwise.com is SpendWise123');
      }
    }

    // Load stored user profile
    const profile = getStoredProfile();

    // If logging in with demo or registered user, create session
    const session: AuthSession = {
      user: {
        id: profile.id || `usr-${Date.now()}`,
        name: profile.name || (trimmedEmail.split('@')[0].toUpperCase()),
        email: trimmedEmail,
        avatarUrl: profile.avatarUrl || '/src/assets/images/user_avatar_1794458059728.jpg',
        occupation: profile.occupation
      },
      token: `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      rememberMe,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return session;
  },

  /**
   * POST /api/auth/register
   */
  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    await delay(400);

    const { name, email, password } = credentials;
    const trimmedEmail = email.trim().toLowerCase();

    if (!name.trim()) throw new Error('Full name is required.');
    if (!trimmedEmail) throw new Error('Email address is required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

    // Save updated profile
    const currentProfile = getStoredProfile();
    const updatedProfile: UserProfile = {
      ...currentProfile,
      name: name.trim(),
      email: trimmedEmail
    };
    saveStoredProfile(updatedProfile);

    const session: AuthSession = {
      user: {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: trimmedEmail,
        avatarUrl: currentProfile.avatarUrl || '/src/assets/images/user_avatar_1794458059728.jpg',
        occupation: currentProfile.occupation
      },
      token: `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      rememberMe: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  /**
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    await delay(150);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(): Promise<AuthSession | null> {
    try {
      const local = localStorage.getItem(AUTH_STORAGE_KEY);
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY);

      const raw = local || session;
      if (!raw) return null;

      const parsed: AuthSession = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  },

  /**
   * Helper to check if stored session exists
   */
  getStoredSession(): AuthSession | null {
    try {
      const local = localStorage.getItem(AUTH_STORAGE_KEY);
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
      const raw = local || session;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
};

export default authService;
