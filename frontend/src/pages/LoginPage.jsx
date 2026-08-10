import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    navigate('/');
  };

  const handleDemoFill = () => {
    setEmail('rudra.patel@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel rounded-2xl p-8 shadow-2xl border border-slate-700/60"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to access your AI Resume analysis & Career Roadmaps
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accentViolet text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-3 text-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="inline-flex items-center justify-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-300 py-1 px-3 rounded-lg bg-brand-500/10 border border-brand-500/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-accentEmerald" />
            <span>Click for One-Click Demo Credentials</span>
          </button>

          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
