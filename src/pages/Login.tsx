import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Wallet, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, KeyRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  if (isAuthenticated && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = (): boolean => {
    setErrorMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe
      });

      setSuccessMsg('Authentication successful! Redirecting...');
      addToast({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome to your SpendWise SaaS Dashboard.'
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@spendwise.com');
    setPassword('SpendWise123');
    setRememberMe(true);
    setErrorMsg('');
    addToast({
      type: 'info',
      title: 'Demo Credentials Loaded',
      message: 'Email: demo@spendwise.com | Password: SpendWise123'
    });
  };

  return (
    <div className="min-h-screen bg-[#14240B] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#BCE842] text-[#14240B] font-black shadow-xl shadow-[#BCE842]/20 mb-3">
          <Wallet className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          SpendWise SaaS
        </h2>
        <p className="mt-1 text-xs text-emerald-200/80 font-medium">
          Personal Expense Tracker & Financial Analytics Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1B3111] backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#294C18] space-y-6">
          
          {/* Demo Credentials Quick Fill Banner */}
          <div className="p-4 bg-[#294C18]/60 border border-[#34601E] rounded-2xl text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#BCE842]">
                <Sparkles className="w-4 h-4 text-[#BCE842]" />
                <span>Demo Credentials</span>
              </div>
              <span className="text-[10px] font-mono bg-[#BCE842]/20 text-[#BCE842] font-bold px-2 py-0.5 rounded">
                One-Click
              </span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-100 font-mono space-y-0.5">
              <div>Email: <span className="text-white font-bold">demo@spendwise.com</span></div>
              <div>Password: <span className="text-white font-bold">SpendWise123</span></div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-3 w-full py-2 px-3 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#BCE842]/20"
            >
              <span>Auto-Fill Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/70 border border-rose-800/80 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs text-[#14240B] bg-[#BCE842] border border-[#BCE842] rounded-xl flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#14240B] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#A3D977] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#BCE842] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="demo@spendwise.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#182E0E] border border-[#294C18] text-xs font-semibold rounded-xl text-white placeholder-emerald-600/80 focus:outline-none focus:ring-2 focus:ring-[#BCE842] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#A3D977] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#BCE842] hover:underline font-bold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#BCE842] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="SpendWise123"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#182E0E] border border-[#294C18] text-xs font-semibold rounded-xl text-white placeholder-emerald-600/80 focus:outline-none focus:ring-2 focus:ring-[#BCE842] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-emerald-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#BCE842] bg-[#182E0E] border-[#294C18] focus:ring-[#BCE842] accent-[#BCE842]"
                />
                <span className="font-medium">Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#BCE842]/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#14240B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Register Redirect Link */}
          <div className="text-center text-xs text-emerald-200/80 pt-2 border-t border-[#294C18]">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[#BCE842] hover:underline font-bold">
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setShowForgotModal(false)}
          />
          <div className="relative bg-[#1B3111] rounded-3xl p-6 max-w-sm w-full border border-[#294C18] shadow-2xl z-10 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#294C18] mb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <KeyRound className="w-5 h-5 text-[#BCE842]" />
                <span>Password Recovery</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              For demo access, use the pre-configured credentials:
            </p>
            <div className="mt-3 p-3 bg-[#182E0E] rounded-xl border border-[#294C18] text-xs font-mono">
              <div className="text-[#BCE842] font-bold">demo@spendwise.com</div>
              <div className="text-white mt-1">Password: SpendWise123</div>
            </div>
            <button
              onClick={() => {
                handleFillDemo();
                setShowForgotModal(false);
              }}
              className="mt-4 w-full py-2 bg-[#BCE842] hover:bg-[#A6D42E] text-[#14240B] font-black text-xs rounded-xl"
            >
              Auto-Fill Credentials & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
