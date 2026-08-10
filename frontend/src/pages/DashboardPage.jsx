import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  FileSearch, 
  BarChart3, 
  Map, 
  MessageSquare, 
  CheckCircle2, 
  Zap, 
  Award,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI Resume Analyzer',
      description: 'Upload or paste your resume to get instant ATS compatibility scoring, missing keywords, & actionable tips.',
      path: '/resume-analyzer',
      icon: FileSearch,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'High Impact'
    },
    {
      title: 'Skill Analytics & Charts',
      description: 'Visualize your technical & soft skill matrix with interactive Radar charts, proficiency bars, and gauges.',
      path: '/skill-charts',
      icon: BarChart3,
      gradient: 'from-purple-600 to-accentViolet',
      badge: 'Interactive Visuals'
    },
    {
      title: 'AI Roadmap Generator',
      description: 'Get a personalized step-by-step career learning path with milestones, resource recommendations, & project ideas.',
      path: '/roadmap-generator',
      icon: Map,
      gradient: 'from-emerald-600 to-cyan-600',
      badge: 'Step-by-Step'
    },
    {
      title: 'AI Interview Practice',
      description: 'Practice real-world interview questions tailored to your resume and role with live AI response evaluation.',
      path: '/interview-practice',
      icon: MessageSquare,
      gradient: 'from-amber-600 to-rose-600',
      badge: 'Live Simulator'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 glass-panel border border-brand-500/20 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              <span>AI-Powered MERN Career Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-gradient">{user?.name || 'Developer'}</span>!
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Target Role: <span className="font-semibold text-slate-100">{user?.targetRole || 'Full Stack Developer'}</span> ({user?.experienceLevel || 'Mid Level'}). Ready to optimize your resume and master your next interview?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/resume-analyzer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accentViolet text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <FileSearch className="w-4 h-4" />
              <span>Analyze Resume</span>
            </Link>
            <Link
              to="/roadmap-generator"
              className="px-5 py-3 rounded-xl bg-slate-800/90 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 font-semibold text-sm transition-all flex items-center space-x-2"
            >
              <Map className="w-4 h-4 text-brand-400" />
              <span>Generate Roadmap</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="glass-card p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium">ATS Match Readiness</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center space-x-2">
              <span>84%</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Top 15% in domain</div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium">Extracted Core Skills</div>
            <div className="text-2xl font-bold text-brand-300 mt-1">14 Techs</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Verified across stack</div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium">Active Roadmap</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">Stage 2 / 4</div>
            <div className="text-[11px] text-slate-500 mt-0.5">50% completed</div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="text-slate-400 text-xs font-medium">Interview Score</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">8.5 / 10</div>
            <div className="text-[11px] text-slate-500 mt-0.5">AI Evaluated</div>
          </div>
        </div>
      </motion.div>

      {/* Main Suite Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <span>AI Career Tools</span>
          </h2>
          <span className="text-xs text-slate-400">Select any tool to begin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={feature.path}
                  className="block group glass-card p-6 rounded-2xl border border-slate-800 hover:border-brand-500/40 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4 group-hover:text-brand-300 transition-colors flex items-center justify-between">
                    <span>{feature.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-400" />
                  </h3>

                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
