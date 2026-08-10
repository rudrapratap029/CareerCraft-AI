import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, Sparkles, Sliders, ShieldCheck, Zap, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const SkillChartsPage = () => {
  const [targetDomain, setTargetDomain] = useState('Full Stack Software Engineering');

  // Interactive Radar Chart Data
  const radarSkillData = [
    { subject: 'Frontend (React/TS)', A: 90, fullMark: 100 },
    { subject: 'Backend (Node/Express)', A: 85, fullMark: 100 },
    { subject: 'Database (Mongo/SQL)', A: 80, fullMark: 100 },
    { subject: 'DevOps & Docker', A: 70, fullMark: 100 },
    { subject: 'System Design', A: 78, fullMark: 100 },
    { subject: 'Automated Testing', A: 75, fullMark: 100 },
  ];

  // Bar Chart Data (Skill Proficiency vs Industry Standard)
  const barSkillData = [
    { name: 'JavaScript', Candidate: 92, MarketAvg: 75 },
    { name: 'React.js', Candidate: 88, MarketAvg: 80 },
    { name: 'Node.js', Candidate: 85, MarketAvg: 70 },
    { name: 'MongoDB', Candidate: 80, MarketAvg: 65 },
    { name: 'Tailwind', Candidate: 90, MarketAvg: 70 },
    { name: 'TypeScript', Candidate: 75, MarketAvg: 82 },
  ];

  // Pie Chart Data (Hard vs Soft Skills Distribution)
  const pieData = [
    { name: 'Frontend Tech', value: 35, color: '#6366f1' },
    { name: 'Backend & DB', value: 30, color: '#8b5cf6' },
    { name: 'DevOps & Tools', value: 15, color: '#06b6d4' },
    { name: 'Soft Skills', value: 20, color: '#10b981' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Skill Analytics Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI Skill Charts & Skill Gap Visualizer</h1>
          <p className="text-slate-400 text-sm mt-1">
            Visual breakdown of your technical proficiency, market benchmarks, and domain readiness.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <Sliders className="w-4 h-4 text-brand-400 ml-2" />
          <select
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none pr-3 py-1 cursor-pointer"
          >
            <option value="Full Stack Software Engineering">Full Stack Engineering</option>
            <option value="Frontend Architecture">Frontend Architecture</option>
            <option value="Backend & Cloud Infrastructure">Backend & Cloud Infra</option>
          </select>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Chart (Left - 6 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-brand-400" />
              <span>Technical Skills Radar Matrix</span>
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 font-semibold border border-brand-500/20">
              Multi-Axis Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Measures candidate competency across essential software engineering domains.
          </p>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarSkillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Candidate Skill" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart (Right - 6 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-accentCyan" />
              <span>Skill Benchmark vs Industry Standards</span>
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
              Market Match
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Compare your proficiency against average industry requirements for {targetDomain}.
          </p>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barSkillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="Candidate" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="MarketAvg" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Pie Chart & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pie Chart (4 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4"
        >
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-accentViolet" />
            <span>Skill Category Composition</span>
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span className="text-slate-500 font-mono">({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action & Gap Analysis Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>AI Skill Gap Recommendation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-brand-300">Top Competitive Skill</div>
                <div className="text-sm font-extrabold text-white">React.js & Modern UI Architecture</div>
                <p className="text-[11px] text-slate-400 mt-1">Exceeds industry standard by +18% rating.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-amber-300">Primary Skill Gap</div>
                <div className="text-sm font-extrabold text-white">Docker Containerization & CI/CD</div>
                <p className="text-[11px] text-slate-400 mt-1">Currently 12% below target mid-level benchmark.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-600/10 border border-brand-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-brand-300">Ready to bridge your skill gap?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Generate a tailored 12-week learning roadmap for your target role.</p>
              </div>
              <a
                href="/roadmap-generator"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Generate Roadmap
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
