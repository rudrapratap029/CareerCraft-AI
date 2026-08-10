import React, { useState } from 'react';
import axios from 'axios';
import { 
  Map, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Code, 
  Clock, 
  RefreshCw, 
  Zap, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RoadmapGeneratorPage = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [level, setLevel] = useState('Mid Level');
  const [knownSkills, setKnownSkills] = useState('React, Node.js, Express, MongoDB, JavaScript, Git');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const defaultRoadmap = {
    id: 'demo_rm_1',
    targetRole: 'Full Stack Developer',
    currentLevel: 'Mid Level',
    durationWeeks: 12,
    overallProgress: 25,
    stages: [
      {
        stageNumber: 1,
        stageTitle: 'Stage 1: Foundational Mastery & Type Safety',
        stageSummary: 'Solidify TypeScript generics, modern React 18 patterns, and state management.',
        estimatedDuration: 'Weeks 1 - 3',
        tasks: [
          {
            id: 's1_t1',
            title: 'Modern TypeScript & Generics Deep Dive',
            description: 'Master strict typing, interfaces, union types, and utility helpers (Partial, Pick, Omit).',
            duration: '1 Week',
            category: 'Core Language',
            resources: ['TypeScript Docs', 'TypeScript Deep Dive Book'],
            projectIdea: 'Refactor standard JS utility functions to fully generic TS definitions.',
            completed: true
          },
          {
            id: 's1_t2',
            title: 'Advanced React Architecture & Custom Hooks',
            description: 'Learn memoization techniques, custom hooks pattern, and lightweight state with Zustand.',
            duration: '2 Weeks',
            category: 'Frontend Engineering',
            resources: ['React 18 Dev Guide', 'Zustand GitHub Repository'],
            projectIdea: 'Build a custom drag-and-drop kanban task board with persistent state.',
            completed: false
          }
        ]
      },
      {
        stageNumber: 2,
        stageTitle: 'Stage 2: Scalable Backend Architecture & Security',
        stageSummary: 'Focus on Express.js microservices, JWT authentication security, and MongoDB indexing.',
        estimatedDuration: 'Weeks 4 - 6',
        tasks: [
          {
            id: 's2_t1',
            title: 'Express JWT Auth & Middleware Pipeline',
            description: 'Implement token refresh rotation, role-based access control (RBAC), and Helmet security headers.',
            duration: '1.5 Weeks',
            category: 'Backend Security',
            resources: ['OWASP Top 10 Web Application Security', 'JWT Best Practices'],
            projectIdea: 'Build an authentication microservice with email verification.',
            completed: false
          },
          {
            id: 's2_t2',
            title: 'Database Indexing & Redis Caching',
            description: 'Master MongoDB compound indexing, aggregation queries, and Redis key-value caching.',
            duration: '1.5 Weeks',
            category: 'Database & Caching',
            resources: ['MongoDB Aggregation Docs', 'Redis Crash Course'],
            projectIdea: 'Create an API route cache middleware reducing DB queries by 80%.',
            completed: false
          }
        ]
      },
      {
        stageNumber: 3,
        stageTitle: 'Stage 3: Containerization & CI/CD Pipelines',
        stageSummary: 'Automate build pipelines, containerize microservices, and deploy cloud instances.',
        estimatedDuration: 'Weeks 7 - 9',
        tasks: [
          {
            id: 's3_t1',
            title: 'Docker & Docker-Compose Multi-Stage Builds',
            description: 'Write optimized Dockerfiles and orchestrate multi-container full-stack setups.',
            duration: '1.5 Weeks',
            category: 'DevOps & Infrastructure',
            resources: ['Docker Official Guide', 'Docker Compose Specification'],
            projectIdea: 'Containerize complete MERN application stack for local production simulation.',
            completed: false
          },
          {
            id: 's3_t2',
            title: 'GitHub Actions Automated Integration',
            description: 'Setup continuous integration workflows for automated testing, linting, and cloud deployments.',
            duration: '1.5 Weeks',
            category: 'CI/CD Automation',
            resources: ['GitHub Actions Workflows Guide'],
            projectIdea: 'Create an automated deployment workflow to Render / Vercel.',
            completed: false
          }
        ]
      },
      {
        stageNumber: 4,
        stageTitle: 'Stage 4: System Design & Capstone AI Project',
        stageSummary: 'Integrate real-time AI capabilities, practice system design scenarios, and launch capstone.',
        estimatedDuration: 'Weeks 10 - 12',
        tasks: [
          {
            id: 's4_t1',
            title: 'System Design Patterns & Scalability',
            description: 'Study load balancers, database sharding, rate limiting, and horizontal scaling.',
            duration: '1.5 Weeks',
            category: 'System Architecture',
            resources: ['System Design Primer', 'ByteByteGo System Design'],
            projectIdea: 'Draw architecture diagram for scalable chat service with WebSockets.',
            completed: false
          },
          {
            id: 's4_t2',
            title: 'AI Full Stack Capstone Deployment',
            description: 'Deploy full-featured AI application featuring Gemini API integration and full user suite.',
            duration: '1.5 Weeks',
            category: 'Capstone Launch',
            resources: ['Google Gemini API Docs', 'Production Deployment Checklist'],
            projectIdea: 'Publish your complete AI Career Suite online with live domain.',
            completed: false
          }
        ]
      }
    ]
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = knownSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await axios.post('/api/roadmap/generate', {
        targetRole,
        skills: skillsArray,
        level
      });
      if (res.data.success) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.warn('API error, relying on default roadmap model:', err);
      setRoadmap({
        ...defaultRoadmap,
        targetRole,
        currentLevel: level
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (stageIdx, taskIdx) => {
    if (!roadmap) return;
    const updatedStages = [...roadmap.stages];
    const task = updatedStages[stageIdx].tasks[taskIdx];
    task.completed = !task.completed;

    let total = 0;
    let done = 0;
    updatedStages.forEach(s => {
      s.tasks.forEach(t => {
        total++;
        if (t.completed) done++;
      });
    });

    const progress = Math.round((done / total) * 100);
    setRoadmap({ ...roadmap, stages: updatedStages, overallProgress: progress });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Career Pathway Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI Personalized Learning Roadmap</h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate an interactive milestone roadmap customized to your resume skills and target tech role.
          </p>
        </div>
      </div>

      {/* Generator Input Bar */}
      <form onSubmit={handleGenerate} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Job Title
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 text-sm font-medium"
            >
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 text-sm font-medium"
            >
              <option value="Entry Level / Junior">Entry Level / Junior</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Current Known Skills
            </label>
            <input
              type="text"
              value={knownSkills}
              onChange={(e) => setKnownSkills(e.target.value)}
              placeholder="e.g. React, Node, MongoDB, Git"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accentViolet text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating AI Career Roadmap...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-amber-300" />
              <span>Generate AI Learning Roadmap</span>
            </>
          )}
        </button>
      </form>

      {/* Roadmap View Display */}
      {roadmap ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-brand-400">Roadmap Overview</span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {roadmap.targetRole} Roadmap ({roadmap.currentLevel})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Estimated duration: <span className="text-slate-200 font-semibold">{roadmap.durationWeeks || 12} Weeks</span> across 4 targeted milestone stages.
              </p>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Completion Progress</span>
                <span className="font-bold text-brand-300">{roadmap.overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-brand-500 via-indigo-500 to-accentEmerald h-full rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.overallProgress || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Milestone Stages */}
          <div className="space-y-6">
            {roadmap.stages?.map((stage, stageIdx) => (
              <motion.div
                key={stage.stageNumber}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stageIdx * 0.1 }}
                className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold text-sm">
                      {stage.stageNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{stage.stageTitle}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{stage.stageSummary}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{stage.estimatedDuration}</span>
                  </div>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stage.tasks?.map((task, taskIdx) => (
                    <div
                      key={task.id || taskIdx}
                      onClick={() => toggleTask(stageIdx, taskIdx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        task.completed
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <button type="button" className="mt-0.5 text-slate-400">
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 hover:text-brand-400" />
                            )}
                          </button>
                          <div>
                            <h4 className={`text-sm font-bold ${task.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                              {task.title}
                            </h4>
                            <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              {task.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">{task.duration}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-8">
                        {task.description}
                      </p>

                      {task.projectIdea && (
                        <div className="pl-8 pt-1 flex items-start space-x-2 text-xs text-brand-300">
                          <Code className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />
                          <span><strong className="text-slate-200">Hands-on Project:</strong> {task.projectIdea}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 glass-panel rounded-2xl border border-slate-800 flex items-center justify-center text-center p-6">
          <p className="text-xs text-slate-400">Click "Generate AI Learning Roadmap" above to create your custom pathway.</p>
        </div>
      )}

    </div>
  );
};
