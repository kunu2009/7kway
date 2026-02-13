import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  Zap, Brain, Target, DollarSign, Settings, 
  Dumbbell, CheckCircle2, Trophy, Clock, 
  BookOpen, Music, Share2, Github, Instagram, ExternalLink, Mail,
  LayoutDashboard, Flame, Box, Calendar as CalendarIcon, AlertCircle, Shield,
  ArrowUp, ArrowDown, Eye, GripVertical, Download, ChevronRight, GraduationCap,
  Link as LinkIcon, Plus, Trash2, ChevronDown, ChevronUp, Flag, CheckSquare, Square,
  RotateCcw, Play, Pause, X, GripHorizontal, EyeOff, Undo2, RefreshCw,
  Droplets, Moon, Utensils, TrendingUp, Scale, Minus
} from 'lucide-react';
import { Area, AppData, Habit, Project, LogEntry, WidgetType, Exam, Task, StudyMaterial } from './types';
import { loadData, saveData } from './db';

// Undo Types
type UndoAction = 
  | { type: 'TASK_DELETE'; payload: Task }
  | { type: 'MATERIAL_DELETE'; payload: { examId: string; material: StudyMaterial } };

const ExamItem = ({ exam, onAddMaterial, onDeleteMaterial }: { 
  exam: Exam; 
  onAddMaterial: (id: string, title: string, url: string) => void; 
  onDeleteMaterial: (examId: string, matId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft < 7 && daysLeft >= 0;
  const isPast = daysLeft < 0;

  const handleAdd = () => {
    if (title.trim() && url.trim()) {
      onAddMaterial(exam.id, title, url);
      setTitle('');
      setUrl('');
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 ${isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900 border-slate-800'}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${exam.type === 'board' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">{exam.subject}</p>
            <p className="text-[10px] text-slate-400 uppercase">{new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {exam.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {isPast ? (
                <span className="text-xs font-bold text-slate-500">Done</span>
            ) : (
              <>
                <p className={`text-xl font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>{daysLeft}</p>
                <p className="text-[10px] text-slate-500">days left</p>
              </>
            )}
          </div>
          {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="h-px w-full bg-slate-800 mb-4" />
          
          <h5 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <BookOpen size={14} /> Study Materials
          </h5>

          <div className="space-y-2 mb-4">
            {exam.studyMaterials && exam.studyMaterials.length > 0 ? (
              exam.studyMaterials.map(mat => (
                <div key={mat.id} className="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                  <a href={mat.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 truncate max-w-[200px]">
                    <LinkIcon size={12} />
                    <span className="truncate">{mat.title}</span>
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteMaterial(exam.id, mat.id); }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-600 italic">No materials added yet.</p>
            )}
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Add New Resource</p>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Title (e.g., Chapter 1 Notes)" 
                className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="URL" 
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  onClick={handleAdd}
                  className="bg-teal-500 hover:bg-teal-400 text-white p-2 rounded transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'physical' | 'intelligence' | 'skills' | 'wealth' | 'settings'>('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Undo State
  const [undoStack, setUndoStack] = useState<UndoAction | null>(null);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle Loading Screen (Splash)
  useEffect(() => {
    // Add a small delay to simulate loading or ensure splash is seen
    const timer = setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            // Optional: Remove from DOM after transition
            setTimeout(() => {
                splash.remove();
            }, 600);
        }
    }, 1500); // 1.5 seconds visible splash
    return () => clearTimeout(timer);
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleHardRefresh = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

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
        logs: [newLog, ...prev.logs].slice(0, 500) // Keep last 500 logs
      };
    });
  }, []);

  // --- Undo Logic ---
  const triggerUndo = (action: UndoAction) => {
    if (undoTimer) clearTimeout(undoTimer);
    setUndoStack(action);
    const timer = setTimeout(() => setUndoStack(null), 5000);
    setUndoTimer(timer);
  };

  const handleUndo = () => {
    if (!undoStack) return;

    if (undoStack.type === 'TASK_DELETE') {
        const task = undoStack.payload;
        setData(prev => ({
            ...prev,
            tasks: [task, ...prev.tasks].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }));
    } else if (undoStack.type === 'MATERIAL_DELETE') {
        const { examId, material } = undoStack.payload;
        setData(prev => ({
            ...prev,
            exams: prev.exams.map(e => {
                if (e.id === examId) {
                    return { ...e, studyMaterials: [...(e.studyMaterials || []), material] };
                }
                return e;
            })
        }));
    }

    setUndoStack(null);
    if (undoTimer) clearTimeout(undoTimer);
  };
  // ------------------

  // --- Task Management Functions ---
  const addTask = (title: string, isPriority: boolean) => {
    if (!title.trim()) return;
    setData(prev => ({
      ...prev,
      tasks: [
        { 
          id: Math.random().toString(36).substr(2, 9), 
          title, 
          completed: false, 
          isPriority, 
          createdAt: new Date().toISOString() 
        },
        ...prev.tasks
      ]
    }));
  };

  const toggleTask = (id: string) => {
    setData(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === id) {
          return { ...t, completed: !t.completed };
        }
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = data.tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    
    triggerUndo({ type: 'TASK_DELETE', payload: taskToDelete });

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };
  // -------------------------------

  const addStudyMaterial = (examId: string, title: string, url: string) => {
    setData(prev => ({
      ...prev,
      exams: prev.exams.map(e => {
        if (e.id === examId) {
          const newMat = { id: Math.random().toString(36).substr(2, 9), title, url };
          return { ...e, studyMaterials: [...(e.studyMaterials || []), newMat] };
        }
        return e;
      })
    }));
    addXP(10, `Added resource: ${title}`);
  };

  const deleteStudyMaterial = (examId: string, matId: string) => {
    const exam = data.exams.find(e => e.id === examId);
    const material = exam?.studyMaterials?.find(m => m.id === matId);

    if (material) {
        triggerUndo({ type: 'MATERIAL_DELETE', payload: { examId, material } });
        setData(prev => ({
            ...prev,
            exams: prev.exams.map(e => {
                if (e.id === examId) {
                return { ...e, studyMaterials: (e.studyMaterials || []).filter(m => m.id !== matId) };
                }
                return e;
            })
        }));
    }
  };

  // Corrected toggleHabit to handle state updates atomically
  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setData(prev => {
      let xpChange = 0;
      let newLog: LogEntry | null = null;
      
      const newHabits = prev.habits.map(h => {
        if (h.id === id) {
          const isDone = h.completedDates.includes(today);
          if (isDone) {
            // Unticking: Remove XP
            xpChange = -h.xpValue;
            return { ...h, completedDates: h.completedDates.filter(d => d !== today) };
          } else {
            // Ticking: Add XP
            xpChange = h.xpValue;
            newLog = {
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date().toISOString(),
              type: 'xp',
              value: h.xpValue,
              label: `Habit: ${h.name}`
            };
            return { ...h, completedDates: [...h.completedDates, today] };
          }
        }
        return h;
      });

      // Prevent negative XP
      const newXp = Math.max(0, prev.stats.xp + xpChange);
      const newLogs = newLog ? [newLog, ...prev.logs].slice(0, 100) : prev.logs;

      return { 
        ...prev, 
        stats: { ...prev.stats, xp: newXp },
        habits: newHabits,
        logs: newLogs
      };
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

  // --- Physical Section Logic ---
  const updatePhysicalStat = (key: keyof typeof data.physical, value: number) => {
    setData(prev => ({
      ...prev,
      physical: {
        ...prev.physical,
        [key]: value
      }
    }));
  };

  const updatePB = (exercise: keyof typeof data.physical.pbs, value: number) => {
    setData(prev => {
        const oldPB = prev.physical.pbs[exercise];
        if (value > oldPB) {
            // New PB Logic
            addXP(100, `New PB: ${exercise} (${value})`);
            return {
                ...prev,
                physical: {
                    ...prev.physical,
                    pbs: { ...prev.physical.pbs, [exercise]: value }
                }
            };
        }
        return prev;
    });
  };
  // -----------------------------

  // UI Components
  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => {
    if (id !== 'dashboard' && id !== 'settings') {
      const sectionKey = id as keyof typeof data.settings.activeSections;
      if (!data.settings.activeSections[sectionKey]) return null;
    }

    return (
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
  };

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
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 ease-out" 
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
    // REAL DATA for Chart
    const chartData = useMemo(() => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Sum XP logs for this day
        const xpForDay = data.logs
          .filter(log => log.type === 'xp' && log.timestamp.startsWith(dateStr))
          .reduce((sum, log) => sum + log.value, 0);

        days.push({ name: dayName, xp: xpForDay });
      }
      return days;
    }, [data.logs]);

    const completionRate = useMemo(() => {
      const today = new Date().toISOString().split('T')[0];
      const done = data.habits.filter(h => h.completedDates.includes(today)).length;
      return data.habits.length > 0 ? (done / data.habits.length) * 100 : 0;
    }, [data.habits]);

    // Widget: Priority Board
    const PriorityWidget = () => {
        const [newTask, setNewTask] = useState('');
        const priorityTasks = data.tasks.filter(t => t.isPriority);

        return (
            <div key="priority" className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Flag size={64} className="text-purple-500"/>
                </div>
                <div className="relative z-10">
                    <h4 className="font-bold text-lg text-white mb-1 flex items-center gap-2">
                        <Flag size={18} className="text-purple-400" /> Priority Board
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">Mission critical tasks for today</p>
                    
                    <div className="space-y-2 mb-4">
                        {priorityTasks.length === 0 && <p className="text-xs text-slate-500 italic">No priorities set.</p>}
                        {priorityTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-purple-500/10">
                                <button onClick={() => toggleTask(task.id)} className="text-purple-400 hover:text-purple-300 transition-colors shrink-0">
                                    {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                </button>
                                <span 
                                    onClick={() => toggleTask(task.id)}
                                    className={`flex-1 text-sm font-medium cursor-pointer select-none transition-colors hover:text-purple-300 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}
                                >
                                    {task.title}
                                </span>
                                <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-red-400 p-1">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Add priority task..." 
                            className="flex-1 bg-slate-900/80 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (addTask(newTask, true), setNewTask(''))}
                        />
                        <button 
                            onClick={() => { addTask(newTask, true); setNewTask(''); }}
                            className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Widget: Daily Tasks
    const TasksWidget = () => {
        const [newTask, setNewTask] = useState('');
        const normalTasks = data.tasks.filter(t => !t.isPriority);

        return (
            <div key="tasks" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
                <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-teal-400" /> Daily Operations
                </h4>
                
                <div className="space-y-2 mb-4">
                     {normalTasks.length === 0 && <p className="text-xs text-slate-500 italic">No tasks pending.</p>}
                     {normalTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors group">
                            <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-teal-400 transition-colors shrink-0">
                                {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>
                            <span 
                                onClick={() => toggleTask(task.id)}
                                className={`flex-1 text-sm cursor-pointer select-none transition-colors hover:text-teal-400 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                            >
                                {task.title}
                            </span>
                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-opacity p-1">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 items-center mt-2 border-t border-slate-800 pt-3">
                    <Plus size={14} className="text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Add new task..." 
                        className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-slate-600"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (addTask(newTask, false), setNewTask(''))}
                    />
                     <button 
                        onClick={() => { addTask(newTask, false); setNewTask(''); }}
                        className="text-xs font-bold text-teal-400 uppercase"
                    >
                        Add
                    </button>
                </div>
            </div>
        );
    };

    const widgetComponents = {
      welcome: (
        <div key="welcome" className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6 text-center mb-6">
          <p className="text-teal-400 text-sm font-medium mb-1">Made by 7K Ecosystem</p>
          <h3 className="text-xl font-bold text-white">Focus: Board Exam Peak Performance</h3>
        </div>
      ),
      priority: <PriorityWidget />,
      tasks: <TasksWidget />,
      exams: (
        <div key="exams" className="mb-6 space-y-3">
          <SectionHeader title="Exam Countdown" subtitle="Mission Critical Milestones" />
          <div className="grid gap-3">
            {data.exams.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => (
              <ExamItem 
                key={exam.id} 
                exam={exam} 
                onAddMaterial={addStudyMaterial} 
                onDeleteMaterial={deleteStudyMaterial}
              />
            ))}
          </div>
        </div>
      ),
      calendar: (
        <div key="calendar" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold text-sm flex items-center gap-2"><CalendarIcon size={16} className="text-teal-400"/> Calendar</h4>
             <span className="text-xs text-slate-500">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] text-slate-500 font-bold">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Simple calendar logic for current month */}
            {(() => {
              const today = new Date();
              const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
              const els = [];
              
              // Empty slots
              for(let i=0; i<firstDay; i++) els.push(<div key={`empty-${i}`} className="h-8"></div>);
              
              // Days
              for(let i=1; i<=daysInMonth; i++) {
                const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
                const isToday = i === today.getDate();
                const exam = data.exams.find(e => e.date === dateStr);
                
                els.push(
                  <div key={i} className={`h-8 flex items-center justify-center rounded-lg text-xs font-medium relative ${
                    isToday ? 'bg-teal-500 text-white' : 
                    exam ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 
                    'text-slate-400 hover:bg-slate-800'
                  }`}>
                    {i}
                    {exam && <div className="absolute bottom-0.5 w-1 h-1 bg-purple-400 rounded-full"></div>}
                  </div>
                );
              }
              return els;
            })()}
          </div>
        </div>
      ),
      stats: (
        <div key="stats" className="grid grid-cols-2 gap-4 mb-6">
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
      ),
      chart: (
        <div key="chart" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
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
      ),
      habits: (
        <div key="habits" className="space-y-3 mb-6">
          <SectionHeader title="Daily Quest" subtitle="Complete these for a perfect streak" />
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
      )
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        {data.settings.dashboardLayout.map(widgetId => widgetComponents[widgetId])}
      </div>
    );
  };

  const PhysicalSection = () => {
    // Helper for PB updates (Gamification)
    const handlePBUpdate = (exercise: string, currentValue: number) => {
        const input = prompt(`Enter new max reps for ${exercise}:`, currentValue.toString());
        if (input) {
            const newVal = parseInt(input);
            if (!isNaN(newVal) && newVal > currentValue) {
                // @ts-ignore - dynamic key access
                updatePB(exercise.toLowerCase() as any, newVal);
            }
        }
    };

    return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <SectionHeader title="Bio-Hacking Dashboard" subtitle="Optimize your vessel for peak performance" />
      
      {/* Bio-Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Water Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-400 uppercase flex items-center gap-1">
                    <Droplets size={14} className="text-blue-400" /> Hydration
                </h4>
                <span className="text-lg font-bold text-white">{data.physical?.waterIntake || 0}<span className="text-slate-500 text-xs">/8</span></span>
            </div>
            <div className="flex justify-between items-center gap-1">
                {Array.from({length: 8}).map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-8 flex-1 rounded-md transition-all duration-300 ${i < (data.physical?.waterIntake || 0) ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}
                    />
                ))}
            </div>
            <div className="flex gap-2 mt-3">
                 <button 
                    onClick={() => updatePhysicalStat('waterIntake', Math.max(0, (data.physical?.waterIntake || 0) - 1))}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-1 flex items-center justify-center"
                 >
                    <Minus size={16} />
                 </button>
                 <button 
                    onClick={() => {
                        const current = data.physical?.waterIntake || 0;
                        if(current < 8) {
                            updatePhysicalStat('waterIntake', current + 1);
                            if (current + 1 === 8) addXP(50, "Hydration Goal Met");
                        }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-1 flex items-center justify-center"
                 >
                    <Plus size={16} />
                 </button>
            </div>
        </div>

        {/* Nutrition / Sleep */}
        <div className="space-y-3">
            {/* Sleep */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                <div>
                     <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1"><Moon size={12} className="text-purple-400"/> Sleep (h)</p>
                     <input 
                        type="number" 
                        value={data.physical?.sleepHours || 0}
                        onChange={(e) => updatePhysicalStat('sleepHours', parseFloat(e.target.value))}
                        className="bg-transparent text-xl font-bold w-16 focus:outline-none"
                     />
                </div>
            </div>
            {/* Protein */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                <div>
                     <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1"><Utensils size={12} className="text-orange-400"/> Protein (g)</p>
                     <input 
                        type="number" 
                        value={data.physical?.proteinIntake || 0}
                        onChange={(e) => updatePhysicalStat('proteinIntake', parseInt(e.target.value))}
                        className="bg-transparent text-xl font-bold w-16 focus:outline-none"
                     />
                </div>
            </div>
        </div>
      </div>

      {/* The Protocol (Habits) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold flex items-center gap-2"><Target size={18} className="text-teal-400" /> The Protocol</h4>
            <span className="text-xs bg-teal-400/10 text-teal-400 px-2 py-1 rounded">Daily</span>
          </div>
          <div className="space-y-3">
             {data.habits.filter(h => h.category === Area.Physical).map(habit => {
                 const isDone = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
                 return (
                    <div key={habit.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer" onClick={() => toggleHabit(habit.id)}>
                        <span className={isDone ? 'text-teal-400 line-through' : 'text-slate-200'}>{habit.name}</span>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isDone ? 'bg-teal-500 border-teal-500' : 'border-slate-600'}`}>
                            {isDone && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                    </div>
                 );
             })}
             {data.habits.filter(h => h.category === Area.Physical).length === 0 && (
                 <p className="text-xs text-slate-500 italic">No physical habits set in 'Meta' settings.</p>
             )}
          </div>
      </div>

      {/* Workout Lab */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="font-bold mb-4 flex items-center gap-2"><Dumbbell size={18} className="text-teal-400" /> Training Lab</h4>
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: 'Pushups', key: 'pushups', icon: Flame },
                { label: 'Pullups', key: 'pullups', icon: Dumbbell },
                { label: 'Squats', key: 'squats', icon: ActivityIcon }, // Placeholder icon if needed, defined locally
                { label: 'Plank (s)', key: 'plank', icon: Clock },
            ].map((item) => {
                // @ts-ignore
                const val = data.physical?.pbs?.[item.key] || 0;
                return (
                    <div key={item.key} className="bg-slate-950 border border-slate-800 p-3 rounded-xl relative group">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{item.label}</p>
                        <p className="text-2xl font-black text-white">{val}</p>
                        <button 
                            onClick={() => handlePBUpdate(item.key, val)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-teal-500 text-white p-1 rounded-md"
                        >
                            <TrendingUp size={14} />
                        </button>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  )};

  const IntelligenceSection = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const totalTime = 25 * 60;

    useEffect(() => {
      let interval: any = null;
      if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((time) => time - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        setIsActive(false);
        addXP(100, "Pomodoro Session Complete");
        setTimeLeft(25 * 60);
      }
      return () => clearInterval(interval);
    }, [isActive, timeLeft, addXP]);

    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Circular Progress Calculation
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((totalTime - timeLeft) / totalTime) * circumference;

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <SectionHeader title="The Intelligence Mind" subtitle="Sharpen your cognitive edge" />
        
        {/* Pomodoro Timer Component */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={100} className="text-teal-500" />
          </div>
          
          <h4 className="text-xs text-slate-400 uppercase tracking-widest mb-6 font-bold flex items-center justify-center gap-2">
            <Brain size={14} /> Pomodoro Focus
          </h4>

          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#0f172a"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#14b8a6"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-4xl font-black font-mono text-white tracking-tighter">
                {formatTime(timeLeft)}
              </div>
              <p className="text-[10px] text-teal-400 font-bold uppercase mt-1">
                {isActive ? 'Focusing...' : 'Ready'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20' 
                  : 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:scale-105'
              }`}
            >
              {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start Focus</>}
            </button>
            <button 
              onClick={() => { setTimeLeft(25*60); setIsActive(false); }} 
              className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Existing Book Tracker */}
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

        {/* Existing Chess Tracker */}
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
                      <CalendarIcon size={10} /> {project.dueDate}
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

  const SettingsSection = () => {
    // Helper to toggle active sections
    const toggleSection = (section: keyof typeof data.settings.activeSections) => {
      setData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          activeSections: {
            ...prev.settings.activeSections,
            [section]: !prev.settings.activeSections[section]
          }
        }
      }));
    };

    const ALL_WIDGETS: WidgetType[] = ['welcome', 'priority', 'tasks', 'exams', 'calendar', 'stats', 'chart', 'habits'];

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        // Default ghost image is usually sufficient
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
        }
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault(); // Necessary to allow dropping
        if (draggedIndex === null) return;
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;
        
        const layout = [...data.settings.dashboardLayout];
        const draggedItem = layout[draggedIndex];
        
        // Remove from old pos and insert at new pos
        layout.splice(draggedIndex, 1);
        layout.splice(dropIndex, 0, draggedItem);
        
        setData(prev => ({
            ...prev,
            settings: { ...prev.settings, dashboardLayout: layout }
        }));
        setDraggedIndex(null);
    };

    // Mobile reorder helper
    const moveWidget = (index: number, direction: 'up' | 'down') => {
        const layout = [...data.settings.dashboardLayout];
        if (direction === 'up' && index > 0) {
            [layout[index - 1], layout[index]] = [layout[index], layout[index - 1]];
        } else if (direction === 'down' && index < layout.length - 1) {
            [layout[index + 1], layout[index]] = [layout[index], layout[index + 1]];
        }
        setData(prev => ({
            ...prev,
            settings: { ...prev.settings, dashboardLayout: layout }
        }));
    };

    const toggleWidget = (widget: WidgetType) => {
        const layout = data.settings.dashboardLayout;
        if (layout.includes(widget)) {
            setData(prev => ({
                ...prev,
                settings: { ...prev.settings, dashboardLayout: layout.filter(w => w !== widget) }
            }));
        } else {
            setData(prev => ({
                ...prev,
                settings: { ...prev.settings, dashboardLayout: [...layout, widget] }
            }));
        }
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 pb-20">
        <SectionHeader title="Settings & Customization" />

        {/* PWA Install Button - Only shows if deferredPrompt exists */}
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform"
          >
            <Download size={20} />
            Install App to Home Screen
          </button>
        )}

        {/* Manual Cache Clear */}
        <button 
            onClick={handleHardRefresh}
            className="w-full bg-slate-800 border border-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
        >
            <RefreshCw size={18} />
            Hard Refresh (Fix Bugs/Updates)
        </button>
        
        {/* Dashboard Layout - Drag & Drop + Mobile Arrows */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="font-bold mb-4 flex items-center gap-2">
             <LayoutDashboard size={18} className="text-teal-400" /> Dashboard Layout
          </h4>
          <p className="text-xs text-slate-400 mb-4">Drag to reorder (Desktop) or use arrows (Mobile).</p>
          
          {/* Active Widgets */}
          <div className="space-y-2 mb-6">
            {data.settings.dashboardLayout.map((widget, index) => (
              <div 
                key={widget} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-transparent hover:border-teal-500/30 cursor-grab active:cursor-grabbing transition-colors ${draggedIndex === index ? 'opacity-50 border-teal-500' : ''}`}
              >
                 <div className="flex items-center gap-3">
                    {/* Reordering Controls - Enhanced for touch */}
                    <div className="flex flex-col gap-1 md:hidden">
                        <button 
                            onClick={(e) => { e.stopPropagation(); moveWidget(index, 'up'); }}
                            disabled={index === 0}
                            className="p-2 -m-1 text-slate-500 hover:text-teal-400 disabled:opacity-30 active:scale-95 transition-transform"
                            aria-label="Move Up"
                        >
                            <ChevronUp size={20} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); moveWidget(index, 'down'); }}
                            disabled={index === data.settings.dashboardLayout.length - 1}
                            className="p-2 -m-1 text-slate-500 hover:text-teal-400 disabled:opacity-30 active:scale-95 transition-transform"
                            aria-label="Move Down"
                        >
                            <ChevronDown size={20} />
                        </button>
                    </div>
                    <GripVertical size={16} className="text-slate-500 hidden md:block" />
                    
                    <span className="capitalize text-sm font-medium text-slate-200">{widget}</span>
                 </div>
                 <button 
                    onClick={() => toggleWidget(widget)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                 >
                    <X size={18} />
                 </button>
              </div>
            ))}
            {data.settings.dashboardLayout.length === 0 && (
                <p className="text-xs text-slate-600 text-center italic py-2">No widgets visible on dashboard.</p>
            )}
          </div>

          {/* Available Widgets */}
          {ALL_WIDGETS.some(w => !data.settings.dashboardLayout.includes(w)) && (
            <div className="pt-4 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Hidden Widgets</p>
                <div className="grid grid-cols-2 gap-2">
                    {ALL_WIDGETS.filter(w => !data.settings.dashboardLayout.includes(w)).map(widget => (
                        <button 
                            key={widget}
                            onClick={() => toggleWidget(widget)}
                            className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-teal-500/30 transition-colors group"
                        >
                            <span className="capitalize text-xs text-slate-400 group-hover:text-slate-200">{widget}</span>
                            <Plus size={14} className="text-teal-500" />
                        </button>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* Module Visibility */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="font-bold mb-4 flex items-center gap-2">
             <Eye size={18} className="text-teal-400" /> Focus Modules
          </h4>
          <p className="text-xs text-slate-400 mb-4">Toggle sections to reduce clutter.</p>
          <div className="space-y-3">
            {Object.keys(data.settings.activeSections).map(key => {
               const k = key as keyof typeof data.settings.activeSections;
               return (
                <div key={k} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                  <span className="capitalize text-sm font-medium">{k}</span>
                  <button 
                    onClick={() => toggleSection(k)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${data.settings.activeSections[k] ? 'bg-teal-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.settings.activeSections[k] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
               );
            })}
          </div>
        </div>

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
  };

  // Define simple icon component for activity to avoid errors if not imported
  const ActivityIcon = ({size, className}: {size: number, className?: string}) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
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

      {/* Undo Toast */}
      {undoStack && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-4 z-50 animate-in slide-in-from-bottom-4 duration-200">
            <span className="text-sm text-slate-300 flex items-center gap-2">
                <Trash2 size={16} /> Deleted
            </span>
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleUndo} 
                    className="flex items-center gap-1 text-teal-400 font-bold text-sm hover:underline"
                >
                    <Undo2 size={16} /> Undo
                </button>
                <button onClick={() => setUndoStack(null)} className="text-slate-500 hover:text-white">
                    <X size={16}/>
                </button>
            </div>
        </div>
      )}

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