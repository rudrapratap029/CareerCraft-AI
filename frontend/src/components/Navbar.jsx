import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  FileSearch, 
  BarChart3, 
  Map, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  User as UserIcon,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileSearch },
    { label: 'Skill Analytics', path: '/skill-charts', icon: BarChart3 },
    { label: 'Roadmap Generator', path: '/roadmap-generator', icon: Map },
    { label: 'AI Interview Practice', path: '/interview-practice', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accentViolet flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-gradient transition-all">
                CareerCraft<span className="text-brand-400">.AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                MERN AI Career Suite
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Profile / Auth buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accentViolet text-white shadow-md shadow-brand-600/30 hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {user && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/90 px-2 pt-2 pb-3 space-y-1">
          <div className="grid grid-cols-2 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
