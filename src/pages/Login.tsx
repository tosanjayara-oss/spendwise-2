import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const { addToast } = useApp();

  const [email, setEmail] = useState('rahul.sharma@spendwise.app');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      addToast({
        type: 'success',
        title: 'Welcome Back',
        message: 'Successfully logged in to SpendWise.'
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    addToast({
      type: 'success',
      title: 'Demo Session Active',
      message: 'Signed in as Rahul Sharma (Demo Account with sample data).'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#041A12] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#c2f138] text-[#06281c] font-bold shadow-lg shadow-[#c2f138]/20 mb-3">
          <Wallet className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Sign In to SpendWise
        </h2>
        <p className="mt-1 text-xs text-emerald-300/80">
          Personal expense tracking & financial analytics platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#06281c] backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#0d4a34] space-y-6">
          {/* Quick Demo Access Callout */}
          <div className="p-4 bg-[#0d4a34]/60 border border-[#125e43] rounded-2xl text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c2f138]">
              <Sparkles className="w-4 h-4 text-[#c2f138]" />
              <span>Instant Evaluator Demo</span>
            </div>
            <p className="text-[11px] text-emerald-200 mt-1">
              Explore the entire dashboard, budget alerts, and analytics instantly without credentials:
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="mt-3 w-full py-2.5 px-3 bg-[#c2f138] hover:bg-[#b1df2f] text-[#06281c] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#c2f138]/20"
            >
              <span>Launch Demo Account</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#0d4a34] w-full" />
            <span className="bg-[#06281c] px-3 text-[11px] uppercase font-bold text-emerald-400 absolute">
              or sign in with email
            </span>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#093727] border border-[#0d4a34] text-xs font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#093727] border border-[#0d4a34] text-xs font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0d4a34] hover:bg-[#125e43] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-xs text-emerald-300/80 pt-2 border-t border-[#0d4a34]">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[#c2f138] hover:underline font-bold">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
