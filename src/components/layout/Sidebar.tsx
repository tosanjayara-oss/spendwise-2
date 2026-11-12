import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  BarChart3,
  PieChart,
  Settings,
  LogOut,
  Wallet,
  AlertTriangle,
  X,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { budgetAlerts, openQuickAdd } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Add Transaction', path: '/add-transaction', icon: PlusCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    {
      name: 'Budgets',
      path: '/budgets',
      icon: PieChart,
      badge: budgetAlerts.length > 0 ? `${budgetAlerts.length} alert` : null
    },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container - Forest Green Aesthetic */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#06281c] text-emerald-100 flex flex-col border-r border-[#0d4a34] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#0d4a34]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c2f138] text-[#06281c] flex items-center justify-center font-bold shadow-md shadow-[#c2f138]/20">
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">SpendWise</span>
              <span className="block text-[10px] text-[#c2f138] font-bold uppercase tracking-wider">
                Financial SaaS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-emerald-400 hover:text-white rounded-lg hover:bg-[#0d4a34] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button in Electric Lime */}
        <div className="p-4">
          <button
            onClick={() => {
              openQuickAdd();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#c2f138] hover:bg-[#b1df2f] active:bg-[#a0ce22] text-[#06281c] font-extrabold text-sm rounded-xl transition-all shadow-md shadow-[#c2f138]/20 hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Entry</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0d4a34] text-[#c2f138] border border-[#125e43] shadow-xs'
                      : 'text-emerald-100/80 hover:bg-[#093727] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3" />
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Exceeded Budgets Alert in Sidebar */}
        {budgetAlerts.length > 0 && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Budget Warning</span>
            </div>
            <p className="text-emerald-200 text-[11px]">
              {budgetAlerts.map(a => a.category).join(', ')} exceeded monthly cap.
            </p>
          </div>
        )}

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-[#0d4a34]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatarUrl || '/src/assets/images/user_avatar_1794458059728.jpg'}
                alt={user?.name || 'User Profile'}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#c2f138]/50 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Rahul Sharma'}</p>
                <p className="text-[11px] text-emerald-400/80 truncate">{user?.email || 'rahul@spendwise.app'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-emerald-400 hover:text-rose-400 hover:bg-[#093727] rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
