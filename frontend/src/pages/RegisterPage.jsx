import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(name, email, password, targetRole, experienceLevel);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full glass-panel rounded-2xl p-8 shadow-2xl border border-slate-700/60"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create CareerCraft Account</h2>
          <p className="text-sm text-slate-400 mt-1">
            Build AI-analyzed resumes & tailored tech learning paths
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 text-sm"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 text-sm"
              >
                <option value="Entry Level / Junior">Entry Level / Junior</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Principal">Lead / Principal</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-brand-600 to-accentViolet text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account & Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
