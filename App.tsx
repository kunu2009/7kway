import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';
import { 
  Zap, Brain, Target, DollarSign, Settings, 
  Dumbbell, CheckCircle2, Trophy, Clock, 
  BookOpen, Music, Share2, Github, Instagram, ExternalLink, Mail,
  LayoutDashboard, Flame, Box, Calendar, AlertCircle, Shield
} from 'lucide-react';
import { Area, AppData, Habit, Project, LogEntry } from './types';
import { loadData, saveData } from './db';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'physical' | 'intelligence' | 'skills' | 'wealth' | 'settings'>('dashboard');

  // Sync data to localStorage on change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Gamification Logic
  const level = useMemo(() => Math.floor(data.stats.xp / 1000) + 1, [data.stats.xp]);
  const xpInCurrentLevel = useMemo(() => data.stats.xp % 1000, [data.stats.xp]);
  const progressPercent = useMemo(() => (xpInCurrentLevel / 1000) * 100, [xpInCurrentLevel]);

  const addXP = useCallback((amount: number, label: string) => {
    setData(prev => {
      const newXp = prev.stats.xp + amount;
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type: 'xp',
        value: amount,
        label: label
      };
      return {
        ...prev,
        stats: { ...prev.stats, xp: newXp },
        logs: [newLog, ...prev.logs].slice(0, 100) // Keep last 100 logs
      };
    });
  }, []);

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const newHabits = prev.habits.map(h => {
        if (h.id === id) {
          const isDone = h.completedDates.includes(today);
          if (isDone) {
            return { ...h, completedDates: h.completedDates.filter(d => d !== today) };
          } else {
            addXP(h.xpValue, `Habit: ${h.name}`);
            return { ...h, completedDates: [...h.completedDates, today] };
          }
        }
        return h;
      });
      return { ...prev, habits: newHabits };
    });
  };

  const addSampleProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Venture " + (data.projects.length + 1),
      description: "Automated scaling system prototype.",
      status: 'planning',
      monetized: true,
      income: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high'
    };
    setData(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
    addXP(100, "Project Initialized");
  };

  // UI Components
  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
        activeTab === id ? 'text-teal-400 bg-teal-400/10' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  const XPHeader = () => (
    <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Trophy className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Level {level}</h1>
            <p className="text-[10px] text-teal-400 font-semibold">{xpInCurrentLevel} / 1000 XP</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full text-xs font-bold border border-orange-500/20">
            <Flame size={14} /> {data.stats.streak}
          </div>
          <Zap className="text-teal-400 animate-pulse" size={20} />
        </div>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );

  const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
    </div>
  );

  const Dashboard = () => {
    const chartData = useMemo(() => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(d => ({ name: d, xp: Math.floor(Math.random() * 500) + 100 }));
    }, []);

    const completionRate = useMemo(() => {
      const today = new Date().toISOString().split('T')[0];
      const done = data.habits.filter(h => h.completedDates.includes(today)).length;
      return data.habits.length > 0 ? (done / data.habits.length) * 100 : 0;
    }, [data.habits]);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">
          <p className="text-teal-400 text-sm font-medium mb-1">Made by 7K Ecosystem</p>
          <h3 className="text-xl font-bold text-white">Focus: Board Exam Peak Performance</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-slate-400 text-xs">Habit Completion</p>
              <CheckCircle2 size={16} className="text-teal-400" />
            </div>
            <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-slate-400 text-xs">Deep Work (h)</p>
              <Clock size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold">4.5</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs mb-4">Weekly XP Velocity</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#2dd4bf' : '#1e293b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <SectionHeader title="Daily Quest" subtitle="Complete these for a perfect streak" />
        <div className="space-y-3">
          {data.habits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isDone = habit.completedDates.includes(today);
            return (
              <button 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isDone ? 'bg-teal-500/10 border-teal-500/40 text-teal-100' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDone ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {habit.category === Area.Physical && <Dumbbell size={18} />}
                    {habit.category === Area.Intelligence && <Brain size={18} />}
                    {habit.category === Area.Skills && <Box size={18} />}
                    {habit.category === Area.Discipline && <Shield size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{habit.name}</p>
                    <p className="text-[10px] opacity-60 uppercase tracking-tighter">{habit.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">+{habit.xpValue} XP</p>
                  {isDone && <CheckCircle2 size={16} className="ml-auto mt-1" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const PhysicalSection = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <SectionHeader title="Physical Growth" subtitle="Optimize your vessel for peak performance" />
      
      <div className="grid gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold flex items-center gap-2"><Target size={18} className="text-teal-400" /> Height Optimization</h4>
            <span className="text-xs bg-teal-400/10 text-teal-400 px-2 py-1 rounded">Daily</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>HGH Sleep (10pm-6am)</span>
              <input type="checkbox" className="w-5 h-5 accent-teal-500" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Cobra Stretch (3 sets)</span>
              <input type="checkbox" className="w-5 h-5 accent-teal-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Dumbbell size={18} className="text-teal-400" /> Workout Log</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-800 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase">Pushups</p>
              <p className="text-lg font-bold">45</p>
            </div>
            <div className="p-2 bg-slate-800 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase">Squats</p>
              <p className="text-lg font-bold">30</p>
            </div>
            <div className="p-2 bg-slate-800 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase">Plank</p>
              <p className="text-lg font-bold">2m</p>
            </div>
          </div>
          <button onClick={() => addXP(50, "Bodyweight Training")} className="w-full mt-4 py-2 bg-teal-600 rounded-xl font-bold text-sm">Log Training +50 XP</button>
        </div>
      </div>
    </div>
  );

  const IntelligenceSection = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      let interval: any = null;
      if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((time) => time - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        setIsActive(false);
        addXP(100, "Deep Work Session Complete");
        setTimeLeft(25 * 60);
      }
      return () => clearInterval(interval);
    }, [isActive, timeLeft, addXP]);

    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <SectionHeader title="The Intelligence Mind" subtitle="Sharpen your cognitive edge" />
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <h4 className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Deep Work Timer</h4>
          <div className="text-6xl font-black mb-6 font-mono text-teal-400">{formatTime(timeLeft)}</div>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`px-8 py-3 rounded-2xl font-bold ${isActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-teal-500 text-white'}`}
            >
              {isActive ? 'Pause' : 'Start Focus'}
            </button>
            <button onClick={() => { setTimeLeft(25*60); setIsActive(false); }} className="px-4 py-3 bg-slate-800 rounded-2xl">Reset</button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="font-bold mb-4 flex items-center gap-2"><BookOpen size={18} className="text-teal-400" /> Book Reading Tracker</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Atomic Habits</span>
              <span className="text-xs text-slate-400">75% done</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full">
              <div className="h-full bg-teal-500 w-[75%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Target size={18} className="text-teal-400" /> Chess Improvement</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm">Current ELO (Lichess/Chess.com)</span>
            <input type="number" placeholder="1200" className="bg-slate-800 border-none rounded px-2 py-1 text-right w-20 text-sm font-bold" />
          </div>
        </div>
      </div>
    );
  };

  const SkillsSection = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <SectionHeader title="Polymath Skills" subtitle="Master the arts and practical skills" />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <Music className="text-teal-400 mb-2" size={20} />
          <h5 className="text-sm font-bold mb-1">Guitar/Flute</h5>
          <p className="text-[10px] text-slate-400">Log 20 mins practice</p>
          <button onClick={() => addXP(30, "Instrument Practice")} className="mt-3 w-full py-1 text-xs bg-teal-500/10 text-teal-400 rounded-lg">+30 XP</button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <Box className="text-blue-400 mb-2" size={20} />
          <h5 className="text-sm font-bold mb-1">Rubik's Speed</h5>
          <p className="text-[10px] text-slate-400">PB: 18.42s</p>
          <button className="mt-3 w-full py-1 text-xs bg-blue-500/10 text-blue-400 rounded-lg">Log Solve</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="font-bold mb-4 flex items-center gap-2"><Share2 size={18} className="text-teal-400" /> Social Skills Challenge</h4>
        <div className="p-4 bg-teal-500/5 rounded-xl border border-teal-500/10">
          <p className="text-sm text-slate-200 font-medium">Challenge of the Week:</p>
          <p className="text-lg font-bold text-teal-400 mt-1">Ask a stranger for the time & start a 10s conversation.</p>
          <button onClick={() => addXP(150, "Social Challenge Complete")} className="mt-4 w-full py-3 bg-teal-600 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/10">Mark Complete +150 XP</button>
        </div>
      </div>
    </div>
  );

  const WealthSection = () => {
    const totalIncome = data.projects.reduce((acc, p) => acc + p.income, 0);

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <SectionHeader title="Wealth & Projects" subtitle="Build assets and monetize skills" />
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold flex items-center gap-2"><DollarSign size={18} className="text-emerald-400" /> Monetization Log</h4>
            <span className="text-sm font-mono text-emerald-400">${totalIncome.toFixed(2)}</span>
          </div>
          
          <div className="space-y-4">
            {data.projects.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">No active projects. Start building your ecosystem.</p>
            ) : (
              data.projects.map(project => (
                <div key={project.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        project.priority === 'high' ? 'bg-red-500' : 
                        project.priority === 'medium' ? 'bg-yellow-500' : 'bg-teal-500'
                      }`} />
                      <p className="text-sm font-bold">{project.title}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">${project.income}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{project.description}</p>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar size={10} /> {project.dueDate}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      <AlertCircle size={10} /> {project.priority}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={addSampleProject}
            className="w-full mt-4 py-2 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors rounded-xl text-xs font-bold text-teal-400"
          >
            + New Project / Asset
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="font-bold mb-4">Core Principles</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex gap-2"><span>•</span> Focus on High Leverage Skills</li>
            <li className="flex gap-2"><span>•</span> Build in Public (7K Philosophy)</li>
            <li className="flex gap-2"><span>•</span> Compound Interest over everything</li>
          </ul>
        </div>
      </div>
    );
  };

  const SettingsSection = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Settings & Creator" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div>
            <p className="font-bold text-sm">Dopamine Control Mode</p>
            <p className="text-[10px] text-slate-400">Blocks non-essential tabs during deep work</p>
          </div>
          <div className="w-12 h-6 bg-slate-700 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-lg font-bold text-white mb-2">About the Creator</h3>
        <p className="text-sm font-bold text-teal-400 mb-4">Kunal (Founder of 7K Ecosystem)</p>
        <div className="space-y-4">
          <a href="https://7kc.me" target="_blank" className="flex items-center gap-3 text-slate-300 hover:text-teal-400 transition-colors">
            <ExternalLink size={18} /> <span className="text-sm">Portfolio: 7kc.me</span>
          </a>
          <a href="https://instagram.com/" target="_blank" className="flex items-center gap-3 text-slate-300 hover:text-teal-400 transition-colors">
            <Instagram size={18} /> <span className="text-sm">Instagram</span>
          </a>
          <a href="https://github.com/" target="_blank" className="flex items-center gap-3 text-slate-300 hover:text-teal-400 transition-colors">
            <Github size={18} /> <span className="text-sm">GitHub</span>
          </a>
          <a href="mailto:kunal@7kc.me" className="flex items-center gap-3 text-slate-300 hover:text-teal-400 transition-colors">
            <Mail size={18} /> <span className="text-sm">kunal@7kc.me</span>
          </a>
        </div>
      </div>

      <div className="text-center text-slate-500 text-xs">
        <p>© 2025 7K Ecosystem. All rights reserved.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 flex flex-col relative pb-20 shadow-2xl shadow-teal-500/5">
      <XPHeader />
      
      <main className="flex-1 p-5 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'physical' && <PhysicalSection />}
        {activeTab === 'intelligence' && <IntelligenceSection />}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'wealth' && <WealthSection />}
        {activeTab === 'settings' && <SettingsSection />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-3 grid grid-cols-6 gap-1 z-50">
        <TabButton id="dashboard" icon={LayoutDashboard} label="Home" />
        <TabButton id="physical" icon={Dumbbell} label="Body" />
        <TabButton id="intelligence" icon={Brain} label="Mind" />
        <TabButton id="skills" icon={Target} label="Skills" />
        <TabButton id="wealth" icon={DollarSign} label="Wealth" />
        <TabButton id="settings" icon={Settings} label="Meta" />
      </nav>
    </div>
  );
};

export default App;