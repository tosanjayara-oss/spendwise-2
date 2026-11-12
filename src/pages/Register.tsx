import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(name.trim(), email.trim(), password);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to SpendWise, ${name}! Your financial workspace is ready.`
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041A12] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#c2f138] text-[#06281c] font-bold shadow-lg shadow-[#c2f138]/20 mb-3">
          <Wallet className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Create SpendWise Account
        </h2>
        <p className="mt-1 text-xs text-emerald-300/80">
          Start mastering your cash flow and personal expenses
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#06281c] backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#0d4a34] space-y-6">
          {error && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 bg-[#093727] border border-[#0d4a34] text-xs font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@spendwise.app"
                  className="w-full pl-9 pr-3 py-2 bg-[#093727] border border-[#0d4a34] text-xs font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-[#093727] border border-[#0d4a34] text-xs font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c2f138]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#c2f138] hover:bg-[#b1df2f] text-[#06281c] font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-[#c2f138]/20"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>

          <div className="text-center text-xs text-emerald-300/80 pt-2 border-t border-[#0d4a34]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#c2f138] hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
