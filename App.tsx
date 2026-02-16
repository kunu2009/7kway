import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line, YAxis
} from 'recharts';
import { 
  Zap, Brain, Target, DollarSign, Settings as SettingsIcon, 
  Dumbbell, CheckCircle2, Trophy, Clock, Home, ArrowRight,
  BookOpen, Music, Share2, ExternalLink, Mail,
  LayoutDashboard, Flame, Box, Calendar as CalendarIcon, Shield,
  ArrowUp, Plus, Trash2, ChevronDown, ChevronUp, Flag, CheckSquare, Square,
  RotateCcw, X, Eye, EyeOff,
  Droplets, Moon, Utensils, Scale, Minus, UserCircle, ScanFace, Ruler, Weight,
  Palette, Sun, Moon as MoonIcon, Sparkles, Activity, Layers, ListFilter, Info,
  GraduationCap, Play, Pause, SkipForward, Timer, TrendingUp, Wallet, Code,
  Gamepad2, Languages, Guitar, AlertTriangle, Heart, Coffee, Snowflake, Ban,
  IndianRupee, PiggyBank, Briefcase, Award, Star, CircleDot,
  Footprints, Waves, Wind, Bike, Swords, Repeat, Phone, Sunrise, Sunset, Smile, Meh, Frown,
  HelpCircle, Battery, BatteryLow, Rocket, RefreshCcw, Volume2, VolumeX, Crosshair, Hand, Lightbulb
} from 'lucide-react';
import { Area, AppData, Habit, LogEntry, WidgetType, Exam, Task, StudyMaterial, AccentColor, FitnessGoal, PhysicalStats, UserProfile, Skill, SkillCategory, IncomeSource, DisciplineStats, WorkoutSession, Exercise, MuscleGroup, DailyCheckIn, DailyProtocol, ProtocolTask, StudySubject, StudyChapter, StudyTopic } from './types';
import { loadData, saveData, APP_VERSION } from './db';

// --- Static Data Libraries ---
const EXERCISE_LIBRARY = {
  face: [
    { 
      name: 'Mewing', 
      benefit: 'Jawline definition & face structure', 
      steps: ['Rest tongue on roof of mouth', 'Keep lips sealed', 'Breathe through nose'],
      frequency: 'Always'
    },
    { 
      name: 'Jawline Curls', 
      benefit: 'Sharp jawline & skin tightening', 
      steps: ['Look up at ceiling', 'Push lower jaw forward', 'Hold for 10s'],
      frequency: '3 sets of 15'
    },
    { 
      name: 'Cheekbone Lifts', 
      benefit: 'Higher cheekbone appearance', 
      steps: ['Place three fingers on cheekbones', 'Smile broadly', 'Push cheeks up against resistance'],
      frequency: '2 sets of 20'
    }
  ],
  physical: [
    { 
      name: 'Dead Hangs', 
      benefit: 'Spinal decompression & height', 
      steps: ['Grip bar with overhand grip', 'Relax lower body completely', 'Hold for as long as possible'],
      goalFocus: ['sleeper-build', 'athletic']
    },
    { 
      name: 'Compound Squats', 
      benefit: 'Testosterone boost & leg mass', 
      steps: ['Feet shoulder-width apart', 'Lower hips below knees', 'Push through heels'],
      goalFocus: ['bulk', 'athletic']
    },
    { 
      name: 'Incline Pushups', 
      benefit: 'Upper chest shelf & aesthetics', 
      steps: ['Hands on elevated surface', 'Elbows at 45 degrees', 'Chest to surface'],
      goalFocus: ['shredded', 'bulk']
    }
  ]
};

// --- Utilities ---
const calculateBMI = (h: number, w: number) => {
  if (!h || !w) return 0;
  const hMetres = h / 100;
  return parseFloat((w / (hMetres * hMetres)).toFixed(1));
};

const calculateTDEE = (h: number, w: number, a: number) => {
  if (!h || !w || !a) return 0;
  const bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
  return Math.round(bmr * 1.375);
};

// --- Time-Aware Utilities ---
type TimePeriod = 'early_morning' | 'study_time' | 'evening' | 'wind_down' | 'sleep_time';

const getTimePeriod = (): TimePeriod => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'early_morning';
  if (hour >= 8 && hour < 17) return 'study_time';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 && hour < 23) return 'wind_down';
  return 'sleep_time'; // 11pm-5am
};

const getGreeting = (name: string): { greeting: string; emoji: string; subtitle: string } => {
  const hour = new Date().getHours();
  const period = getTimePeriod();
  
  if (period === 'early_morning') {
    return { greeting: `Good morning, ${name}!`, emoji: '🌅', subtitle: "Let's crush today!" };
  }
  if (period === 'study_time') {
    if (hour < 12) return { greeting: `Keep going, ${name}!`, emoji: '📚', subtitle: 'Focus mode activated' };
    return { greeting: `Good afternoon, ${name}!`, emoji: '💪', subtitle: 'Stay focused!' };
  }
  if (period === 'evening') {
    return { greeting: `Evening, ${name}!`, emoji: '🌆', subtitle: 'Time to wind down & review' };
  }
  if (period === 'wind_down') {
    return { greeting: `Wind down time, ${name}`, emoji: '🌙', subtitle: 'Prepare for rest' };
  }
  return { greeting: `You should be sleeping, ${name}!`, emoji: '😴', subtitle: 'Rest is important for growth' };
};

const getMotivationalQuote = (): { quote: string; author: string } => {
  const quotes = [
    { quote: "The pain of discipline weighs ounces. The pain of regret weighs tons.", author: "Jim Rohn" },
    { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Success is not final, failure is not fatal. It is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { quote: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { quote: "Champions keep playing until they get it right.", author: "Billie Jean King" },
    { quote: "Every champion was once a contender that refused to give up.", author: "Rocky Balboa" },
    { quote: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
    { quote: "Work hard in silence. Let success make the noise.", author: "Frank Ocean" },
    { quote: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { quote: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { quote: "The only person you should try to be better than is who you were yesterday.", author: "Unknown" },
    { quote: "Obsessed is a word the lazy use to describe the dedicated.", author: "Unknown" },
    { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
    { quote: "A year from now, you'll wish you had started today.", author: "Karen Lamb" },
    { quote: "Be so good they can't ignore you.", author: "Steve Martin" },
    { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { quote: "If it doesn't challenge you, it won't change you.", author: "Fred DeVito" },
    { quote: "Consistency is what transforms average into excellence.", author: "Unknown" },
    { quote: "You are one decision away from a completely different life.", author: "Unknown" },
    { quote: "The grind includes days you don't feel like grinding.", author: "Unknown" },
    { quote: "Your comfort zone will kill your dreams.", author: "Unknown" },
    { quote: "Results happen over time, not overnight. Work hard, stay consistent.", author: "Unknown" },
    { quote: "Suffering is the currency of change.", author: "David Goggins" },
    { quote: "Stay hard.", author: "David Goggins" },
    { quote: "Discipline equals freedom.", author: "Jocko Willink" },
    { quote: "Take action, make mistakes, get better.", author: "Unknown" }
  ];
  const today = new Date().getDate();
  return quotes[today % quotes.length];
};

const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const getCurrentDateFormatted = (): string => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const getCurrentTimeFormatted = (): string => {
  return new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// --- Anti-Procrastination Emergency System ---

// 2-Minute Tasks for "I Can't Start" mode
const TWO_MINUTE_TASKS = [
  { task: "Open your textbook to today's chapter", icon: BookOpen, xp: 5 },
  { task: "Do 5 pushups right now", icon: Dumbbell, xp: 10 },
  { task: "Write down ONE goal for today", icon: Target, xp: 5 },
  { task: "Drink a glass of water", icon: Droplets, xp: 3 },
  { task: "Look at your exam date and feel the urgency", icon: CalendarIcon, xp: 5 },
  { task: "Stand up and stretch for 30 seconds", icon: Activity, xp: 3 },
  { task: "Close all social media tabs", icon: Ban, xp: 10 },
  { task: "Take 3 deep breaths", icon: Wind, xp: 3 },
];

// Mood Booster Activities
const MOOD_BOOSTERS = [
  { activity: "10 jumping jacks", benefit: "Quick energy boost", icon: Zap, xp: 15 },
  { activity: "Step outside for 2 min fresh air", benefit: "Reset your mind", icon: Sunrise, xp: 10 },
  { activity: "Cold water on face", benefit: "Instant alertness", icon: Snowflake, xp: 10 },
  { activity: "Listen to ONE motivational song", benefit: "Shift your state", icon: Music, xp: 5 },
  { activity: "Text someone you care about", benefit: "Human connection", icon: Heart, xp: 5 },
  { activity: "Look at your goal board", benefit: "Remember your why", icon: Target, xp: 5 },
];

// SOS Emergency Overlay Component
const SOSOverlay = ({ 
  isOpen, 
  onClose, 
  data, 
  actions, 
  accent 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: AppData; 
  actions: any; 
  accent: string;
}) => {
  const [phase, setPhase] = useState<'main' | 'breathing' | 'affirmation' | 'task'>('main');
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const affirmations = [
    "I am stronger than my excuses.",
    "Every expert was once a beginner.",
    "My circumstances don't define me. My actions do.",
    "I choose discipline over regret.",
    "I am building myself into someone unstoppable.",
    "The pain of discipline weighs ounces, regret weighs tons.",
    "I don't have to feel like it. I just have to do it.",
    "2 minutes. That's all I need to start."
  ];

  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
  const randomTask = TWO_MINUTE_TASKS[Math.floor(Math.random() * TWO_MINUTE_TASKS.length)];
  const TaskIcon = randomTask.icon;

  useEffect(() => {
    if (phase === 'breathing' && breathCount < 3) {
      const timer = setTimeout(() => {
        if (breathPhase === 'inhale') {
          setBreathPhase('hold');
        } else if (breathPhase === 'hold') {
          setBreathPhase('exhale');
        } else {
          setBreathPhase('inhale');
          setBreathCount(c => c + 1);
        }
      }, breathPhase === 'hold' ? 2000 : 4000);
      return () => clearTimeout(timer);
    }
  }, [phase, breathCount, breathPhase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/98 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-500 hover:text-white p-2"
      >
        <X size={24} />
      </button>

      {phase === 'main' && (
        <div className="text-center space-y-6 max-w-sm">
          <div className={`w-20 h-20 mx-auto rounded-full bg-${accent}-500/20 flex items-center justify-center`}>
            <HelpCircle size={40} className={`text-${accent}-500`} />
          </div>
          <h1 className="text-2xl font-black text-white">SOS Mode</h1>
          <p className="text-slate-400">You opened this because you're struggling. That takes courage. Let me help.</p>
          
          <div className="space-y-3 pt-4">
            <button 
              onClick={() => setPhase('breathing')}
              className="w-full py-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center gap-3"
            >
              <Wind size={20} /> Breathe First (30s)
            </button>
            <button 
              onClick={() => setPhase('affirmation')}
              className="w-full py-4 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-violet-400 font-bold flex items-center justify-center gap-3"
            >
              <Lightbulb size={20} /> I Need Motivation
            </button>
            <button 
              onClick={() => setPhase('task')}
              className="w-full py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center gap-3"
            >
              <Rocket size={20} /> Give Me ONE Task
            </button>
          </div>

          <p className="text-xs text-slate-600 pt-4">
            "The secret of getting ahead is getting started." — Mark Twain
          </p>
        </div>
      )}

      {phase === 'breathing' && (
        <div className="text-center space-y-8">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-[4000ms] ${
            breathPhase === 'inhale' ? 'scale-100 bg-cyan-500/30' : 
            breathPhase === 'hold' ? 'scale-110 bg-cyan-500/50' : 
            'scale-90 bg-cyan-500/20'
          }`}>
            <p className="text-2xl font-black text-cyan-400 uppercase">{breathPhase}</p>
          </div>
          <p className="text-slate-400">Breath {breathCount + 1} of 3</p>
          {breathCount >= 3 && (
            <div className="space-y-4">
              <p className="text-emerald-400 font-bold">You did it. Feel better?</p>
              <button 
                onClick={() => { setPhase('task'); setBreathCount(0); }}
                className={`px-6 py-3 rounded-xl bg-${accent}-500 text-white font-bold`}
              >
                Now Give Me a Task
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'affirmation' && (
        <div className="text-center space-y-8 max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-violet-500/20 flex items-center justify-center">
            <Sparkles size={40} className="text-violet-500" />
          </div>
          <p className="text-3xl font-black text-white leading-tight">"{randomAffirmation}"</p>
          <div className="pt-4 space-y-3">
            <button 
              onClick={() => { actions.addXP(10); setPhase('task'); }}
              className={`w-full py-4 rounded-2xl bg-${accent}-500 text-white font-bold`}
            >
              I Believe This (+10 XP)
            </button>
            <button 
              onClick={() => setPhase('main')}
              className="text-slate-500 text-sm"
            >
              Show me another
            </button>
          </div>
        </div>
      )}

      {phase === 'task' && (
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <TaskIcon size={40} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-emerald-400 font-bold uppercase mb-2">Your 2-Minute Task</p>
            <p className="text-2xl font-black text-white">{randomTask.task}</p>
          </div>
          <p className="text-slate-400 text-sm">Just this. Nothing else. 2 minutes max.</p>
          <button 
            onClick={() => { 
              actions.addXP(randomTask.xp); 
              onClose(); 
            }}
            className={`w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-lg`}
          >
            Done (+{randomTask.xp} XP)
          </button>
          <button 
            onClick={() => setPhase('main')}
            className="text-slate-500 text-sm block mx-auto"
          >
            Give me a different task
          </button>
        </div>
      )}
    </div>
  );
};

// Emergency Panel - Shows on Home Screen
const EmergencyPanel = ({ 
  data, 
  actions, 
  accent,
  onOpenSOS 
}: { 
  data: AppData; 
  actions: any; 
  accent: string;
  onOpenSOS: () => void;
}) => {
  const [activeMode, setActiveMode] = useState<'none' | 'cantStart' | 'overwhelmed' | 'relapsed' | 'low'>('none');
  const [justStartTimer, setJustStartTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Just Start 2-minute timer
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && justStartTimer < 120) {
      interval = setInterval(() => {
        setJustStartTimer(t => t + 1);
      }, 1000);
    } else if (justStartTimer >= 120) {
      setIsTimerRunning(false);
      actions.addXP(25);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, justStartTimer]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  // Decision-free next action
  const getNextAction = () => {
    const hour = new Date().getHours();
    const todayProtocol = data.protocols.find(p => p.date === new Date().toISOString().split('T')[0]);
    const hasWorkedOut = data.workouts.some(w => w.date.split('T')[0] === new Date().toISOString().split('T')[0]);
    
    // Morning priorities
    if (hour >= 5 && hour < 8) {
      if (!todayProtocol || todayProtocol.morningScore < 50) {
        return { task: "Complete your morning protocol", tab: 'physical', icon: Sunrise };
      }
    }
    
    // Study time
    if (hour >= 8 && hour < 17) {
      return { task: "Start a 25-min focus session", tab: 'intelligence', icon: BookOpen };
    }
    
    // Evening
    if (hour >= 17 && hour < 21) {
      if (!hasWorkedOut) {
        return { task: "Log today's workout", tab: 'physical', icon: Dumbbell };
      }
      return { task: "Review what you learned today", tab: 'intelligence', icon: Brain };
    }
    
    // Night
    return { task: "Complete your night protocol", tab: 'physical', icon: Moon };
  };

  const nextAction = getNextAction();
  const NextIcon = nextAction.icon;

  // Relapse recovery message
  const handleRelapse = () => {
    actions.resetNoFapStreak();
    setActiveMode('relapsed');
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Collapsed View - Emergency Buttons Row */}
      {activeMode === 'none' && !isTimerRunning && (
        <>
          {/* Decision-Free Card */}
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crosshair size={16} className="text-violet-500" />
                <span className="text-xs font-bold text-violet-400 uppercase">Decision-Free Mode</span>
              </div>
              <span className="text-[9px] text-slate-500">App picks for you</span>
            </div>
            <button 
              onClick={() => actions.setActiveTab(nextAction.tab)}
              className="w-full flex items-center gap-3 bg-violet-500/20 hover:bg-violet-500/30 rounded-xl p-3 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/30 flex items-center justify-center">
                <NextIcon size={20} className="text-violet-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">{nextAction.task}</p>
                <p className="text-violet-400 text-xs">Just do this. Nothing else.</p>
              </div>
              <ArrowRight size={16} className="text-violet-400" />
            </button>
          </div>

          {/* Just Start Timer */}
          <button 
            onClick={() => setIsTimerRunning(true)}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center gap-3`}
          >
            <Rocket size={20} className="text-emerald-400" />
            <span className="text-emerald-400 font-bold">Just Start: 2 Minutes</span>
          </button>

          {/* Emergency Buttons Grid */}
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => setActiveMode('cantStart')}
              className="bg-orange-500/10 rounded-xl p-3 text-center"
            >
              <BatteryLow size={18} className="text-orange-500 mx-auto mb-1" />
              <p className="text-[8px] font-bold text-orange-400">Can't Start</p>
            </button>
            <button 
              onClick={() => setActiveMode('overwhelmed')}
              className="bg-rose-500/10 rounded-xl p-3 text-center"
            >
              <AlertTriangle size={18} className="text-rose-500 mx-auto mb-1" />
              <p className="text-[8px] font-bold text-rose-400">Overwhelm</p>
            </button>
            <button 
              onClick={() => setActiveMode('low')}
              className="bg-blue-500/10 rounded-xl p-3 text-center"
            >
              <Heart size={18} className="text-blue-500 mx-auto mb-1" />
              <p className="text-[8px] font-bold text-blue-400">Low Mood</p>
            </button>
            <button 
              onClick={onOpenSOS}
              className="bg-red-500/10 rounded-xl p-3 text-center"
            >
              <HelpCircle size={18} className="text-red-500 mx-auto mb-1" />
              <p className="text-[8px] font-bold text-red-400">SOS</p>
            </button>
          </div>
        </>
      )}

      {/* Just Start Timer Running */}
      {isTimerRunning && (
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 rounded-2xl p-6 text-center">
          <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Just Start Timer</p>
          <p className="text-5xl font-black text-white mb-2">{formatTimer(justStartTimer)}</p>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-emerald-500 transition-all" 
              style={{ width: `${(justStartTimer / 120) * 100}%` }} 
            />
          </div>
          <p className="text-slate-400 text-sm mb-4">
            {justStartTimer < 120 
              ? "Just keep going. Don't think. Do." 
              : "🎉 You did it! +25 XP"
            }
          </p>
          {justStartTimer < 120 && (
            <button 
              onClick={() => { setIsTimerRunning(false); setJustStartTimer(0); }}
              className="text-slate-500 text-xs"
            >
              Cancel
            </button>
          )}
          {justStartTimer >= 120 && (
            <button 
              onClick={() => setJustStartTimer(0)}
              className={`px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold`}
            >
              Done! Keep Going?
            </button>
          )}
        </div>
      )}

      {/* Can't Start Mode */}
      {activeMode === 'cantStart' && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-orange-400 font-bold flex items-center gap-2">
              <BatteryLow size={18} /> Can't Start?
            </h3>
            <button onClick={() => setActiveMode('none')} className="text-slate-500">
              <X size={18} />
            </button>
          </div>
          <p className="text-slate-400 text-sm mb-4">Here's your TINY task. Just do this one thing:</p>
          {(() => {
            const task = TWO_MINUTE_TASKS[Math.floor(Math.random() * TWO_MINUTE_TASKS.length)];
            const TIcon = task.icon;
            return (
              <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                <TIcon size={32} className="text-orange-400 mx-auto mb-3" />
                <p className="text-white font-bold mb-4">{task.task}</p>
                <button 
                  onClick={() => { actions.addXP(task.xp); setActiveMode('none'); }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold"
                >
                  Done (+{task.xp} XP)
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Overwhelmed Mode */}
      {activeMode === 'overwhelmed' && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-rose-400 font-bold flex items-center gap-2">
              <AlertTriangle size={18} /> Feeling Overwhelmed?
            </h3>
            <button onClick={() => setActiveMode('none')} className="text-slate-500">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-white font-bold text-center py-4">
              Forget everything else.<br/>
              Your ONLY task right now:
            </p>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <BookOpen size={32} className="text-rose-400 mx-auto mb-3" />
              <p className="text-xl font-black text-white">Open your textbook.</p>
              <p className="text-slate-400 text-sm mt-2">That's it. Just open it.</p>
            </div>
            <button 
              onClick={() => { actions.addXP(15); setActiveMode('none'); }}
              className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold"
            >
              I Opened It (+15 XP)
            </button>
          </div>
        </div>
      )}

      {/* Low Mood Mode */}
      {activeMode === 'low' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-400 font-bold flex items-center gap-2">
              <Heart size={18} /> Feeling Low?
            </h3>
            <button onClick={() => setActiveMode('none')} className="text-slate-500">
              <X size={18} />
            </button>
          </div>
          <p className="text-slate-400 text-sm mb-4">Pick ONE mood booster:</p>
          <div className="space-y-2">
            {MOOD_BOOSTERS.slice(0, 4).map((boost, i) => {
              const BIcon = boost.icon;
              return (
                <button 
                  key={i}
                  onClick={() => { actions.addXP(boost.xp); setActiveMode('none'); }}
                  className="w-full flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800/50 rounded-xl p-3 transition-all"
                >
                  <BIcon size={20} className="text-blue-400" />
                  <div className="flex-1 text-left">
                    <p className="text-white font-bold text-sm">{boost.activity}</p>
                    <p className="text-slate-400 text-xs">{boost.benefit}</p>
                  </div>
                  <span className="text-blue-400 text-xs font-bold">+{boost.xp} XP</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Relapsed Recovery */}
      {activeMode === 'relapsed' && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-violet-400 font-bold flex items-center gap-2">
              <RefreshCcw size={18} /> Fresh Start
            </h3>
            <button onClick={() => setActiveMode('none')} className="text-slate-500">
              <X size={18} />
            </button>
          </div>
          <div className="text-center py-4">
            <p className="text-white font-bold text-lg mb-2">No shame. Just restart.</p>
            <p className="text-slate-400 text-sm mb-4">
              Every master has failed more times than the beginner has tried.
            </p>
            <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
              <p className="text-violet-400 text-xs font-bold uppercase mb-2">Your Recovery Plan</p>
              <ul className="text-left text-sm text-slate-300 space-y-2">
                <li>✓ Day 1-7: Build the habit back</li>
                <li>✓ Day 7-14: Brain starts healing</li>
                <li>✓ Day 14-30: Energy returns</li>
                <li>✓ Day 30-90: Full rewire</li>
              </ul>
            </div>
            <button 
              onClick={() => setActiveMode('none')}
              className="px-6 py-3 bg-violet-500 text-white rounded-xl font-bold"
            >
              I'm Back. Day 1.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>}
  </div>
);

const ExamItem = ({ exam, onAddMaterial, onDeleteMaterial, accent }: { 
  exam: Exam, 
  onAddMaterial: (id: string, title: string, url: string) => void, 
  onDeleteMaterial: (examId: string, matId: string) => void,
  accent: string 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h5 className="font-bold text-slate-900 dark:text-white leading-tight">{exam.subject}</h5>
          <p className="text-[9px] text-slate-500 uppercase font-black mt-0.5">{exam.type} • {exam.date}</p>
        </div>
        <div className={`px-2 py-1 rounded-lg bg-${accent}-500/10 text-${accent}-600 text-[9px] font-black whitespace-nowrap`}>
          T-{daysLeft} DAYS
        </div>
      </div>
      
      <div className="space-y-1.5 mb-3">
        {exam.studyMaterials && exam.studyMaterials.length > 0 ? (
          exam.studyMaterials.map(mat => (
            <div key={mat.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg group border border-slate-100 dark:border-slate-800/50">
              <a href={mat.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 hover:text-blue-500 truncate transition-colors">
                <ExternalLink size={10} /> {mat.title}
              </a>
              <button onClick={() => onDeleteMaterial(exam.id, mat.id)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-all">
                <Trash2 size={10} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-[10px] text-slate-400 italic text-center py-2">No resources logged.</p>
        )}
      </div>

      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1.5 transition-all">
          <Plus size={10} /> ADD STUDY RESOURCE
        </button>
      ) : (
        <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
          <input className="w-full text-[11px] p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none" placeholder="Resource Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <input className="w-full text-[11px] p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none" placeholder="Link URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={() => { if (newTitle) onAddMaterial(exam.id, newTitle, newUrl); setNewTitle(''); setNewUrl(''); setShowAdd(false); }} className={`flex-1 py-1.5 bg-${accent}-500 text-white rounded-lg text-[10px] font-bold`}>SAVE</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold">CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Specialized Tab Components ---
interface TabProps {
  data: AppData;
  actions: any;
}

const PhysicalTab = ({ data, actions }: TabProps) => {
  const accent = data.settings.accentColor || 'teal';
  const [activeSection, setActiveSection] = useState<string | null>('protocol');
  const currentHour = new Date().getHours();
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's protocol
  const todayProtocol = data.protocols.find(p => p.date === today);
  const morningTasks = todayProtocol?.morningTasks || [];
  const nightTasks = todayProtocol?.nightTasks || [];
  const morningDone = morningTasks.filter(t => t.completed).length;
  const nightDone = nightTasks.filter(t => t.completed).length;
  
  const todayWorkouts = data.workouts.filter(w => w.date.split('T')[0] === today).length;

  const Section = ({ id, title, icon: Icon, color, stat, children }: any) => (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button 
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className={`w-full flex items-center justify-between p-4 transition-all ${activeSection === id ? `bg-${color}-500/10` : 'bg-white dark:bg-slate-900'}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={`text-${color}-500`}/>
          <span className="font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {stat && <span className={`text-sm font-black text-${color}-500`}>{stat}</span>}
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === id ? 'rotate-180' : ''}`}/>
        </div>
      </button>
      {activeSection === id && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Quick Stats Row */}
      <div className="flex gap-3 mb-2">
        <div className="flex-1 bg-violet-500/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-violet-500">{data.discipline.noFapStreak}</p>
          <p className="text-[9px] text-slate-400">Clean Days</p>
        </div>
        <div className="flex-1 bg-blue-500/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-500">{todayWorkouts}</p>
          <p className="text-[9px] text-slate-400">Workouts Today</p>
        </div>
        <div className="flex-1 bg-cyan-500/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-cyan-500">{data.physical.hangingMinutes || 0}</p>
          <p className="text-[9px] text-slate-400">Hang Min</p>
        </div>
      </div>

      {/* Protocol Section */}
      <Section 
        id="protocol" 
        title={currentHour < 14 ? "Morning Protocol" : "Night Protocol"} 
        icon={currentHour < 14 ? Sunrise : Moon} 
        color={currentHour < 14 ? "orange" : "violet"}
        stat={currentHour < 14 ? `${morningDone}/${morningTasks.length}` : `${nightDone}/${nightTasks.length}`}
      >
        <ProtocolWidget data={data} actions={actions} accent={accent} />
      </Section>

      {/* Workout Logger */}
      <Section id="workout" title="Log Workout" icon={Dumbbell} color="blue" stat={`${todayWorkouts} today`}>
        <WorkoutLogger data={data} actions={actions} accent={accent} />
      </Section>

      {/* NoFap */}
      <Section id="nofap" title="NoFap Tracker" icon={Shield} color="rose" stat={`${data.discipline.noFapStreak}d`}>
        <NoFapTracker data={data} actions={actions} accent={accent} />
      </Section>

      {/* Body Stats - Simple */}
      <Section id="stats" title="Body Stats" icon={Activity} color="emerald">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'weight', label: 'Weight', val: data.physical.weight, unit: 'kg' },
            { id: 'height', label: 'Height', val: data.physical.height || data.user.height, unit: 'cm' },
            { id: 'waterIntake', label: 'Water', val: data.physical.waterIntake, unit: 'gl' },
            { id: 'sleepHours', label: 'Sleep', val: data.physical.sleepHours, unit: 'h' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg">
              <div>
                <p className="text-[9px] text-slate-400">{item.label}</p>
                <p className="font-bold">{item.val} <span className="text-[9px] text-slate-400">{item.unit}</span></p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => actions.updatePhysicalStat(item.id as any, Math.max(0, item.val - 1))} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded"><Minus size={10}/></button>
                <button onClick={() => actions.updatePhysicalStat(item.id as any, item.val + 1)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded"><Plus size={10}/></button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Cold Shower Quick Action */}
      <button 
        onClick={() => actions.incrementColdShower()}
        className="w-full flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Snowflake size={20} className="text-cyan-500"/>
          <div>
            <p className="font-bold text-left">Cold Shower</p>
            <p className="text-[10px] text-slate-400">{data.discipline.coldShowers} total this week</p>
          </div>
        </div>
        <span className="text-sm font-black text-cyan-500">+25 XP</span>
      </button>
    </div>
  );
};

// --- MIND TAB (Simplified) ---
const MindTab = ({ data, actions }: TabProps) => {
  const accent = data.settings.accentColor || 'teal';
  const [activeSection, setActiveSection] = useState<string | null>('pomodoro');
  const today = new Date().toISOString().split('T')[0];
  
  const todaySessions = data.pomodoroSessions.filter(s => s.completedAt.split('T')[0] === today).length;
  const todayCheckIn = data.checkIns.find(c => c.date === today);
  
  // Calculate focus streak (consecutive days with at least one session)
  const calculateFocusStreak = () => {
    let streak = 0;
    const checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasSession = data.pomodoroSessions.some(s => s.completedAt.split('T')[0] === dateStr);
      
      if (hasSession) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today and no session yet, check yesterday
        if (streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          const hadYesterday = data.pomodoroSessions.some(s => s.completedAt.split('T')[0] === yesterdayStr);
          if (hadYesterday) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }
    return streak;
  };
  const focusStreak = calculateFocusStreak();
  
  // Get nearest exam
  const nearestExam = data.exams.reduce((nearest, exam) => {
    const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0 && (!nearest || daysLeft < nearest.daysLeft)) {
      return { exam, daysLeft };
    }
    return nearest;
  }, null as { exam: Exam; daysLeft: number } | null);

  const Section = ({ id, title, icon: Icon, color, stat, children }: any) => (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button 
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className={`w-full flex items-center justify-between p-4 transition-all ${activeSection === id ? `bg-${color}-500/10` : 'bg-white dark:bg-slate-900'}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={`text-${color}-500`}/>
          <span className="font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {stat && <span className={`text-sm font-black text-${color}-500`}>{stat}</span>}
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeSection === id ? 'rotate-180' : ''}`}/>
        </div>
      </button>
      {activeSection === id && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Quick Stats Row */}
      <div className="flex gap-3 mb-2">
        <div className="flex-1 bg-blue-500/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-500">{todaySessions}</p>
          <p className="text-[9px] text-slate-400">Focus Today</p>
        </div>
        <div className="flex-1 bg-orange-500/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-orange-500">{focusStreak}</p>
          <p className="text-[9px] text-slate-400">Focus Streak</p>
        </div>
        <div className="flex-1 bg-amber-500/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-amber-500">{todayCheckIn?.morning.completed ? '✓' : '○'}</p>
          <p className="text-[9px] text-slate-400">Check-in</p>
        </div>
        {nearestExam && (
          <div className={`flex-1 ${nearestExam.daysLeft <= 7 ? 'bg-rose-500/10' : 'bg-emerald-500/10'} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-black ${nearestExam.daysLeft <= 7 ? 'text-rose-500' : 'text-emerald-500'}`}>{nearestExam.daysLeft}</p>
            <p className="text-[9px] text-slate-400">Days to Exam</p>
          </div>
        )}
      </div>

      {/* Pomodoro Section */}
      <Section id="pomodoro" title="Focus Timer" icon={Timer} color="blue" stat={`${todaySessions} today`}>
        <PomodoroTimer data={data} actions={actions} accent={accent} />
      </Section>

      {/* Daily Check-in */}
      <Section id="checkin" title="Daily Check-in" icon={CalendarIcon} color="amber" stat={todayCheckIn?.morning.completed ? '✓' : ''}>
        <DailyCheckInWidget data={data} actions={actions} accent={accent} />
      </Section>

      {/* Study Topics */}
      <Section id="topics" title="Study Topics" icon={BookOpen} color="violet">
        <StudyTopicsWidget data={data} actions={actions} accent={accent} />
      </Section>

      {/* Exams */}
      {data.exams.length > 0 && (
        <Section id="exams" title="Exams" icon={GraduationCap} color="rose" stat={nearestExam ? `T-${nearestExam.daysLeft}d` : ''}>
          <div className="space-y-3">
            {data.exams.map(exam => <ExamItem key={exam.id} exam={exam} onAddMaterial={actions.addStudyMaterial} onDeleteMaterial={actions.deleteStudyMaterial} accent={accent} />)}
          </div>
        </Section>
      )}
    </div>
  );
};

// --- WORKOUT LOGGER COMPONENT ---
const WorkoutLogger = ({ data, actions, accent }: { data: AppData, actions: any, accent: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [workoutType, setWorkoutType] = useState<'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full' | 'cardio' | 'abs'>('push');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: 3, reps: 10, weight: 0 });

  const muscleGroupMap: Record<string, MuscleGroup> = {
    push: 'chest', pull: 'back', legs: 'legs', upper: 'shoulders', lower: 'legs', full: 'chest', cardio: 'cardio', abs: 'abs'
  };

  const quickExercises: Record<string, string[]> = {
    push: ['Pushups', 'Bench Press', 'Incline Press', 'Dips', 'Shoulder Press', 'Tricep Extensions'],
    pull: ['Pullups', 'Rows', 'Lat Pulldown', 'Bicep Curls', 'Face Pulls', 'Deadlifts'],
    legs: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises', 'Leg Curls', 'Hip Thrusts'],
    abs: ['Crunches', 'Planks', 'Leg Raises', 'Russian Twists', 'Mountain Climbers', 'Bicycle Crunches'],
    cardio: ['Running', 'Jump Rope', 'Cycling', 'Burpees', 'High Knees', 'Jumping Jacks'],
    upper: ['Pushups', 'Pullups', 'Shoulder Press', 'Rows', 'Dips', 'Curls'],
    lower: ['Squats', 'Deadlifts', 'Lunges', 'Calf Raises', 'Leg Press', 'Hip Thrusts'],
    full: ['Burpees', 'Thrusters', 'Clean & Press', 'Turkish Getups', 'Pushups', 'Squats']
  };

  const todayWorkouts = data.workouts.filter(w => w.date.split('T')[0] === new Date().toISOString().split('T')[0]);
  const totalExercisesToday = todayWorkouts.reduce((acc, w) => acc + w.exercises.length, 0);
  const thisWeekWorkouts = data.workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return workoutDate >= weekAgo;
  });

  const addExercise = (name: string) => {
    const newEx: Exercise = {
      id: Math.random().toString(),
      name,
      muscleGroup: muscleGroupMap[workoutType],
      sets: currentExercise.sets,
      reps: currentExercise.reps,
      weight: currentExercise.weight
    };
    setExercises([...exercises, newEx]);
  };

  const saveWorkout = () => {
    if (exercises.length === 0) return;
    const workout: WorkoutSession = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      exercises,
      duration: exercises.length * 5, // Estimate 5 min per exercise
      type: workoutType
    };
    actions.logWorkout(workout);
    actions.addXP(exercises.length * 10, `Workout: ${workoutType.toUpperCase()}`);
    setExercises([]);
    setIsExpanded(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1">
            <Dumbbell size={12}/> Workout Logger
          </h4>
          <p className="text-xs text-slate-500 mt-1">Log your gains, track progress</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-blue-500">{thisWeekWorkouts.length}</p>
          <p className="text-[9px] text-slate-400">this week</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/50 dark:bg-slate-950/30 p-2 rounded-xl text-center">
          <p className="text-lg font-black text-slate-900 dark:text-white">{totalExercisesToday}</p>
          <p className="text-[8px] text-slate-400 uppercase">Today</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-950/30 p-2 rounded-xl text-center">
          <p className="text-lg font-black text-emerald-500">{data.workouts.length}</p>
          <p className="text-[8px] text-slate-400 uppercase">Total</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-950/30 p-2 rounded-xl text-center">
          <p className="text-lg font-black text-violet-500">{data.physical.pbs?.pushups || 0}</p>
          <p className="text-[8px] text-slate-400 uppercase">Pushup PB</p>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${isExpanded ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : `bg-${accent}-500 text-white`}`}
      >
        {isExpanded ? <><ChevronUp size={16}/> Close Logger</> : <><Plus size={16}/> Log Workout</>}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Workout Type Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['push', 'pull', 'legs', 'abs', 'cardio'] as const).map(type => (
              <button
                key={type}
                onClick={() => setWorkoutType(type)}
                className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap ${workoutType === type ? `bg-${accent}-500 text-white` : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Quick Add Exercises */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 mb-2">Quick Add - {workoutType.toUpperCase()}</p>
            <div className="flex flex-wrap gap-2">
              {quickExercises[workoutType].map(ex => (
                <button
                  key={ex}
                  onClick={() => addExercise(ex)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold hover:border-blue-500 transition-all"
                >
                  + {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Sets/Reps/Weight Config */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-[8px] text-slate-400 uppercase text-center">Sets</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button onClick={() => setCurrentExercise({...currentExercise, sets: Math.max(1, currentExercise.sets - 1)})} className="p-1 bg-slate-100 dark:bg-slate-800 rounded"><Minus size={10}/></button>
                <span className="font-black">{currentExercise.sets}</span>
                <button onClick={() => setCurrentExercise({...currentExercise, sets: currentExercise.sets + 1})} className="p-1 bg-blue-500 text-white rounded"><Plus size={10}/></button>
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-[8px] text-slate-400 uppercase text-center">Reps</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button onClick={() => setCurrentExercise({...currentExercise, reps: Math.max(1, currentExercise.reps - 1)})} className="p-1 bg-slate-100 dark:bg-slate-800 rounded"><Minus size={10}/></button>
                <span className="font-black">{currentExercise.reps}</span>
                <button onClick={() => setCurrentExercise({...currentExercise, reps: currentExercise.reps + 1})} className="p-1 bg-blue-500 text-white rounded"><Plus size={10}/></button>
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-[8px] text-slate-400 uppercase text-center">kg</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button onClick={() => setCurrentExercise({...currentExercise, weight: Math.max(0, currentExercise.weight - 2.5)})} className="p-1 bg-slate-100 dark:bg-slate-800 rounded"><Minus size={10}/></button>
                <span className="font-black text-sm">{currentExercise.weight}</span>
                <button onClick={() => setCurrentExercise({...currentExercise, weight: currentExercise.weight + 2.5})} className="p-1 bg-blue-500 text-white rounded"><Plus size={10}/></button>
              </div>
            </div>
          </div>

          {/* Current Workout */}
          {exercises.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-slate-400">Current Workout ({exercises.length} exercises)</p>
              {exercises.map((ex, i) => (
                <div key={ex.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-[10px] font-bold">{ex.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400">{ex.sets}x{ex.reps} @ {ex.weight}kg</span>
                    <button onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><Trash2 size={10}/></button>
                  </div>
                </div>
              ))}
              <button 
                onClick={saveWorkout}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16}/> Save Workout (+{exercises.length * 10} XP)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MORNING/NIGHT PROTOCOL WIDGET ---
const ProtocolWidget = ({ data, actions, accent }: { data: AppData, actions: any, accent: string }) => {
  const today = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();
  const [activeProtocol, setActiveProtocol] = useState<'morning' | 'night'>(currentHour < 14 ? 'morning' : 'night');
  
  // Default morning tasks (5:30am routine)
  const defaultMorningTasks: ProtocolTask[] = [
    { id: 'm1', name: 'Wake Up 5:30 AM', category: 'morning', completed: false, xp: 30, icon: 'alarm' },
    { id: 'm2', name: 'Cold Shower (2-5 min)', category: 'morning', completed: false, xp: 25, icon: 'snowflake' },
    { id: 'm3', name: 'Hydrate (500ml water)', category: 'morning', completed: false, xp: 10, icon: 'droplet' },
    { id: 'm4', name: 'Mewing & Face Exercises (10 min)', category: 'morning', completed: false, xp: 20, icon: 'face' },
    { id: 'm5', name: 'Hanging Exercises (10-20 min)', category: 'morning', completed: false, xp: 30, icon: 'stretch' },
    { id: 'm6', name: 'Quick Workout (15-30 min)', category: 'morning', completed: false, xp: 40, icon: 'dumbbell' },
    { id: 'm7', name: 'Healthy Breakfast', category: 'morning', completed: false, xp: 15, icon: 'food' },
    { id: 'm8', name: 'Apply Sunscreen', category: 'morning', completed: false, xp: 10, icon: 'sun' },
  ];

  // Default night tasks (before 10pm)
  const defaultNightTasks: ProtocolTask[] = [
    { id: 'n1', name: 'No Screens After 9:30 PM', category: 'night', completed: false, xp: 25, icon: 'screen' },
    { id: 'n2', name: 'Skincare Routine', category: 'night', completed: false, xp: 15, icon: 'face' },
    { id: 'n3', name: 'Stretching (10 min)', category: 'night', completed: false, xp: 20, icon: 'stretch' },
    { id: 'n4', name: 'Read Book (15 min)', category: 'night', completed: false, xp: 20, icon: 'book' },
    { id: 'n5', name: 'Gratitude/Journaling', category: 'night', completed: false, xp: 15, icon: 'journal' },
    { id: 'n6', name: 'Tomorrow Planning', category: 'night', completed: false, xp: 15, icon: 'plan' },
    { id: 'n7', name: 'In Bed by 10:00 PM', category: 'night', completed: false, xp: 30, icon: 'bed' },
  ];

  // Get or create today's protocol
  const todayProtocol = data.protocols.find(p => p.date === today) || {
    date: today,
    morningTasks: defaultMorningTasks,
    nightTasks: defaultNightTasks,
    morningScore: 0,
    nightScore: 0
  };

  const tasks = activeProtocol === 'morning' ? todayProtocol.morningTasks : todayProtocol.nightTasks;
  const completedCount = tasks.filter(t => t.completed).length;
  const totalXP = tasks.filter(t => t.completed).reduce((acc, t) => acc + t.xp, 0);
  const maxXP = tasks.reduce((acc, t) => acc + t.xp, 0);

  const toggleTask = (taskId: string) => {
    const updatedProtocol = { ...todayProtocol };
    if (activeProtocol === 'morning') {
      updatedProtocol.morningTasks = todayProtocol.morningTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      updatedProtocol.morningScore = updatedProtocol.morningTasks.filter(t => t.completed).reduce((a, t) => a + t.xp, 0);
    } else {
      updatedProtocol.nightTasks = todayProtocol.nightTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      updatedProtocol.nightScore = updatedProtocol.nightTasks.filter(t => t.completed).reduce((a, t) => a + t.xp, 0);
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      actions.addXP(task.xp, `Protocol: ${task.name}`);
    }
    
    actions.saveProtocol(updatedProtocol);
  };

  const getIconForTask = (icon?: string) => {
    switch(icon) {
      case 'alarm': return Clock;
      case 'snowflake': return Snowflake;
      case 'droplet': return Droplets;
      case 'face': return ScanFace;
      case 'stretch': return Ruler;
      case 'dumbbell': return Dumbbell;
      case 'food': return Utensils;
      case 'sun': return Sun;
      case 'screen': return Eye;
      case 'book': return BookOpen;
      case 'journal': return BookOpen;
      case 'plan': return Target;
      case 'bed': return Moon;
      default: return CheckCircle2;
    }
  };

  // Calculate streak
  const protocolStreak = data.protocols.filter(p => {
    const morningComplete = p.morningTasks.filter(t => t.completed).length >= p.morningTasks.length * 0.8;
    const nightComplete = p.nightTasks.filter(t => t.completed).length >= p.nightTasks.length * 0.8;
    return morningComplete && nightComplete;
  }).length;

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1">
            {activeProtocol === 'morning' ? <Sunrise size={12}/> : <MoonIcon size={12}/>}
            {activeProtocol === 'morning' ? 'Morning Protocol' : 'Night Protocol'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {activeProtocol === 'morning' ? '5:30 AM Power Routine' : 'Before 10 PM Wind-down'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 uppercase">Streak</p>
          <p className="text-sm font-black text-indigo-500">{protocolStreak} days</p>
        </div>
      </div>

      {/* Protocol Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveProtocol('morning')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${activeProtocol === 'morning' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
        >
          <Sunrise size={12}/> Morning
        </button>
        <button
          onClick={() => setActiveProtocol('night')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${activeProtocol === 'night' ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
        >
          <MoonIcon size={12}/> Night
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-slate-400">{completedCount}/{tasks.length} Complete</span>
          <span className="text-[9px] font-bold text-indigo-500">{totalXP}/{maxXP} XP</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${activeProtocol === 'morning' ? 'bg-orange-500' : 'bg-violet-500'}`}
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map(task => {
          const IconComponent = getIconForTask(task.icon);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                task.completed 
                  ? 'bg-emerald-500/10 border border-emerald-500/30' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${task.completed ? 'bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <IconComponent size={14} className={task.completed ? 'text-emerald-500' : 'text-slate-400'} />
                </div>
                <span className={`text-[11px] font-bold ${task.completed ? 'text-emerald-600 dark:text-emerald-400 line-through' : ''}`}>
                  {task.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black ${task.completed ? 'text-emerald-500' : 'text-slate-400'}`}>
                  +{task.xp} XP
                </span>
                {task.completed && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === tasks.length && (
        <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl text-center animate-in fade-in">
          <p className="text-sm font-bold text-emerald-500">
            🎉 {activeProtocol === 'morning' ? 'Morning' : 'Night'} Protocol Complete!
          </p>
          <p className="text-[9px] text-slate-400">+{totalXP} XP earned</p>
        </div>
      )}
    </div>
  );
};

// --- STUDY TOPICS WIDGET ---
const StudyTopicsWidget = ({ data, actions, accent }: { data: AppData, actions: any, accent: string }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(data.studySubjects[0]?.id || '');
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  
  const subject = data.studySubjects.find(s => s.id === selectedSubject);
  
  // Calculate progress stats
  const getSubjectProgress = (sub: StudySubject) => {
    let totalTopics = 0;
    let completedTopics = 0;
    let weakTopics = 0;
    
    sub.chapters.forEach(ch => {
      ch.topics.forEach(t => {
        totalTopics++;
        if (t.completed) completedTopics++;
        if (t.isWeak) weakTopics++;
      });
    });
    
    return { total: totalTopics, completed: completedTopics, weak: weakTopics, percent: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0 };
  };

  const toggleTopic = (subjectId: string, chapterId: string, topicId: string) => {
    actions.toggleStudyTopic(subjectId, chapterId, topicId);
  };

  const markRevision = (subjectId: string, chapterId: string, topicId: string) => {
    actions.markTopicRevision(subjectId, chapterId, topicId);
  };

  const toggleWeak = (subjectId: string, chapterId: string, topicId: string) => {
    actions.toggleWeakTopic(subjectId, chapterId, topicId);
  };

  const getDaysToExam = (examDate?: string) => {
    if (!examDate) return null;
    return Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRevisionLabel = (rev: number) => {
    switch(rev) {
      case 0: return 'Not Started';
      case 1: return '1st Revision';
      case 2: return '2nd Revision';
      case 3: return '3rd Revision ✓';
      default: return '';
    }
  };

  const getRevisionColor = (rev: number) => {
    switch(rev) {
      case 0: return 'slate';
      case 1: return 'orange';
      case 2: return 'blue';
      case 3: return 'emerald';
      default: return 'slate';
    }
  };

  if (!subject) return null;

  const progress = getSubjectProgress(subject);
  const daysLeft = getDaysToExam(subject.examDate);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className={`text-${subject.color}-500`}/> Study Topics
          </h4>
          <p className="text-[10px] text-slate-500">Track chapters, topics & revisions</p>
        </div>
        {daysLeft !== null && (
          <div className={`px-2 py-1 rounded-lg bg-${daysLeft < 7 ? 'rose' : daysLeft < 14 ? 'orange' : 'emerald'}-500/10 text-${daysLeft < 7 ? 'rose' : daysLeft < 14 ? 'orange' : 'emerald'}-500 text-[9px] font-black`}>
            T-{daysLeft} DAYS
          </div>
        )}
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {data.studySubjects.map(sub => {
          const p = getSubjectProgress(sub);
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                selectedSubject === sub.id 
                  ? `bg-${sub.color}-500 text-white` 
                  : `bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200`
              }`}
            >
              {sub.name}
              <span className={`ml-1 ${selectedSubject === sub.id ? 'text-white/70' : 'text-slate-400'}`}>
                {p.percent}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-slate-400">
            {progress.completed}/{progress.total} topics • {progress.weak} weak
          </span>
          <span className={`text-[9px] font-bold text-${subject.color}-500`}>{progress.percent}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-${subject.color}-500 transition-all`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Chapters & Topics */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {subject.chapters.map(chapter => {
          const chapterCompleted = chapter.topics.filter(t => t.completed).length;
          const chapterTotal = chapter.topics.length;
          const isExpanded = expandedChapter === chapter.id;
          
          return (
            <div key={chapter.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-2">
                  {chapterCompleted === chapterTotal && chapterTotal > 0 ? (
                    <CheckCircle2 size={14} className="text-emerald-500"/>
                  ) : (
                    <CircleDot size={14} className="text-slate-400"/>
                  )}
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{chapter.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400">{chapterCompleted}/{chapterTotal}</span>
                  {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-2 space-y-1.5 border-t border-slate-200 dark:border-slate-700">
                  {chapter.topics.map(topic => (
                    <div 
                      key={topic.id} 
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        topic.completed ? 'bg-emerald-500/10' : topic.isWeak ? 'bg-rose-500/10' : 'bg-slate-50 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          onClick={() => toggleTopic(subject.id, chapter.id, topic.id)}
                          className="p-0.5"
                        >
                          {topic.completed ? (
                            <CheckSquare size={14} className="text-emerald-500"/>
                          ) : (
                            <Square size={14} className="text-slate-400"/>
                          )}
                        </button>
                        <span className={`text-[10px] font-bold ${topic.completed ? 'text-emerald-600 dark:text-emerald-400 line-through' : ''}`}>
                          {topic.name}
                        </span>
                        {topic.isWeak && (
                          <span className="px-1 py-0.5 bg-rose-500/20 text-rose-500 text-[8px] font-bold rounded">WEAK</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => markRevision(subject.id, chapter.id, topic.id)}
                          disabled={!topic.completed}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            topic.completed 
                              ? `bg-${getRevisionColor(topic.revision)}-500/10 text-${getRevisionColor(topic.revision)}-500 hover:bg-${getRevisionColor(topic.revision)}-500/20` 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          R{topic.revision}
                        </button>
                        <button
                          onClick={() => toggleWeak(subject.id, chapter.id, topic.id)}
                          className={`p-1 rounded ${topic.isWeak ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                        >
                          <AlertTriangle size={10}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <p className="text-lg font-black text-emerald-500">{progress.completed}</p>
          <p className="text-[8px] text-slate-400 uppercase">Done</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-slate-500">{progress.total - progress.completed}</p>
          <p className="text-[8px] text-slate-400 uppercase">Remaining</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-rose-500">{progress.weak}</p>
          <p className="text-[8px] text-slate-400 uppercase">Weak Areas</p>
        </div>
      </div>
    </div>
  );
};

const IntelligenceSection = ({ data, actions }: TabProps) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
    <SectionHeader title="Intel Protocols" subtitle="Preparation & Knowledge" />
    {/* Daily Check-in Widget */}
    <DailyCheckInWidget data={data} actions={actions} accent={data.settings.accentColor || 'teal'} />
    {/* Study Topics Tracker */}
    <StudyTopicsWidget data={data} actions={actions} accent={data.settings.accentColor || 'teal'} />
    <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><GraduationCap size={16} /> Exam Countdown</h4>
        {data.exams.map(exam => <ExamItem key={exam.id} exam={exam} onAddMaterial={actions.addStudyMaterial} onDeleteMaterial={actions.deleteStudyMaterial} accent={data.settings.accentColor || 'teal'} />)}
    </div>
  </div>
);

// --- DAILY CHECK-IN WIDGET ---
const DailyCheckInWidget = ({ data, actions, accent }: { data: AppData, actions: any, accent: string }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayCheckIn = data.checkIns.find(c => c.date === today);
  const [showMorning, setShowMorning] = useState(false);
  const [showEvening, setShowEvening] = useState(false);
  
  // Morning check-in state
  const [goals, setGoals] = useState<string[]>(['', '', '']);
  const [mood, setMood] = useState<1|2|3|4|5>(3);
  const [affirmation, setAffirmation] = useState('');
  
  // Evening check-in state
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [wins, setWins] = useState<string[]>(['']);
  const [lessons, setLessons] = useState('');
  const [gratitude, setGratitude] = useState<string[]>(['', '', '']);
  const [rating, setRating] = useState<1|2|3|4|5>(3);

  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isEvening = currentHour >= 17 || currentHour < 5;

  const affirmations = [
    "I am unstoppable. I am becoming the best version of myself.",
    "Today I will conquer my procrastination and take massive action.",
    "I have the power to create change. My discipline defines my destiny.",
    "I am focused, driven, and committed to my goals.",
    "Every cell in my body is working to help me succeed."
  ];

  const completeMorningCheckIn = () => {
    const validGoals = goals.filter(g => g.trim() !== '');
    if (validGoals.length === 0) return;
    
    const checkIn: DailyCheckIn = {
      id: Math.random().toString(),
      date: today,
      morning: {
        completed: true,
        time: new Date().toISOString(),
        goals: validGoals,
        mood,
        affirmation: affirmation || affirmations[Math.floor(Math.random() * affirmations.length)]
      },
      evening: {
        completed: false,
        time: '',
        goalsCompleted: 0,
        wins: [],
        lessons: '',
        gratitude: [],
        rating: 3
      }
    };
    
    actions.saveCheckIn(checkIn);
    actions.addXP(50, 'Morning Check-in Complete');
    setShowMorning(false);
  };

  const completeEveningCheckIn = () => {
    if (!todayCheckIn) return;
    
    const updatedCheckIn: DailyCheckIn = {
      ...todayCheckIn,
      evening: {
        completed: true,
        time: new Date().toISOString(),
        goalsCompleted,
        wins: wins.filter(w => w.trim() !== ''),
        lessons,
        gratitude: gratitude.filter(g => g.trim() !== ''),
        rating
      }
    };
    
    actions.saveCheckIn(updatedCheckIn);
    actions.addXP(50, 'Evening Check-in Complete');
    if (goalsCompleted >= todayCheckIn.morning.goals.length) {
      actions.addXP(100, 'All Daily Goals Completed!');
    }
    setShowEvening(false);
  };

  const moodIcons = [
    { icon: Frown, label: 'Terrible', color: 'red' },
    { icon: Meh, label: 'Low', color: 'orange' },
    { icon: Smile, label: 'Okay', color: 'yellow' },
    { icon: Smile, label: 'Good', color: 'emerald' },
    { icon: Star, label: 'Amazing', color: 'cyan' }
  ];

  // Check-in streak
  const checkInStreak = data.checkIns.filter(c => c.morning.completed && c.evening.completed).length;

  return (
    <div className={`bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
            <CalendarIcon size={12}/> Daily Check-in
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {isMorning ? '🌅 Set your intentions' : isEvening ? '🌙 Reflect on your day' : '☀️ Midday momentum'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 uppercase">Streak</p>
          <p className="text-sm font-black text-amber-500">{checkInStreak} days</p>
        </div>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`p-3 rounded-xl ${todayCheckIn?.morning.completed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/50 dark:bg-slate-950/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sunrise size={14} className={todayCheckIn?.morning.completed ? 'text-emerald-500' : 'text-slate-400'} />
            <span className="text-[9px] font-black uppercase">Morning</span>
          </div>
          {todayCheckIn?.morning.completed ? (
            <div>
              <p className="text-[9px] text-emerald-500 font-bold">✓ Completed</p>
              <p className="text-[8px] text-slate-400">{todayCheckIn.morning.goals.length} goals set</p>
            </div>
          ) : (
            <p className="text-[9px] text-slate-400">Not done yet</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${todayCheckIn?.evening.completed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/50 dark:bg-slate-950/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sunset size={14} className={todayCheckIn?.evening.completed ? 'text-emerald-500' : 'text-slate-400'} />
            <span className="text-[9px] font-black uppercase">Evening</span>
          </div>
          {todayCheckIn?.evening.completed ? (
            <div>
              <p className="text-[9px] text-emerald-500 font-bold">✓ Completed</p>
              <p className="text-[8px] text-slate-400">Rated: {todayCheckIn.evening.rating}/5</p>
            </div>
          ) : (
            <p className="text-[9px] text-slate-400">{todayCheckIn?.morning.completed ? 'Ready for review' : 'Complete morning first'}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!todayCheckIn?.morning.completed && (
          <button 
            onClick={() => setShowMorning(!showMorning)}
            className={`w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2`}
          >
            <Sunrise size={16}/> {showMorning ? 'Close' : 'Start Morning Check-in (+50 XP)'}
          </button>
        )}
        
        {todayCheckIn?.morning.completed && !todayCheckIn?.evening.completed && (
          <button 
            onClick={() => setShowEvening(!showEvening)}
            className={`w-full py-3 bg-violet-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2`}
          >
            <Sunset size={16}/> {showEvening ? 'Close' : 'Start Evening Review (+50 XP)'}
          </button>
        )}
      </div>

      {/* Morning Check-in Form */}
      {showMorning && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">🎯 Top 3 Goals for Today (be specific!)</p>
            {goals.map((g, i) => (
              <input
                key={i}
                value={g}
                onChange={(e) => {
                  const newGoals = [...goals];
                  newGoals[i] = e.target.value;
                  setGoals(newGoals);
                }}
                placeholder={`Goal ${i + 1}: e.g., "Complete 3 Pomodoro sessions on Economics"`}
                className="w-full p-2 mb-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">😊 How are you feeling right now?</p>
            <div className="flex gap-2 justify-center">
              {moodIcons.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood((i + 1) as 1|2|3|4|5)}
                  className={`p-2 rounded-lg transition-all ${mood === i + 1 ? `bg-${m.color}-500/20 border-2 border-${m.color}-500` : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <m.icon size={20} className={mood === i + 1 ? `text-${m.color}-500` : 'text-slate-400'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">💪 Today's Affirmation</p>
            <textarea
              value={affirmation}
              onChange={(e) => setAffirmation(e.target.value)}
              placeholder="Write your own or leave blank for a random one..."
              className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs h-16 resize-none"
            />
          </div>

          <button 
            onClick={completeMorningCheckIn}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16}/> Complete Morning Check-in
          </button>
        </div>
      )}

      {/* Evening Check-in Form */}
      {showEvening && todayCheckIn && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">✅ Goals Completed ({todayCheckIn.morning.goals.length} set this morning)</p>
            <div className="space-y-1 mb-2">
              {todayCheckIn.morning.goals.map((g, i) => (
                <div key={i} className="text-[10px] p-2 bg-white/50 dark:bg-slate-950/30 rounded flex items-center gap-2">
                  <span className="text-slate-400">{i + 1}.</span> {g}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold">Completed:</span>
              <select 
                value={goalsCompleted} 
                onChange={(e) => setGoalsCompleted(Number(e.target.value))}
                className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                {[...Array(todayCheckIn.morning.goals.length + 1)].map((_, i) => (
                  <option key={i} value={i}>{i} / {todayCheckIn.morning.goals.length}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">🏆 Today's Wins (what went well?)</p>
            {wins.map((w, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  value={w}
                  onChange={(e) => {
                    const newWins = [...wins];
                    newWins[i] = e.target.value;
                    setWins(newWins);
                  }}
                  placeholder={`Win ${i + 1}`}
                  className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
                {i === wins.length - 1 && wins.length < 3 && (
                  <button onClick={() => setWins([...wins, ''])} className="p-2 bg-slate-100 dark:bg-slate-800 rounded"><Plus size={12}/></button>
                )}
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">📝 What could improve tomorrow?</p>
            <textarea
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              placeholder="What will you do differently?"
              className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs h-16 resize-none"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">🙏 3 Things I'm Grateful For</p>
            {gratitude.map((g, i) => (
              <input
                key={i}
                value={g}
                onChange={(e) => {
                  const newGrat = [...gratitude];
                  newGrat[i] = e.target.value;
                  setGratitude(newGrat);
                }}
                placeholder={`Gratitude ${i + 1}`}
                className="w-full p-2 mb-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2">⭐ Rate Your Day</p>
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r as 1|2|3|4|5)}
                  className={`p-3 rounded-lg transition-all ${rating === r ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <span className="text-lg font-black">{r}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={completeEveningCheckIn}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16}/> Complete Evening Review {goalsCompleted >= todayCheckIn.morning.goals.length ? '(+150 XP!)' : '(+50 XP)'}
          </button>
        </div>
      )}

      {/* Today's Affirmation (if morning completed) */}
      {todayCheckIn?.morning.completed && !showEvening && (
        <div className="mt-3 p-3 bg-amber-500/10 rounded-xl">
          <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Today's Affirmation</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{todayCheckIn.morning.affirmation}"</p>
        </div>
      )}
    </div>
  );
};

// --- POMODORO TIMER COMPONENT ---
const PomodoroTimer = ({ data, actions, accent }: { data: AppData, actions: any, accent: string }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionType, setSessionType] = useState<'study' | 'work' | 'skill'>('study');
  const [subject, setSubject] = useState('Economics');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session complete
      if (!isBreak) {
        actions.addXP(50, `Pomodoro: ${subject}`);
        actions.logPomodoroSession(subject, 25, sessionType);
      }
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const subjects = ['Economics', 'Political Science', 'History', 'Legal Reasoning', 'English', 'Hindi'];

  return (
    <div className={`bg-gradient-to-br ${isBreak ? 'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20' : `from-${accent}-500/10 to-indigo-500/10 border-${accent}-500/20`} border rounded-2xl p-5 mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className={`text-[10px] font-black uppercase ${isBreak ? 'text-emerald-500' : `text-${accent}-500`}`}>
            {isBreak ? '☕ Break Time' : '🎯 Focus Session'}
          </h4>
          <p className="text-xs text-slate-500">{isBreak ? 'Rest your eyes, stretch!' : subject}</p>
        </div>
        <Timer size={20} className={isBreak ? 'text-emerald-500' : `text-${accent}-500`} />
      </div>
      
      <div className="text-center mb-4">
        <div className={`text-5xl font-black ${isBreak ? 'text-emerald-500' : `text-${accent}-500`}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isBreak ? 'bg-emerald-500' : `bg-${accent}-500`}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {!isRunning && !isBreak && (
        <select 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mb-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
        >
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      <div className="flex gap-2">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${isBreak ? 'bg-emerald-500' : `bg-${accent}-500`}`}
        >
          {isRunning ? <><Pause size={16}/> Pause</> : <><Play size={16}/> {isBreak ? 'Start Break' : 'Start Focus'}</>}
        </button>
        <button 
          onClick={() => { setTimeLeft(isBreak ? 5 * 60 : 25 * 60); setIsRunning(false); }}
          className="px-4 py-3 bg-slate-200 dark:bg-slate-800 rounded-xl"
        >
          <RotateCcw size={16}/>
        </button>
      </div>

      <div className="mt-3 text-center text-[10px] text-slate-400">
        Today: {data.pomodoroSessions.filter(s => s.completedAt.split('T')[0] === new Date().toISOString().split('T')[0]).length} sessions completed
      </div>
    </div>
  );
};

// --- NOFAP TRACKER WIDGET ---
const NoFapTracker = ({ data, actions, accent }: { data: AppData, actions: any, accent: string }) => {
  const [showUrgeSurfing, setShowUrgeSurfing] = useState(false);
  const [urgeTimer, setUrgeTimer] = useState(0); // seconds remaining
  const [urgeTimerActive, setUrgeTimerActive] = useState(false);
  const streak = data.discipline.noFapStreak;
  const bestStreak = data.discipline.noFapBestStreak;
  const coldShowerStreak = data.discipline.coldShowerStreak || 0;

  // Urge Timer Effect
  useEffect(() => {
    if (urgeTimerActive && urgeTimer > 0) {
      const interval = setInterval(() => {
        setUrgeTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (urgeTimer === 0 && urgeTimerActive) {
      setUrgeTimerActive(false);
      actions.addXP(50, 'Urge Conquered! 💪');
    }
  }, [urgeTimer, urgeTimerActive]);

  const startUrgeTimer = (minutes: number) => {
    setUrgeTimer(minutes * 60);
    setUrgeTimerActive(true);
    setShowUrgeSurfing(false);
  };
  
  const getStreakMessage = () => {
    if (streak === 0) return { msg: "Day 0 - Start your journey!", color: 'slate' };
    if (streak < 7) return { msg: `${streak} days - Building foundation!`, color: 'orange' };
    if (streak < 14) return { msg: `${streak} days - Dopamine recovering!`, color: 'yellow' };
    if (streak < 30) return { msg: `${streak} days - Brain rewiring!`, color: 'emerald' };
    if (streak < 90) return { msg: `${streak} days - Superpower mode!`, color: 'cyan' };
    return { msg: `${streak} days - LEGENDARY!`, color: 'violet' };
  };
  
  const status = getStreakMessage();
  
  const benefits = [
    { days: 7, benefit: 'Increased energy & focus' },
    { days: 14, benefit: 'Better sleep quality' },
    { days: 30, benefit: 'Improved confidence' },
    { days: 60, benefit: 'Mental clarity boost' },
    { days: 90, benefit: 'Full brain rewire complete' },
  ];

  const urgeSurfingTasks = [
    { icon: Dumbbell, task: '20 Pushups NOW!', xp: 15 },
    { icon: Snowflake, task: '2-min Cold Shower', xp: 25 },
    { icon: Footprints, task: '10-min Walk Outside', xp: 20 },
    { icon: Wind, task: 'Deep Breathing (20 breaths)', xp: 10 },
    { icon: Phone, task: 'Call a friend/family', xp: 15 },
    { icon: BookOpen, task: 'Read 5 pages of a book', xp: 15 },
  ];

  const nextMilestone = benefits.find(b => b.days > streak) || benefits[benefits.length - 1];

  // If urge timer is active, show the countdown
  if (urgeTimerActive) {
    const minutes = Math.floor(urgeTimer / 60);
    const seconds = urgeTimer % 60;
    return (
      <div className="bg-gradient-to-br from-orange-500/20 to-rose-500/20 border-2 border-orange-500/50 rounded-2xl p-6 text-center">
        <p className="text-[10px] font-black text-orange-500 uppercase mb-2">🔥 URGE SURFING</p>
        <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </p>
        <p className="text-sm text-slate-500 mb-4">Breathe. This will pass.</p>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all"
            style={{ width: `${100 - (urgeTimer / 600) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-500">
          <div>😤 Breathe deep</div>
          <div>💪 Stay strong</div>
          <div>🧠 You control this</div>
        </div>
        <button 
          onClick={() => { setUrgeTimerActive(false); setUrgeTimer(0); }}
          className="mt-4 text-[10px] text-slate-400 underline"
        >
          Cancel Timer
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-2xl p-5`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
            <Shield size={12}/> Discipline Protocol
          </h4>
          <p className={`text-lg font-black text-${status.color}-500 mt-1`}>{status.msg}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 uppercase">Best Streak</p>
          <p className="text-sm font-black text-slate-600 dark:text-slate-300">{bestStreak} days</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-950/30 rounded-xl p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold text-slate-400">Progress to {nextMilestone.days} days</span>
          <span className="text-[9px] font-bold text-rose-500">{Math.min(100, Math.round((streak / nextMilestone.days) * 100))}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all"
            style={{ width: `${Math.min(100, (streak / nextMilestone.days) * 100)}%` }}
          />
        </div>
        <p className="text-[9px] text-slate-500 mt-2 text-center">🎯 {nextMilestone.benefit}</p>
      </div>

      {/* Cold Shower Streak */}
      <div className="flex items-center justify-between p-2 bg-cyan-500/10 rounded-xl mb-3">
        <div className="flex items-center gap-2">
          <Snowflake size={14} className="text-cyan-500"/>
          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">Cold Shower Streak</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-cyan-500">{coldShowerStreak}</span>
          <button 
            onClick={() => actions.incrementColdShower()}
            className="px-2 py-1 bg-cyan-500 text-white rounded text-[9px] font-bold"
          >
            +1
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button 
          onClick={() => actions.incrementNoFapStreak()}
          className={`py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1`}
        >
          <CheckCircle2 size={12}/> Day Complete
        </button>
        <button 
          onClick={() => actions.resetNoFapStreak()}
          className="py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black flex items-center justify-center gap-1"
        >
          <RotateCcw size={12}/> Reset (Relapse)
        </button>
      </div>

      {/* Urge Surfing Button */}
      <button 
        onClick={() => setShowUrgeSurfing(!showUrgeSurfing)}
        className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1"
      >
        <AlertTriangle size={12}/> {showUrgeSurfing ? 'Hide Options' : '🔥 URGE? TAP HERE NOW!'}
      </button>

      {/* Urge Surfing Options */}
      {showUrgeSurfing && (
        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2">
          {/* Quick Timer Options */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => startUrgeTimer(5)}
              className="py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center"
            >
              <p className="text-lg font-black text-orange-500">5</p>
              <p className="text-[8px] text-slate-400">minutes</p>
            </button>
            <button 
              onClick={() => startUrgeTimer(10)}
              className="py-3 bg-orange-500/20 border-2 border-orange-500/50 rounded-xl text-center"
            >
              <p className="text-lg font-black text-orange-500">10</p>
              <p className="text-[8px] text-slate-400">minutes</p>
            </button>
            <button 
              onClick={() => startUrgeTimer(15)}
              className="py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center"
            >
              <p className="text-lg font-black text-orange-500">15</p>
              <p className="text-[8px] text-slate-400">minutes</p>
            </button>
          </div>
          
          <p className="text-[9px] text-slate-500 text-center font-bold">Or do something NOW:</p>
          {urgeSurfingTasks.slice(0, 3).map((item, i) => (
            <button 
              key={i}
              onClick={() => {
                actions.addXP(item.xp, `Urge Conquered: ${item.task}`);
                setShowUrgeSurfing(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-all"
            >
              <div className="flex items-center gap-2">
                <item.icon size={14} className="text-orange-500"/>
                <span className="text-[10px] font-bold">{item.task}</span>
              </div>
              <span className="text-[9px] font-black text-emerald-500">+{item.xp} XP</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- SKILLS TAB COMPONENT ---
const SkillsTab = ({ data, actions }: TabProps) => {
  const accent = data.settings.accentColor || 'teal';
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Back button
  const BackButton = () => (
    <button onClick={() => actions.setActiveTab('settings')} className="flex items-center gap-1 text-sm text-slate-500 mb-4">
      <ChevronUp size={16} className="rotate-[-90deg]"/> Back
    </button>
  );
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('other');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  const categoryIcons: Record<SkillCategory, any> = {
    puzzles: Box,
    music: Guitar,
    games: Gamepad2,
    languages: Languages,
    technical: Code,
    sports: Trophy,
    other: Star
  };

  const categoryColors: Record<SkillCategory, string> = {
    puzzles: 'violet',
    music: 'rose',
    games: 'cyan',
    languages: 'emerald',
    technical: 'blue',
    sports: 'orange',
    other: 'slate'
  };

  const filteredSkills = selectedCategory === 'all' 
    ? data.skills 
    : data.skills.filter(s => s.category === selectedCategory);

  const totalHours = data.skills.reduce((acc, s) => acc + s.hoursLogged, 0);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'slate';
      case 'intermediate': return 'blue';
      case 'advanced': return 'violet';
      case 'expert': return 'orange';
      case 'master': return 'emerald';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-4">
      <BackButton />
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Skills</h2>
        <p className="text-sm text-slate-400">{totalHours}h logged</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-slate-900 dark:text-white">{data.skills.length}</p>
          <p className="text-[9px] text-slate-500 uppercase font-bold">Skills</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
          <p className={`text-2xl font-black text-${accent}-500`}>{totalHours}</p>
          <p className="text-[9px] text-slate-500 uppercase font-bold">Total Hours</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-emerald-500">{data.skills.filter(s => s.level !== 'beginner').length}</p>
          <p className="text-[9px] text-slate-500 uppercase font-bold">Leveled Up</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all ${selectedCategory === 'all' ? `bg-${accent}-500 text-white border-${accent}-500` : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
        >
          All
        </button>
        {Object.keys(categoryIcons).map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat as SkillCategory)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all flex items-center gap-1 ${selectedCategory === cat ? `bg-${categoryColors[cat as SkillCategory]}-500 text-white border-${categoryColors[cat as SkillCategory]}-500` : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            {React.createElement(categoryIcons[cat as SkillCategory], { size: 10 })}
            {cat}
          </button>
        ))}
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {filteredSkills.map(skill => {
          const Icon = categoryIcons[skill.category];
          const color = categoryColors[skill.category];
          const progress = (skill.hoursLogged / skill.targetHours) * 100;
          
          return (
            <div key={skill.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                    <Icon size={18} className={`text-${color}-500`} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">{skill.name}</h5>
                    <p className={`text-[9px] font-black uppercase text-${getLevelColor(skill.level)}-500`}>{skill.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{skill.hoursLogged}h</p>
                  <p className="text-[9px] text-slate-400">/ {skill.targetHours}h</p>
                </div>
              </div>
              
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full bg-${color}-500 transition-all`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => actions.logSkillPractice(skill.id, 0.5)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold"
                >
                  +30min
                </button>
                <button 
                  onClick={() => actions.logSkillPractice(skill.id, 1)}
                  className={`flex-1 py-2 bg-${accent}-500 text-white rounded-lg text-[10px] font-bold`}
                >
                  +1 hour
                </button>
                <button 
                  onClick={() => actions.logSkillPractice(skill.id, 2)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold"
                >
                  +2 hours
                </button>
              </div>
              
              {skill.notes && (
                <p className="text-[10px] text-slate-400 mt-2 italic">📝 {skill.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Skill */}
      {!showAddSkill ? (
        <button 
          onClick={() => setShowAddSkill(true)}
          className={`w-full py-3 border-2 border-dashed border-${accent}-500/30 rounded-2xl text-${accent}-500 font-bold text-sm flex items-center justify-center gap-2`}
        >
          <Plus size={16}/> Add New Skill
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <input 
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-3 text-sm"
            placeholder="Skill name (e.g., Piano, Python, Sudoku)"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
          />
          <select 
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-3 text-sm"
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
          >
            {Object.keys(categoryIcons).map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (newSkillName) {
                  actions.addSkill(newSkillName, newSkillCategory);
                  setNewSkillName('');
                  setShowAddSkill(false);
                }
              }}
              className={`flex-1 py-3 bg-${accent}-500 text-white rounded-xl font-bold`}
            >
              Add Skill
            </button>
            <button 
              onClick={() => setShowAddSkill(false)}
              className="px-4 py-3 bg-slate-200 dark:bg-slate-800 rounded-xl"
            >
              <X size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- WEALTH TAB COMPONENT ---
const WealthTab = ({ data, actions }: TabProps) => {
  const accent = data.settings.accentColor || 'teal';
  const [showAddIncome, setShowAddIncome] = useState(false);

  // Back button
  const BackButton = () => (
    <button onClick={() => actions.setActiveTab('settings')} className="flex items-center gap-1 text-sm text-slate-500 mb-4">
      <ChevronUp size={16} className="rotate-[-90deg]"/> Back
    </button>
  );
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomeType, setNewIncomeType] = useState<'freelance' | 'app' | 'job' | 'other'>('freelance');

  const totalEarnings = data.income.reduce((acc, i) => acc + i.amount, 0);
  const thisMonthEarnings = data.income
    .filter(i => new Date(i.date).getMonth() === new Date().getMonth())
    .reduce((acc, i) => acc + i.amount, 0);

  const projectsInProgress = data.projects.filter(p => p.status === 'in-progress').length;
  const projectsCompleted = data.projects.filter(p => p.status === 'completed').length;

  // Financial milestones
  const milestones = [
    { target: 1000, label: 'First ₹1K' },
    { target: 10000, label: 'First ₹10K' },
    { target: 50000, label: '₹50K Earned' },
    { target: 100000, label: '₹1 Lakh!' },
    { target: 500000, label: '₹5 Lakh!' },
    { target: 1000000, label: '₹10 Lakh!!' },
  ];

  const nextMilestone = milestones.find(m => m.target > totalEarnings) || milestones[milestones.length - 1];
  const milestoneProgress = (totalEarnings / nextMilestone.target) * 100;

  return (
    <div className="space-y-4">
      <BackButton />
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Wealth</h2>
        <p className="text-sm text-slate-400">₹{totalEarnings.toLocaleString()} earned</p>
      </div>

      {/* Main Stats */}
      <div className={`bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-5`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase">Total Earnings</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
              <IndianRupee size={24}/>{totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-emerald-500/10`}>
            <Wallet size={24} className="text-emerald-500"/>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/50 dark:bg-slate-950/30 p-3 rounded-xl">
            <p className="text-[9px] text-slate-400 uppercase font-bold">This Month</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">₹{thisMonthEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-950/30 p-3 rounded-xl">
            <p className="text-[9px] text-slate-400 uppercase font-bold">Projects Active</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{projectsInProgress}</p>
          </div>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy size={14} className="text-yellow-500"/> Next Milestone
          </p>
          <p className={`text-[10px] font-black text-${accent}-500`}>{nextMilestone.label}</p>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
            style={{ width: `${Math.min(100, milestoneProgress)}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          ₹{totalEarnings.toLocaleString()} / ₹{nextMilestone.target.toLocaleString()} ({Math.round(milestoneProgress)}%)
        </p>
      </div>

      {/* 7K Projects */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
          <Briefcase size={14}/> 7K Empire Projects
        </h4>
        <div className="space-y-3">
          {data.projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">{project.title}</h5>
                  <p className="text-[10px] text-slate-500">{project.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                  project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                  project.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-slate-500/10 text-slate-500'
                }`}>
                  {project.status}
                </span>
              </div>
              {project.income > 0 && (
                <p className="text-sm font-bold text-emerald-500">₹{project.income.toLocaleString()} earned</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Income Log */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
          <TrendingUp size={14}/> Income History
        </h4>
        
        {data.income.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <PiggyBank size={40} className="mx-auto mb-2 opacity-50"/>
            <p className="text-sm">No income logged yet</p>
            <p className="text-[10px]">Start earning and track it here!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.income.slice(0, 5).map(inc => (
              <div key={inc.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{inc.name}</p>
                  <p className="text-[10px] text-slate-400">{new Date(inc.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-black text-emerald-500">+₹{inc.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Income */}
      {!showAddIncome ? (
        <button 
          onClick={() => setShowAddIncome(true)}
          className={`w-full py-3 bg-${accent}-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2`}
        >
          <Plus size={16}/> Log Income
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
          <input 
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            placeholder="Income source (e.g., Freelance project)"
            value={newIncomeName}
            onChange={(e) => setNewIncomeName(e.target.value)}
          />
          <input 
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            placeholder="Amount in ₹"
            type="number"
            value={newIncomeAmount}
            onChange={(e) => setNewIncomeAmount(e.target.value)}
          />
          <select 
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            value={newIncomeType}
            onChange={(e) => setNewIncomeType(e.target.value as any)}
          >
            <option value="freelance">Freelance</option>
            <option value="app">App Revenue</option>
            <option value="job">Job/Internship</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (newIncomeName && newIncomeAmount) {
                  actions.addIncome(newIncomeName, parseInt(newIncomeAmount), newIncomeType);
                  setNewIncomeName('');
                  setNewIncomeAmount('');
                  setShowAddIncome(false);
                }
              }}
              className={`flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold`}
            >
              Log ₹{newIncomeAmount || '0'}
            </button>
            <button 
              onClick={() => setShowAddIncome(false)}
              className="px-4 py-3 bg-slate-200 dark:bg-slate-800 rounded-xl"
            >
              <X size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsTab = ({ data, actions }: TabProps) => {
  const accent = data.settings.accentColor || 'teal';
  const colors: AccentColor[] = ['teal', 'cyan', 'violet', 'rose', 'orange'];

  // Calculate weekly stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  const weeklyWorkouts = data.workouts.filter(w => w.date >= weekAgoStr).length;
  const weeklyPomodoros = data.pomodoroSessions.filter(s => s.completedAt >= weekAgoStr).length;
  const weeklyCheckIns = data.checkIns.filter(c => c.date >= weekAgoStr && c.morning.completed).length;
  const weeklyProtocols = data.protocols.filter(p => p.date >= weekAgoStr).length;

  return (
    <div className="space-y-4">
      {/* Weekly Summary */}
      <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-[10px] font-black text-blue-500 uppercase mb-3">📊 This Week</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{weeklyWorkouts}</p>
            <p className="text-[8px] text-slate-400">Workouts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{weeklyPomodoros}</p>
            <p className="text-[8px] text-slate-400">Focus</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{weeklyCheckIns}</p>
            <p className="text-[8px] text-slate-400">Check-ins</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">{weeklyProtocols}</p>
            <p className="text-[8px] text-slate-400">Protocols</p>
          </div>
        </div>
      </div>

      {/* Quick Access to Skills & Wealth */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => actions.setActiveTab('skills')}
          className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-center"
        >
          <Target size={24} className="text-violet-500 mx-auto mb-2"/>
          <p className="text-sm font-bold">Skills</p>
          <p className="text-[10px] text-slate-400">{data.skills.reduce((a, s) => a + s.hoursLogged, 0)}h logged</p>
        </button>
        <button 
          onClick={() => actions.setActiveTab('wealth')}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center"
        >
          <Wallet size={24} className="text-emerald-500 mx-auto mb-2"/>
          <p className="text-sm font-bold">Wealth</p>
          <p className="text-[10px] text-slate-400">₹{data.totalEarnings.toLocaleString()}</p>
        </button>
      </div>
      
      {/* Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-sm font-bold mb-3">Theme Color</p>
          <div className="flex gap-3">
              {colors.map(c => (
                <button 
                  key={c} 
                  onClick={() => actions.setData((prev: AppData) => ({ ...prev, settings: { ...prev.settings, accentColor: c }}))} 
                  className={`w-8 h-8 rounded-full transition-all ${data.settings.accentColor === c ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : ''} bg-${c}-500`} 
                />
              ))}
          </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <p className="text-sm font-bold mb-3">Profile</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Name</span>
            <span className="font-bold">{data.user.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Level</span>
            <span className="font-bold">{Math.floor(data.stats.xp / 1000) + 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total XP</span>
            <span className="font-bold">{data.stats.xp.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Streak</span>
            <span className="font-bold text-orange-500">{data.stats.streak} days</span>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <p className="text-sm font-bold mb-3">About</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Version</span>
            <span className="font-bold">{APP_VERSION}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Made for</span>
            <span className="font-bold">Kunal 🚀</span>
          </div>
        </div>
      </div>

      {/* Reset Data */}
      <button 
        onClick={() => {
          if (confirm('Are you sure? This will reset ALL your data!')) {
            localStorage.removeItem('7k_ecosystem_growth_v2');
            window.location.reload();
          }
        }}
        className="w-full p-3 border border-rose-500/30 text-rose-500 rounded-xl text-sm font-bold"
      >
        Reset All Data
      </button>
    </div>
  );
};

const OnboardingOverlay = ({ onComplete, accent }: { onComplete: (userData: any) => void, accent: string }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', age: '', height: '', weight: '', faceType: '', goal: 'sleeper-build' as FitnessGoal });
  
  const slides = [
    { title: "Identity Setup", content: (
      <div className="space-y-4">
         <input className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-slate-700" placeholder="Agent Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
         <input className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-slate-700" type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
         <div className="grid grid-cols-2 gap-4">
           <input className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-slate-700" placeholder="Height (cm)" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
           <input className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-slate-700" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
         </div>
      </div>
    )},
    { title: "Select Goal", content: (
      <div className="grid grid-cols-2 gap-3">
         {['bulk', 'shredded', 'sleeper-build', 'athletic'].map(g => (
           <button key={g} onClick={() => setFormData({...formData, goal: g as FitnessGoal})} className={`p-4 rounded-xl border font-bold uppercase text-[10px] tracking-widest transition-all ${formData.goal === g ? `bg-${accent}-500 text-white border-${accent}-500` : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>{g}</button>
         ))}
      </div>
    )},
    { title: "Ready?", content: (
      <div className="text-center space-y-6">
         <Zap size={48} className={`mx-auto text-${accent}-500 animate-pulse`} />
         <button onClick={() => onComplete(formData)} className={`w-full bg-${accent}-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20`}>Initialize System</button>
      </div>
    )}
  ];
  return (
    <div className="fixed inset-0 z-[9999] bg-[#dbd7d2] dark:bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter text-slate-800 dark:text-white">{slides[step].title}</h1>
        {slides[step].content}
        {step < slides.length - 1 && <button onClick={() => setStep(step + 1)} className="mt-8 w-full py-4 border border-slate-300 dark:border-slate-800 rounded-xl font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors">Continue</button>}
      </div>
    </div>
  );
};

// --- SMART HOME SCREEN (Time-Aware) ---
const SmartHomeScreen = ({ data, actions, accent, onOpenSOS }: { data: AppData, actions: any, accent: string, onOpenSOS: () => void }) => {
  const timePeriod = getTimePeriod();
  const currentHour = new Date().getHours();
  const quote = getMotivationalQuote();
  
  // Simple greeting
  const getSimpleGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    if (currentHour < 21) return 'Good evening';
    return 'Good night';
  };

  // Get nearest exam
  const nearestExam = data.exams.reduce((nearest, exam) => {
    const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0 && (!nearest || daysLeft < nearest.daysLeft)) {
      return { exam, daysLeft };
    }
    return nearest;
  }, null as { exam: Exam; daysLeft: number } | null);

  // ONE focus card based on time
  const getFocusCard = () => {
    if (timePeriod === 'early_morning') {
      return { 
        title: 'Morning Routine', 
        subtitle: 'Start your day right',
        icon: Sunrise,
        color: 'orange',
        action: () => actions.setActiveTab('physical')
      };
    }
    if (timePeriod === 'study_time') {
      return { 
        title: 'Study Time', 
        subtitle: nearestExam ? `${nearestExam.exam.subject} in ${nearestExam.daysLeft}d` : 'Focus session',
        icon: BookOpen,
        color: 'blue',
        action: () => actions.setActiveTab('intelligence')
      };
    }
    if (timePeriod === 'evening') {
      return { 
        title: 'Log Workout', 
        subtitle: 'Track your gains',
        icon: Dumbbell,
        color: 'emerald',
        action: () => actions.setActiveTab('physical')
      };
    }
    if (timePeriod === 'wind_down') {
      return { 
        title: 'Night Routine', 
        subtitle: 'Wind down for sleep',
        icon: Moon,
        color: 'violet',
        action: () => actions.setActiveTab('physical')
      };
    }
    return { 
      title: 'Sleep', 
      subtitle: 'Rest is growth',
      icon: Moon,
      color: 'slate',
      action: () => {}
    };
  };

  const focus = getFocusCard();
  const FocusIcon = focus.icon;

  // Sleep time - minimal
  if (timePeriod === 'sleep_time') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <Moon size={48} className="text-violet-500 mb-4"/>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">Sleep Time</h2>
        <p className="text-sm text-slate-500 mb-8">Growth happens while you rest</p>
        <p className="text-5xl font-black text-violet-500">{data.discipline.noFapStreak}</p>
        <p className="text-xs text-slate-400">day streak</p>
      </div>
    );
  }

  // Generate last 7 days for mini heatmap
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const hasProtocol = data.protocols.some(p => p.date === dateStr);
    const hasWorkout = data.workouts.some(w => w.date.split('T')[0] === dateStr);
    const hasCheckIn = data.checkIns.some(c => c.date === dateStr);
    return {
      day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
      active: hasProtocol || hasWorkout || hasCheckIn,
      isToday: i === 6
    };
  });

  return (
    <div className="space-y-6">
      {/* Greeting - Minimal */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {getSimpleGreeting()}, {data.user.name || 'Champion'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">{getCurrentDateFormatted()}</p>
      </div>

      {/* Daily Quote */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl text-center">
        <p className="text-sm italic text-slate-600 dark:text-slate-300">"{quote.quote}"</p>
        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">— {quote.author}</p>
      </div>

      {/* Mini Week Heatmap */}
      <div className="flex justify-center gap-2">
        {last7Days.map((d, i) => (
          <div key={i} className="text-center">
            <p className="text-[9px] text-slate-400 mb-1">{d.day}</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              d.isToday 
                ? d.active ? `bg-${accent}-500 text-white` : `border-2 border-${accent}-500 text-${accent}-500`
                : d.active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'
            }`}>
              {d.active ? '✓' : '·'}
            </div>
          </div>
        ))}
      </div>

      {/* ONE Focus Card - Large & Tappable */}
      <button 
        onClick={focus.action}
        className={`w-full bg-${focus.color}-500/10 border-2 border-${focus.color}-500/30 rounded-2xl p-6 text-center transition-transform active:scale-[0.98]`}
      >
        <FocusIcon size={40} className={`text-${focus.color}-500 mx-auto mb-3`}/>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{focus.title}</h2>
        <p className="text-sm text-slate-500">{focus.subtitle}</p>
        <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 bg-${focus.color}-500 text-white rounded-full text-sm font-bold`}>
          Start <ArrowRight size={14}/>
        </div>
      </button>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={() => actions.incrementNoFapStreak()}
          className="bg-violet-500/10 rounded-xl p-3 text-center"
        >
          <Shield size={18} className="text-violet-500 mx-auto mb-1"/>
          <p className="text-[9px] font-bold">Day Done</p>
        </button>
        <button 
          onClick={() => actions.incrementColdShower()}
          className="bg-cyan-500/10 rounded-xl p-3 text-center"
        >
          <Snowflake size={18} className="text-cyan-500 mx-auto mb-1"/>
          <p className="text-[9px] font-bold">Cold</p>
        </button>
        <button 
          onClick={() => actions.updatePhysicalStat('waterIntake', data.physical.waterIntake + 1)}
          className="bg-blue-500/10 rounded-xl p-3 text-center"
        >
          <Droplets size={18} className="text-blue-500 mx-auto mb-1"/>
          <p className="text-[9px] font-bold">{data.physical.waterIntake}gl</p>
        </button>
        <button 
          onClick={() => actions.setActiveTab('intelligence')}
          className="bg-orange-500/10 rounded-xl p-3 text-center"
        >
          <Timer size={18} className="text-orange-500 mx-auto mb-1"/>
          <p className="text-[9px] font-bold">Focus</p>
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around py-3 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
        <div className="text-center">
          <p className="text-xl font-black text-orange-500">{data.stats.streak}</p>
          <p className="text-[8px] text-slate-400">STREAK</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-violet-500">{data.discipline.noFapStreak}</p>
          <p className="text-[8px] text-slate-400">CLEAN</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-emerald-500">{Math.floor(data.stats.xp / 1000) + 1}</p>
          <p className="text-[8px] text-slate-400">LEVEL</p>
        </div>
        {nearestExam && (
          <div className="text-center">
            <p className={`text-xl font-black ${nearestExam.daysLeft <= 7 ? 'text-rose-500' : 'text-blue-500'}`}>{nearestExam.daysLeft}</p>
            <p className="text-[8px] text-slate-400">EXAM</p>
          </div>
        )}
      </div>

      {/* Milestones */}
      {(() => {
        const milestones = [
          { days: 7, title: 'One Week', emoji: '🔥', unlocked: data.discipline.noFapStreak >= 7 },
          { days: 14, title: 'Two Weeks', emoji: '💪', unlocked: data.discipline.noFapStreak >= 14 },
          { days: 30, title: 'One Month', emoji: '🏆', unlocked: data.discipline.noFapStreak >= 30 },
          { days: 60, title: 'Two Months', emoji: '⚡', unlocked: data.discipline.noFapStreak >= 60 },
          { days: 90, title: 'Reboot', emoji: '👑', unlocked: data.discipline.noFapStreak >= 90 }
        ];
        const nextMilestone = milestones.find(m => !m.unlocked);
        const unlockedCount = milestones.filter(m => m.unlocked).length;
        
        if (unlockedCount > 0 || nextMilestone) {
          return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Milestones</p>
                <p className="text-[10px] text-slate-400">{unlockedCount}/5</p>
              </div>
              <div className="flex gap-2 justify-center">
                {milestones.map((m, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      m.unlocked 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg' 
                        : 'bg-slate-100 dark:bg-slate-800 opacity-40'
                    }`}
                    title={m.title}
                  >
                    {m.emoji}
                  </div>
                ))}
              </div>
              {nextMilestone && (
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  {nextMilestone.days - data.discipline.noFapStreak} days to {nextMilestone.title}
                </p>
              )}
            </div>
          );
        }
        return null;
      })()}

      {/* Emergency Panel - Anti-Procrastination System */}
      <EmergencyPanel 
        data={data} 
        actions={actions} 
        accent={accent}
        onOpenSOS={onOpenSOS}
      />
    </div>
  );
};

// --- App Root ---
const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => loadData());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'physical' | 'intelligence' | 'skills' | 'wealth' | 'settings'>('dashboard');
  const [showSOS, setShowSOS] = useState(false);
  const accent = data.settings.accentColor || 'teal';

  // --- Splash Screen Cleanup ---
  useEffect(() => {
    // Attempt to hide splash screen as soon as component is ready
    const removeSplash = () => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
        setTimeout(() => {
          splash.style.display = 'none';
        }, 500);
      }
    };
    
    // Immediate call and a slightly delayed one to catch edge cases
    removeSplash();
    const timer = setTimeout(removeSplash, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      saveData(data);
      if (data.settings.darkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {
      console.error("System settings error", e);
    }
  }, [data]);

  const level = useMemo(() => Math.floor(data.stats.xp / 1000) + 1, [data.stats.xp]);
  const xpInCurrentLevel = useMemo(() => data.stats.xp % 1000, [data.stats.xp]);
  const progressPercent = (xpInCurrentLevel / 1000) * 100;

  const actions = useMemo(() => ({
    // XP Action
    addXP: (amount: number) => setData(prev => ({
      ...prev,
      stats: { ...prev.stats, xp: prev.stats.xp + amount }
    })),
    updatePhysicalStat: (key: keyof PhysicalStats, val: number) => setData(prev => ({ ...prev, physical: { ...prev.physical, [key]: val }})),
    updatePB: (key: keyof PhysicalStats['pbs'], val: number) => setData(prev => ({ 
      ...prev, 
      physical: { ...prev.physical, pbs: { ...prev.physical.pbs, [key]: val } } 
    })),
    updateMeasurement: (key: string, val: number) => setData(prev => ({
      ...prev,
      physical: { 
        ...prev.physical, 
        measurements: { ...(prev.physical.measurements || {}), [key]: val } 
      }
    })),
    addXP: (amt: number, lbl: string) => {
      setData(prev => {
        const newLog: LogEntry = {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          type: 'xp' as const,
          value: amt,
          label: lbl
        };
        return {
          ...prev,
          stats: { ...prev.stats, xp: prev.stats.xp + amt },
          logs: [newLog, ...prev.logs].slice(0, 50)
        };
      });
    },
    toggleHabit: (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        setData(prev => ({ ...prev, habits: prev.habits.map(h => h.id === id ? { ...h, completedDates: h.completedDates.includes(today) ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today] } : h) }));
    },
    addStudyMaterial: (eid: string, t: string, u: string) => {
      setData(prev => ({
        ...prev,
        exams: prev.exams.map(e => e.id === eid ? {
          ...e,
          studyMaterials: [...(e.studyMaterials || []), { id: Math.random().toString(), title: t, url: u || '#' }]
        } : e)
      }));
    },
    deleteStudyMaterial: (eid: string, mid: string) => {
      setData(prev => ({
        ...prev,
        exams: prev.exams.map(e => e.id === eid ? {
          ...e,
          studyMaterials: (e.studyMaterials || []).filter(m => m.id !== mid)
        } : e)
      }));
    },
    // Pomodoro Actions
    logPomodoroSession: (subject: string, duration: number, type: 'study' | 'work' | 'skill') => {
      setData(prev => ({
        ...prev,
        pomodoroSessions: [...prev.pomodoroSessions, {
          id: Math.random().toString(),
          subject,
          duration,
          type,
          completedAt: new Date().toISOString()
        }]
      }));
    },
    // NoFap/Discipline Actions
    incrementNoFapStreak: () => {
      setData(prev => ({
        ...prev,
        discipline: {
          ...prev.discipline,
          noFapStreak: prev.discipline.noFapStreak + 1,
          noFapBestStreak: Math.max(prev.discipline.noFapBestStreak, prev.discipline.noFapStreak + 1)
        }
      }));
    },
    resetNoFapStreak: () => {
      setData(prev => ({
        ...prev,
        discipline: {
          ...prev.discipline,
          noFapStreak: 0,
          noFapLastRelapse: new Date().toISOString()
        }
      }));
    },
    incrementColdShower: () => {
      setData(prev => ({
        ...prev,
        discipline: {
          ...prev.discipline,
          coldShowerStreak: (prev.discipline.coldShowerStreak || 0) + 1
        }
      }));
    },
    // Workout Actions
    logWorkout: (workout: WorkoutSession) => {
      setData(prev => ({
        ...prev,
        workouts: [...prev.workouts, workout]
      }));
    },
    // Check-in Actions
    saveCheckIn: (checkIn: DailyCheckIn) => {
      setData(prev => {
        const existingIndex = prev.checkIns.findIndex(c => c.date === checkIn.date);
        if (existingIndex >= 0) {
          const updated = [...prev.checkIns];
          updated[existingIndex] = checkIn;
          return { ...prev, checkIns: updated };
        }
        return { ...prev, checkIns: [...prev.checkIns, checkIn] };
      });
    },
    // Protocol Actions
    saveProtocol: (protocol: DailyProtocol) => {
      setData(prev => {
        const existingIndex = prev.protocols.findIndex(p => p.date === protocol.date);
        if (existingIndex >= 0) {
          const updated = [...prev.protocols];
          updated[existingIndex] = protocol;
          return { ...prev, protocols: updated };
        }
        return { ...prev, protocols: [...prev.protocols, protocol] };
      });
    },
    // Study Topics Actions
    toggleStudyTopic: (subjectId: string, chapterId: string, topicId: string) => {
      setData(prev => ({
        ...prev,
        studySubjects: prev.studySubjects.map(sub => 
          sub.id === subjectId 
            ? {
                ...sub,
                chapters: sub.chapters.map(ch =>
                  ch.id === chapterId
                    ? {
                        ...ch,
                        topics: ch.topics.map(t =>
                          t.id === topicId ? { ...t, completed: !t.completed, revision: !t.completed ? 1 : t.revision } as StudyTopic : t
                        )
                      }
                    : ch
                )
              }
            : sub
        )
      }));
    },
    markTopicRevision: (subjectId: string, chapterId: string, topicId: string) => {
      setData(prev => ({
        ...prev,
        studySubjects: prev.studySubjects.map(sub => 
          sub.id === subjectId 
            ? {
                ...sub,
                chapters: sub.chapters.map(ch =>
                  ch.id === chapterId
                    ? {
                        ...ch,
                        topics: ch.topics.map(t =>
                          t.id === topicId ? { ...t, revision: Math.min(3, t.revision + 1) as 0 | 1 | 2 | 3 } : t
                        )
                      }
                    : ch
                )
              }
            : sub
        )
      }));
    },
    toggleWeakTopic: (subjectId: string, chapterId: string, topicId: string) => {
      setData(prev => ({
        ...prev,
        studySubjects: prev.studySubjects.map(sub => 
          sub.id === subjectId 
            ? {
                ...sub,
                chapters: sub.chapters.map(ch =>
                  ch.id === chapterId
                    ? {
                        ...ch,
                        topics: ch.topics.map(t =>
                          t.id === topicId ? { ...t, isWeak: !t.isWeak } : t
                        )
                      }
                    : ch
                )
              }
            : sub
        )
      }));
    },
    // Skills Actions
    logSkillPractice: (skillId: string, hours: number) => {
      setData(prev => ({
        ...prev,
        skills: prev.skills.map(s => s.id === skillId ? {
          ...s,
          hoursLogged: s.hoursLogged + hours,
          lastPracticed: new Date().toISOString()
        } : s)
      }));
    },
    addSkill: (name: string, category: SkillCategory) => {
      const newSkill: Skill = {
        id: Math.random().toString(),
        name,
        category,
        level: 'beginner',
        hoursLogged: 0,
        targetHours: 100,
        lastPracticed: new Date().toISOString(),
        notes: ''
      };
      setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    },
    // Income Actions
    addIncome: (name: string, amount: number, type: 'freelance' | 'app' | 'job' | 'other') => {
      const newIncome: IncomeSource = {
        id: Math.random().toString(),
        name,
        amount,
        type,
        date: new Date().toISOString(),
        recurring: false
      };
      setData(prev => ({
        ...prev,
        income: [...prev.income, newIncome],
        totalEarnings: prev.totalEarnings + amount
      }));
    },
    setData,
    setActiveTab,
    level,
    accent
  }), [level, accent, setActiveTab]);

  const completionRate = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const done = data.habits.filter(h => h.completedDates.includes(today)).length;
    return data.habits.length > 0 ? (done / data.habits.length) * 100 : 0;
  }, [data.habits]);

  const widgets = {
    welcome: <div key="welcome-w" className={`bg-${accent}-500/10 border border-${accent}-500/20 p-6 rounded-2xl mb-6 text-center shadow-inner`}><p className={`text-${accent}-600 text-[10px] font-black uppercase tracking-widest`}>Authorized Profile: {data.user.name}</p><h3 className="text-lg font-bold">Goal: {data.user.goal.toUpperCase()} Build</h3></div>,
    stats: <div key="stats-w" className="grid grid-cols-2 gap-4 mb-6"><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"><p className="text-[10px] text-slate-500 font-bold uppercase">Efficiency</p><p className="text-xl font-black">{completionRate.toFixed(0)}%</p></div><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"><p className="text-[10px] text-slate-500 font-bold uppercase">BMI Status</p><p className="text-xl font-black text-emerald-500">OPTIMAL</p></div></div>,
    habits: <div key="habits-w" className="space-y-3 mb-6"><h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Protocols</h4>{data.habits.map(h => {
       const today = new Date().toISOString().split('T')[0];
       const isDone = h.completedDates.includes(today);
       return <button key={h.id} onClick={() => actions.toggleHabit(h.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isDone ? `bg-${accent}-500/10 border-${accent}-500/20 text-${accent}-600` : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'}`}>{h.name}<CheckCircle2 size={16} className={isDone ? `text-${accent}-500` : 'text-slate-300'}/></button>
    })}</div>,
    exams: <div key="exams-w" className="space-y-3 mb-6"><h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Upcoming Exams</h4>{data.exams.slice(0, 2).map(exam => <ExamItem key={exam.id} exam={exam} onAddMaterial={actions.addStudyMaterial} onDeleteMaterial={actions.deleteStudyMaterial} accent={accent} />)}</div>,
    priority: <div key="priority-w" className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6"><h4 className="text-[10px] font-black text-rose-500 uppercase mb-2">Priority Board</h4><p className="text-xs font-bold text-slate-700 dark:text-slate-300">Complete Board Prep for 2 hours today.</p></div>,
    tasks: <div key="tasks-w" className="mb-6"><h4 className="text-xs font-black text-slate-400 uppercase mb-3">Daily Tasks</h4><div className="space-y-2">{data.tasks.map(t => <div key={t.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"><div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700" /> <span className="text-xs">{t.title}</span></div>)}</div></div>,
    calendar: <div key="calendar-w" className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl mb-6 text-center"><p className="text-[10px] font-black text-indigo-500 uppercase">System Schedule</p><p className="text-xs font-bold mt-1">{new Date().toDateString()}</p></div>,
    chart: (() => {
      // Generate last 7 days habit completion data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];
        const completed = data.habits.filter(h => h.completedDates.includes(dateStr)).length;
        return {
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
          completed,
          total: data.habits.length
        };
      });
      return (
        <div key="chart-w" className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">Weekly Habit Completion</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={last7Days}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 10 }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="completed" fill={`var(--${accent}-500, #14b8a6)`} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2 text-[9px] text-slate-400">
            <span>🔥 Streak: {data.stats.streak} days</span>
            <span>📊 Avg: {(last7Days.reduce((a, d) => a + d.completed, 0) / 7).toFixed(1)}/day</span>
          </div>
        </div>
      );
    })(),
    discipline: <div key="discipline-w" className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[9px] font-black text-rose-500 uppercase">NoFap Streak</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{data.discipline.noFapStreak} <span className="text-sm text-slate-400">days</span></p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400">Best: {data.discipline.noFapBestStreak} days</p>
          <button onClick={() => actions.incrementNoFapStreak()} className="mt-1 px-3 py-1 bg-emerald-500 text-white text-[9px] font-bold rounded-full">✓ Day Done</button>
        </div>
      </div>
    </div>,
    pomodoro: <div key="pomodoro-w" className={`bg-${accent}-500/10 border border-${accent}-500/20 p-4 rounded-2xl mb-6`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-[9px] font-black text-${accent}-500 uppercase`}>Focus Sessions Today</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {data.pomodoroSessions.filter(s => s.completedAt.split('T')[0] === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
        <Timer size={24} className={`text-${accent}-500`} />
      </div>
      <p className="text-[9px] text-slate-400 mt-2">Go to Mind tab to start a focus session</p>
    </div>,
    skills: <div key="skills-w" className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-2xl mb-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[9px] font-black text-violet-500 uppercase">Skill Progress</p>
        <p className="text-[9px] text-slate-400">{data.skills.reduce((a, s) => a + s.hoursLogged, 0)} total hours</p>
      </div>
      <div className="space-y-2">
        {data.skills.slice(0, 3).map(skill => (
          <div key={skill.id} className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500" style={{ width: `${Math.min(100, (skill.hoursLogged / skill.targetHours) * 100)}%` }} />
            </div>
            <span className="text-[9px] font-bold w-16 truncate">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>,
    wealth: <div key="wealth-w" className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[9px] font-black text-emerald-500 uppercase">Total Earnings</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <IndianRupee size={18}/>{data.totalEarnings.toLocaleString()}
          </p>
        </div>
        <Wallet size={24} className="text-emerald-500" />
      </div>
    </div>
  };

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => {
    const isVisible = id === 'dashboard' || id === 'settings' || data.settings.activeSections[id as keyof typeof data.settings.activeSections];
    if (!isVisible) return null;
    return (
      <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === id ? `text-${accent}-500 bg-${accent}-500/10` : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}>
        <Icon size={20} />
        <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
      </button>
    );
  };

  const handleOnboardingComplete = (u: any) => {
    setData(p => ({
      ...p,
      user: { ...p.user, ...u },
      onboardingCompleted: true
    }));
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen bg-[#f5f3f0] dark:bg-slate-950 flex flex-col relative pb-16 shadow-2xl overflow-x-hidden`}>
      {!data.onboardingCompleted ? (
        <OnboardingOverlay onComplete={handleOnboardingComplete} accent={accent} />
      ) : (
        <>
          {/* Minimal Header */}
          <div className="sticky top-0 z-50 bg-[#f5f3f0]/90 dark:bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className={`w-7 h-7 bg-${accent}-500 rounded-lg flex items-center justify-center text-white font-black text-sm`}>{level}</div>
                   <div className="flex-1 h-1.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full bg-${accent}-500`} style={{ width: `${progressPercent}%` }} />
                   </div>
                </div>
                <div className="flex items-center gap-1 text-orange-500 text-sm font-black">
                  <Flame size={14}/> {data.stats.streak}
                </div>
             </div>
          </div>
          <main className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'dashboard' && <SmartHomeScreen data={data} actions={actions} accent={accent} onOpenSOS={() => setShowSOS(true)} />}
            {activeTab === 'physical' && <PhysicalTab data={data} actions={actions} />}
            {activeTab === 'intelligence' && <MindTab data={data} actions={actions} />}
            {activeTab === 'settings' && <SettingsTab data={data} actions={actions} />}
            {activeTab === 'skills' && <SkillsTab data={data} actions={actions} />}
            {activeTab === 'wealth' && <WealthTab data={data} actions={actions} />}
          </main>
          {/* Simplified 4-Tab Nav */}
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#f5f3f0]/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-2 grid grid-cols-4 gap-2 z-50">
            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center py-2 rounded-xl transition-all ${activeTab === 'dashboard' ? `text-${accent}-500` : 'text-slate-400'}`}>
              <Home size={20} />
              <span className="text-[9px] mt-0.5 font-medium">Home</span>
            </button>
            <button onClick={() => setActiveTab('physical')} className={`flex flex-col items-center py-2 rounded-xl transition-all ${activeTab === 'physical' ? `text-${accent}-500` : 'text-slate-400'}`}>
              <Dumbbell size={20} />
              <span className="text-[9px] mt-0.5 font-medium">Body</span>
            </button>
            <button onClick={() => setActiveTab('intelligence')} className={`flex flex-col items-center py-2 rounded-xl transition-all ${activeTab === 'intelligence' ? `text-${accent}-500` : 'text-slate-400'}`}>
              <Brain size={20} />
              <span className="text-[9px] mt-0.5 font-medium">Mind</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center py-2 rounded-xl transition-all ${activeTab === 'settings' ? `text-${accent}-500` : 'text-slate-400'}`}>
              <SettingsIcon size={20} />
              <span className="text-[9px] mt-0.5 font-medium">More</span>
            </button>
          </nav>
        </>
      )}
      {/* SOS Emergency Overlay */}
      <SOSOverlay 
        isOpen={showSOS} 
        onClose={() => setShowSOS(false)} 
        data={data} 
        actions={actions} 
        accent={accent} 
      />
    </div>
  );
};

export default App;