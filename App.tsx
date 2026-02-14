
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  Zap, Brain, Target, DollarSign, Settings as SettingsIcon, 
  Dumbbell, CheckCircle2, Trophy, Clock, 
  BookOpen, Music, Share2, Github, Instagram, ExternalLink, Mail,
  LayoutDashboard, Flame, Box, Calendar as CalendarIcon, AlertCircle, Shield,
  ArrowUp, ArrowDown, Eye, GripVertical, Download, ChevronRight, GraduationCap,
  Link as LinkIcon, Plus, Trash2, ChevronDown, ChevronUp, Flag, CheckSquare, Square,
  RotateCcw, Play, Pause, X, GripHorizontal, EyeOff, Undo2, RefreshCw,
  Droplets, Moon, Utensils, TrendingUp, Scale, Minus, UserCircle, ScanFace, Ruler, Weight,
  Palette, Sun, Moon as MoonIcon, Sparkles, Activity, Layers, ListFilter, Info, ZapIcon
} from 'lucide-react';
import { Area, AppData, Habit, Project, LogEntry, WidgetType, Exam, Task, StudyMaterial, AccentColor, FitnessGoal } from './types';
import { loadData, saveData, APP_VERSION } from './db';

// --- Static Exercise Data ---
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
      benefit: 'Spinal decompression & height maximization', 
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
  // Mifflin-St Jeor
  const bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
  return Math.round(bmr * 1.375); // Lightly active multiplier
};

// --- Onboarding Component ---
const OnboardingOverlay = ({ onComplete, accent }: { onComplete: (userData: any) => void, accent: string }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    faceType: '',
    goal: 'sleeper-build' as FitnessGoal
  });

  const handleNext = () => {
    if (step === 0) {
      if (!formData.name || !formData.age) {
        alert("Please enter your name and age to continue.");
        return;
      }
    }
    setStep(s => s + 1);
  };

  const slides = [
    {
      title: "Identity Setup",
      content: (
        <div className="space-y-4 animate-in slide-in-from-right duration-300">
           <div className="space-y-2">
             <label className={`text-xs text-${accent}-400 font-bold uppercase ml-1`}>Codename</label>
             <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
               <UserCircle className="text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="e.g. Neo" 
                 className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Age</label>
               <input 
                 type="number" 
                 className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                 value={formData.age}
                 onChange={(e) => setFormData({...formData, age: e.target.value})}
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Face Shape</label>
               <input 
                 type="text" 
                 placeholder="Oval"
                 className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                 value={formData.faceType}
                 onChange={(e) => setFormData({...formData, faceType: e.target.value})}
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Height (cm)</label>
               <input 
                 type="number" 
                 placeholder="175"
                 className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                 value={formData.height}
                 onChange={(e) => setFormData({...formData, height: e.target.value})}
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Weight (kg)</label>
               <input 
                 type="number" 
                 placeholder="70"
                 className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                 value={formData.weight}
                 onChange={(e) => setFormData({...formData, weight: e.target.value})}
               />
             </div>
           </div>
        </div>
      )
    },
    {
      title: "Set Your Objective",
      content: (
        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-right duration-300">
           {[
               { id: 'bulk', l: 'Bulk', d: 'Mass Gain' },
               { id: 'shredded', l: 'Shredded', d: 'Fat Loss' },
               { id: 'sleeper-build', l: 'Sleeper', d: 'Functional' },
               { id: 'athletic', l: 'Athletic', d: 'Explosive' }
           ].map(g => (
               <button 
                key={g.id}
                onClick={() => setFormData({...formData, goal: g.id as FitnessGoal})}
                className={`p-4 rounded-xl border transition-all text-left ${formData.goal === g.id ? `bg-${accent}-500 text-white border-${accent}-600` : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
               >
                  <p className="font-bold">{g.l}</p>
                  <p className={`text-[10px] ${formData.goal === g.id ? 'text-white/80' : 'text-slate-500'}`}>{g.d}</p>
               </button>
           ))}
        </div>
      )
    },
    {
      title: "Ready?",
      content: (
        <div className="text-center space-y-6 animate-in slide-in-from-right duration-300">
           <Zap size={48} className={`mx-auto text-${accent}-500`} />
           <p className="text-slate-500 dark:text-slate-400 text-sm">System synchronized. Protocols generated.</p>
           <button 
             onClick={() => onComplete(formData)}
             className={`w-full bg-${accent}-500 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform`}
           >
             Initialize
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-[#dbd7d2] dark:bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className={`text-2xl font-black text-center mb-6 text-${accent}-500 uppercase tracking-tighter`}>{slides[step].title}</h1>
        {slides[step].content}
        {step < slides.length - 1 && (
            <button onClick={handleNext} className={`mt-8 w-full py-4 border border-slate-300 dark:border-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400`}>
              Next Step <ChevronRight size={18} />
            </button>
        )}
      </div>
    </div>
  );
};

// --- Components ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>}
  </div>
);

interface SectionProps {
  data: AppData;
  actions: {
    updatePhysicalStat: (key: any, value: number) => void;
    updatePB: (key: any, value: number) => void;
    addXP: (amount: number, label: string) => void;
    toggleHabit: (id: string) => void;
    addStudyMaterial: (id: string, title: string, url: string) => void;
    deleteStudyMaterial: (examId: string, matId: string) => void;
    setData: React.Dispatch<React.SetStateAction<AppData>>;
    level: number;
    accent: string;
  };
}

const PhysicalSection: React.FC<SectionProps> = ({ data, actions }) => {
  const { accent } = actions;
  const bmi = calculateBMI(data.user.height, data.physical.weight);
  const tdee = calculateTDEE(data.user.height, data.physical.weight, data.user.age);
  
  const getBmiStatus = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'orange' };
    if (bmi < 25) return { label: 'Normal', color: 'emerald' };
    if (bmi < 30) return { label: 'Overweight', color: 'rose' };
    return { label: 'Obese', color: 'red' };
  };

  const status = getBmiStatus();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Bio Status Card */}
      <div className={`bg-gradient-to-br from-${accent}-500/10 to-indigo-500/10 border border-${accent}-500/20 rounded-2xl p-6 relative overflow-hidden shadow-sm`}>
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{data.user.name}</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{data.user.goal.replace('-', ' ')} protocol active</p>
            </div>
            <div className={`px-2 py-1 rounded bg-${status.color}-500/10 border border-${status.color}-500/20 text-${status.color}-500 text-[10px] font-black uppercase`}>
                BMI: {bmi} ({status.label})
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-slate-950/30 p-3 rounded-xl border border-white dark:border-slate-800">
               <span className="text-[9px] font-black text-slate-400 uppercase block">Maintenance</span>
               <div className="flex items-baseline gap-1">
                 <span className="text-lg font-black text-slate-900 dark:text-white">{tdee}</span>
                 <span className="text-[8px] text-slate-500 uppercase">kcal/day</span>
               </div>
            </div>
            <div className="bg-white/50 dark:bg-slate-950/30 p-3 rounded-xl border border-white dark:border-slate-800">
               <span className="text-[9px] font-black text-slate-400 uppercase block">Target Weight</span>
               <div className="flex items-baseline gap-1">
                 <span className="text-lg font-black text-slate-900 dark:text-white">
                    {data.user.goal === 'bulk' ? data.physical.weight + 5 : data.user.goal === 'shredded' ? data.physical.weight - 5 : data.physical.weight}
                 </span>
                 <span className="text-[8px] text-slate-500 uppercase">kg</span>
               </div>
            </div>
         </div>
      </div>

      {/* Goal Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['bulk', 'shredded', 'sleeper-build', 'athletic'].map(g => (
          <button 
            key={g}
            onClick={() => actions.setData(prev => ({ ...prev, user: { ...prev.user, goal: g as FitnessGoal }}))}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              data.user.goal === g ? `bg-${accent}-500 text-white border-${accent}-500 shadow-lg shadow-${accent}-500/20` : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            {g.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Core Vitals Tracking */}
      <div className="grid grid-cols-2 gap-4">
          {[
              { id: 'waterIntake', l: 'Water', val: data.physical.waterIntake, unit: 'gl', icon: Droplets, color: 'blue' },
              { id: 'sleepHours', l: 'Sleep', val: data.physical.sleepHours, unit: 'h', icon: Moon, color: 'violet' },
              { id: 'proteinIntake', l: 'Protein', val: data.physical.proteinIntake, unit: 'g', icon: Utensils, color: 'rose' },
              { id: 'weight', l: 'Weight', val: data.physical.weight, unit: 'kg', icon: Scale, color: 'emerald' }
          ].map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[9px] font-black text-slate-400 uppercase">{item.l}</span>
                   <item.icon size={14} className={`text-${item.color}-500`} />
                </div>
                <div className="flex items-center justify-between mt-2">
                   <button onClick={() => actions.updatePhysicalStat(item.id as any, Math.max(0, item.val - 1))} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Minus size={12}/></button>
                   <div className="text-center">
                      <span className="text-xl font-black text-slate-900 dark:text-white">{item.val}</span>
                      <span className="text-[8px] text-slate-500 block -mt-1">{item.unit}</span>
                   </div>
                   <button onClick={() => actions.updatePhysicalStat(item.id as any, item.val + 1)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Plus size={12}/></button>
                </div>
            </div>
          ))}
      </div>

      {/* Face Exercise Library */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ScanFace size={18} className="text-purple-500" /> Face Optimization Library
          </h4>
          <div className="space-y-4">
             {EXERCISE_LIBRARY.face.map(ex => (
               <div key={ex.name} className="border-l-2 border-purple-500/30 pl-4 space-y-2">
                  <div className="flex justify-between items-start">
                     <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{ex.name}</p>
                     <span className="text-[8px] bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded font-black uppercase">{ex.frequency}</span>
                  </div>
                  <p className="text-[10px] text-purple-500/80 font-bold uppercase">{ex.benefit}</p>
                  <ul className="space-y-1">
                     {ex.steps.map((s, i) => (
                       <li key={i} className="text-[10px] text-slate-500 dark:text-slate-400 flex gap-2">
                          <span className="text-purple-500 font-black">{i+1}.</span> {s}
                       </li>
                     ))}
                  </ul>
               </div>
             ))}
          </div>
      </div>

      {/* Daily Physical Missions (personalized by goal) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
            <Target size={18} className={`text-${accent}-500`} /> Goal Checklist: {data.user.goal}
          </h4>
          <div className="space-y-3">
             {EXERCISE_LIBRARY.physical
              .filter(ex => !ex.goalFocus || ex.goalFocus.includes(data.user.goal))
              .map(ex => (
               <div key={ex.name} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                     <p className="font-bold text-sm text-slate-900 dark:text-white">{ex.name}</p>
                     <Info size={14} className="text-slate-400" />
                  </div>
                  <p className="text-[9px] text-slate-500 mb-2">{ex.steps.join(' • ')}</p>
                  <div className="flex justify-between items-center">
                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-${accent}-500/10 text-${accent}-500`}>{ex.benefit}</span>
                     <button className={`w-6 h-6 rounded border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-${accent}-500 transition-all`}>
                        <CheckCircle2 size={12} className="text-transparent hover:text-slate-300" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
      </div>
    </div>
  );
};

// --- Missing ExamItem Component Implementation ---
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
          <p className="text-[10px] text-slate-400 italic text-center py-2">No study materials added yet.</p>
        )}
      </div>

      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:hover:text-slate-300 flex items-center justify-center gap-1.5 transition-all">
          <Plus size={10} /> ADD STUDY RESOURCE
        </button>
      ) : (
        <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl animate-in slide-in-from-top-2">
          <input 
            className="w-full text-[11px] p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none" 
            placeholder="Material Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input 
            className="w-full text-[11px] p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none" 
            placeholder="URL (optional)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (newTitle) onAddMaterial(exam.id, newTitle, newUrl);
                setNewTitle(''); setNewUrl(''); setShowAdd(false);
              }}
              className={`flex-1 py-1.5 bg-${accent}-500 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-${accent}-500/20`}
            >
              SAVE
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400">CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Intelligence Section ---
const IntelligenceSection: React.FC<SectionProps> = ({ data, actions }) => {
  const intelHabits = data.habits.filter(h => h.category === Area.Intelligence);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="Intelligence" subtitle="Knowledge acquisition & application" />
      <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap size={16} /> Active Exams
          </h4>
          {data.exams.map(exam => (
            <ExamItem 
              key={exam.id} 
              exam={exam} 
              onAddMaterial={actions.addStudyMaterial} 
              onDeleteMaterial={actions.deleteStudyMaterial}
              accent={actions.accent}
            />
          ))}
      </div>
    </div>
  );
};

const SkillsSection: React.FC<SectionProps> = ({ data, actions }) => {
  const skillHabits = data.habits.filter(h => h.category === Area.Skills);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="Skill Tree" subtitle="Talent stacking" />
      <div className="space-y-3">
           <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Daily Practice</h4>
           {skillHabits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isDone = habit.completedDates.includes(today);
            return (
              <button 
                key={habit.id}
                onClick={() => actions.toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDone ? `bg-${actions.accent}-500/10 border-${actions.accent}-500/40 text-${actions.accent}-600 dark:text-${actions.accent}-100` : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{habit.name}</span>
                {isDone ? <CheckCircle2 size={18} className={`text-${actions.accent}-500 dark:text-${actions.accent}-400`} /> : <div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600" />}
              </button>
            );
          })}
      </div>
    </div>
  );
};

const WealthSection: React.FC<SectionProps> = ({ data, actions }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="Wealth" subtitle="Resource generation" />
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
              <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider mb-1">Total MRR</p>
              <h3 className="text-3xl font-black text-white">$0.00</h3>
          </div>
          <DollarSign size={24} className="text-emerald-400" />
      </div>
    </div>
  );
};

const SettingsSection: React.FC<SectionProps> = ({ data, actions }) => {
  const { accent } = actions;
  const colors: AccentColor[] = ['teal', 'cyan', 'violet', 'rose', 'orange'];

  const toggleSection = (section: keyof typeof data.settings.activeSections) => {
    actions.setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        activeSections: { ...prev.settings.activeSections, [section]: !prev.settings.activeSections[section] }
      }
    }));
  };

  const widgets: { id: WidgetType, label: string }[] = [
    { id: 'welcome', label: 'Welcome Banner' },
    { id: 'priority', label: 'Critical Missions' },
    { id: 'tasks', label: 'Daily Operations' },
    { id: 'exams', label: 'Exam Countdown' },
    { id: 'calendar', label: 'Schedule Matrix' },
    { id: 'stats', label: 'Quick Stats' },
    { id: 'chart', label: 'Growth Chart' },
    { id: 'habits', label: 'Daily Quests' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="Settings" subtitle="Control Center" />

      {/* Styling */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Palette size={18} className={`text-${accent}-500`} /> System Styling
          </h4>
          <div className="flex gap-3">
              {colors.map(c => (
                  <button key={c} onClick={() => actions.setData(prev => ({ ...prev, settings: { ...prev.settings, accentColor: c }}))} className={`w-8 h-8 rounded-full border-2 ${data.settings.accentColor === c ? 'border-white ring-2 ring-slate-400' : 'border-transparent'}`}>
                     <div className={`w-full h-full rounded-full bg-${c}-500`} />
                  </button>
              ))}
          </div>
      </div>

      {/* Navigation Modules */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ListFilter size={18} className={`text-${accent}-500`} /> Module Visibility
          </h4>
          <div className="space-y-2">
            {Object.entries(data.settings.activeSections).map(([key, isActive]) => (
              <button key={key} onClick={() => toggleSection(key as any)} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isActive ? `bg-${accent}-500/10 border-${accent}-500/20 text-${accent}-600` : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                <span className="text-sm font-bold capitalize">{key}</span>
                {isActive ? <CheckCircle2 size={16} /> : <X size={16} />}
              </button>
            ))}
          </div>
      </div>

      {/* Dashboard Config */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers size={18} className={`text-${accent}-500`} /> Home Widgets
          </h4>
          <div className="space-y-3">
             {widgets.map(w => {
               const active = data.settings.dashboardLayout.includes(w.id);
               return (
                 <button key={w.id} onClick={() => actions.setData(prev => ({ ...prev, settings: { ...prev.settings, dashboardLayout: active ? prev.settings.dashboardLayout.filter(i => i !== w.id) : [...prev.settings.dashboardLayout, w.id] }}))} className={`w-full flex items-center justify-between p-3 rounded-xl border ${active ? `bg-${accent}-500/10 border-${accent}-500/20 text-${accent}-600` : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'}`}>
                    <span className="text-xs font-bold">{w.label}</span>
                    {active ? <Eye size={14}/> : <EyeOff size={14}/>}
                 </button>
               );
             })}
          </div>
      </div>
    </div>
  );
};

// --- App Root ---
const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'physical' | 'intelligence' | 'skills' | 'wealth' | 'settings'>('dashboard');
  const accent = data.settings.accentColor || 'teal';

  useEffect(() => {
    saveData(data);
    if (data.settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [data]);

  const level = useMemo(() => Math.floor(data.stats.xp / 1000) + 1, [data.stats.xp]);
  const xpInCurrentLevel = useMemo(() => data.stats.xp % 1000, [data.stats.xp]);
  const progressPercent = (xpInCurrentLevel / 1000) * 100;

  const actions = {
    updatePhysicalStat: (key: any, val: number) => setData(prev => ({ ...prev, physical: { ...prev.physical, [key]: val }})),
    updatePB: (key: any, val: number) => setData(prev => ({ ...prev, physical: { ...prev.physical.pbs, [key]: val }}})),
    // Fix: Cast 'xp' literal to 'xp' as const to resolve type inference mismatch with LogEntry.type union
    addXP: (amt: number, lbl: string) => setData(prev => ({ ...prev, stats: { ...prev.stats, xp: prev.stats.xp + amt }, logs: [{ id: Math.random().toString(), timestamp: new Date().toISOString(), type: 'xp' as const, value: amt, label: lbl }, ...prev.logs].slice(0, 50) })),
    toggleHabit: (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        setData(prev => ({ ...prev, habits: prev.habits.map(h => h.id === id ? { ...h, completedDates: h.completedDates.includes(today) ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today] } : h) }));
    },
    // Fix: Implemented missing functional study material actions
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
    setData,
    level,
    accent
  };

  const Dashboard = () => {
      const completionRate = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const done = data.habits.filter(h => h.completedDates.includes(today)).length;
        return data.habits.length > 0 ? (done / data.habits.length) * 100 : 0;
      }, [data.habits]);

      const widgets = {
        welcome: <div key="w" className={`bg-${accent}-500/10 border border-${accent}-500/20 p-6 rounded-2xl mb-6 text-center`}><p className={`text-${accent}-600 text-[10px] font-black uppercase tracking-widest`}>Syncing Profile: {data.user.name}</p><h3 className="text-lg font-bold">Goal: {data.user.goal.toUpperCase()}</h3></div>,
        stats: <div key="s" className="grid grid-cols-2 gap-4 mb-6"><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"><p className="text-[10px] text-slate-500 font-bold uppercase">Efficiency</p><p className="text-xl font-black">{completionRate.toFixed(0)}%</p></div><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"><p className="text-[10px] text-slate-500 font-bold uppercase">BMI Status</p><p className="text-xl font-black text-emerald-500">OPTIMAL</p></div></div>,
        habits: <div key="h" className="space-y-3 mb-6"><h4 className="text-xs font-black text-slate-400 uppercase">Active Protocols</h4>{data.habits.map(h => <button key={h.id} onClick={() => actions.toggleHabit(h.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${h.completedDates.includes(new Date().toISOString().split('T')[0]) ? `bg-${accent}-500/10 border-${accent}-500/20 text-${accent}-600` : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}>{h.name}<CheckCircle2 size={16}/></button>)}</div>
      };

      return <div className="animate-in fade-in duration-500">{data.settings.dashboardLayout.map(wid => (widgets as any)[wid])}</div>;
  };

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => {
    if (id !== 'dashboard' && id !== 'settings' && !data.settings.activeSections[id as keyof typeof data.settings.activeSections]) return null;
    return (
      <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === id ? `text-${accent}-500 bg-${accent}-500/10` : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}>
        <Icon size={20} />
        <span className="text-[9px] mt-1 font-bold uppercase">{label}</span>
      </button>
    );
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen bg-[#dbd7d2] dark:bg-slate-950 flex flex-col relative pb-20 shadow-2xl transition-all duration-500`}>
      {!data.onboardingCompleted ? <OnboardingOverlay onComplete={(u) => setData(p => ({ ...p, user: { ...p.user, ...u }, onboardingCompleted: true }))} accent={accent} /> : (
        <>
          <div className="sticky top-0 z-50 bg-[#dbd7d2]/80 dark:bg-slate-950/80 backdrop-blur-md p-4 border-b border-slate-300 dark:border-slate-800">
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                   <div className={`w-8 h-8 bg-${accent}-500 rounded flex items-center justify-center text-white font-black`}>{level}</div>
                   <div><p className="text-[10px] font-black uppercase text-slate-500 leading-none">Power Level</p><p className={`text-xs font-black text-${accent}-600 leading-none mt-1`}>{xpInCurrentLevel}/1000 XP</p></div>
                </div>
                <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-[10px] font-black"><Flame size={12}/> {data.stats.streak}</div>
             </div>
             <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full bg-${accent}-500 transition-all duration-1000`} style={{ width: `${progressPercent}%` }} /></div>
          </div>

          <main className="flex-1 p-5 overflow-y-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'physical' && <PhysicalSection data={data} actions={actions} />}
            {activeTab === 'intelligence' && <IntelligenceSection data={data} actions={actions} />}
            {activeTab === 'skills' && <SkillsSection data={data} actions={actions} />}
            {activeTab === 'wealth' && <WealthSection data={data} actions={actions} />}
            {activeTab === 'settings' && <SettingsSection data={data} actions={actions} />}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#dbd7d2]/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-300 dark:border-slate-800 p-3 grid grid-cols-6 gap-1 z-50">
            <TabButton id="dashboard" icon={LayoutDashboard} label="Home" />
            <TabButton id="physical" icon={Dumbbell} label="Body" />
            <TabButton id="intelligence" icon={Brain} label="Mind" />
            <TabButton id="skills" icon={Target} label="Skills" />
            <TabButton id="wealth" icon={DollarSign} label="Wealth" />
            <TabButton id="settings" icon={SettingsIcon} label="Settings" />
          </nav>
        </>
      )}
    </div>
  );
};

export default App;
