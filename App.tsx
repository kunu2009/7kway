
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
  Droplets, Moon, Utensils, TrendingUp, Scale, Minus, UserCircle, ScanFace, Ruler, Weight,
  Palette, Sun, Moon as MoonIcon, Sparkles, Activity
} from 'lucide-react';
import { Area, AppData, Habit, Project, LogEntry, WidgetType, Exam, Task, StudyMaterial, AccentColor } from './types';
import { loadData, saveData, APP_VERSION } from './db';

// Undo Types
type UndoAction = 
  | { type: 'TASK_DELETE'; payload: Task }
  | { type: 'MATERIAL_DELETE'; payload: { examId: string; material: StudyMaterial } };

// --- Onboarding Component ---
const OnboardingOverlay = ({ onComplete, accent }: { onComplete: (userData: any) => void, accent: string }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    faceType: ''
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

  const handleFinish = () => {
    onComplete(formData);
  };

  const slides = [
    {
      title: "Identity Setup",
      content: (
        <div className="space-y-4 animate-in slide-in-from-right duration-300">
           <div className="space-y-2">
             <label className={`text-xs text-${accent}-400 font-bold uppercase ml-1`}>Codename / Name</label>
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
               <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                 <Clock className="text-slate-400" size={18} />
                 <input 
                   type="number" 
                   placeholder="18" 
                   className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full"
                   value={formData.age}
                   onChange={(e) => setFormData({...formData, age: e.target.value})}
                 />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Face Shape</label>
               <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                 <ScanFace className="text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Oval" 
                   className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full"
                   value={formData.faceType}
                   onChange={(e) => setFormData({...formData, faceType: e.target.value})}
                 />
               </div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Height (cm)</label>
               <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                 <Ruler className="text-slate-400" size={18} />
                 <input 
                   type="number" 
                   placeholder="175" 
                   className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full"
                   value={formData.height}
                   onChange={(e) => setFormData({...formData, height: e.target.value})}
                 />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase ml-1">Weight (kg)</label>
               <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                 <Weight className="text-slate-400" size={18} />
                 <input 
                   type="number" 
                   placeholder="70" 
                   className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full"
                   value={formData.weight}
                   onChange={(e) => setFormData({...formData, weight: e.target.value})}
                 />
               </div>
             </div>
           </div>
        </div>
      )
    },
    {
      title: "System Overview",
      content: (
        <div className="text-center space-y-6 animate-in slide-in-from-right duration-300">
           <div className={`w-24 h-24 bg-${accent}-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-${accent}-500/20 shadow-[0_0_30px_rgba(20,184,166,0.2)]`}>
              <LayoutDashboard size={40} className={`text-${accent}-400`} />
           </div>
           <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
             Welcome to the <span className={`text-${accent}-500 dark:text-${accent}-400 font-bold`}>7K Ecosystem</span>. This is not just a to-do list; it is a character sheet for your life.
           </p>
           <ul className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <li className="flex gap-2"><CheckCircle2 size={16} className={`text-${accent}-500 shrink-0`}/> Track Exams & Study Materials</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className={`text-${accent}-500 shrink-0`}/> Bio-Hack your Physical Stats</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className={`text-${accent}-500 shrink-0`}/> Build Wealth & Skills</li>
           </ul>
        </div>
      )
    },
    {
      title: "Gamification",
      content: (
        <div className="text-center space-y-6 animate-in slide-in-from-right duration-300">
           <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <Trophy size={40} className="text-purple-400" />
           </div>
           <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
             Everything you do earns <span className="text-purple-400 font-bold">XP</span>.
           </p>
           <div className="grid grid-cols-2 gap-3 text-left">
              {[
                  { l: 'Habits', v: '+50 XP' }, { l: 'Workouts', v: '+100 XP' },
                  { l: 'Study', v: '+80 XP' }, { l: 'Projects', v: '+200 XP' }
              ].map(i => (
                  <div key={i.l} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs text-slate-500 uppercase">{i.l}</span>
                    <p className={`text-${accent}-600 dark:text-${accent}-400 font-bold`}>{i.v}</p>
                  </div>
              ))}
           </div>
        </div>
      )
    },
    {
      title: "Ready?",
      content: (
        <div className="text-center space-y-6 animate-in slide-in-from-right duration-300">
           <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Zap size={40} className="text-emerald-400" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Protocol Initiated.</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm">
             Your stats have been initialized. <br/> It is time to level up.
           </p>
           <button 
             onClick={handleFinish}
             className={`w-full bg-gradient-to-r from-${accent}-500 to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-${accent}-500/20 hover:scale-[1.02] transition-transform`}
           >
             Enter System
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-[#dbd7d2] dark:bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8 justify-center">
           {slides.map((_, i) => (
             <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === step ? `w-8 bg-${accent}-500` : 'w-2 bg-slate-300 dark:bg-slate-800'}`} 
             />
           ))}
        </div>

        <h1 className={`text-3xl font-black text-center mb-2 bg-gradient-to-r from-${accent}-500 to-emerald-500 bg-clip-text text-transparent`}>
          {slides[step].title}
        </h1>
        
        <div className="min-h-[300px] flex flex-col justify-center my-6">
          {slides[step].content}
        </div>

        {step < slides.length - 1 && (
          <button 
            onClick={handleNext}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// --- Shared Components ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>}
  </div>
);

interface ExamItemProps {
  exam: Exam; 
  onAddMaterial: (id: string, title: string, url: string) => void; 
  onDeleteMaterial: (examId: string, matId: string) => void;
  accent: string;
}

const ExamItem: React.FC<ExamItemProps> = ({ exam, onAddMaterial, onDeleteMaterial, accent }) => {
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
    <div className={`rounded-xl border transition-all duration-300 ${isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${exam.type === 'board' ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400' : 'bg-purple-500/20 text-purple-500 dark:text-purple-400'}`}>
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">{exam.subject}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {exam.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {isPast ? (
                <span className="text-xs font-bold text-slate-500">Done</span>
            ) : (
              <>
                <p className={`text-xl font-bold ${isUrgent ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{daysLeft}</p>
                <p className="text-[10px] text-slate-500">days left</p>
              </>
            )}
          </div>
          {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="h-px w-full bg-slate-200 dark:bg-slate-800 mb-4" />
          
          <h5 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <BookOpen size={14} /> Study Materials
          </h5>

          <div className="space-y-2 mb-4">
            {exam.studyMaterials && exam.studyMaterials.length > 0 ? (
              exam.studyMaterials.map(mat => (
                <div key={mat.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                  <a href={mat.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm text-${accent}-600 dark:text-${accent}-400 hover:text-${accent}-500 truncate max-w-[200px]`}>
                    <LinkIcon size={12} />
                    <span className="truncate">{mat.title}</span>
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteMaterial(exam.id, mat.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-600 dark:text-slate-500 italic">No materials added yet.</p>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Add New Resource</p>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Title (e.g., Chapter 1 Notes)" 
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-${accent}-500/50`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="URL" 
                  className={`flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-${accent}-500/50`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  onClick={handleAdd}
                  className={`bg-${accent}-500 hover:bg-${accent}-400 text-white p-2 rounded transition-colors`}
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

// --- Section Components ---
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
  const heightHabits = data.habits.filter(h => h.name.toLowerCase().includes('height') || h.name.toLowerCase().includes('hanging') || h.name.toLowerCase().includes('posture'));
  const faceHabits = data.habits.filter(h => h.name.toLowerCase().includes('mewing') || h.name.toLowerCase().includes('face') || h.name.toLowerCase().includes('jaw'));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className={`bg-gradient-to-br from-${accent}-500/10 to-indigo-500/10 border border-${accent}-500/20 rounded-2xl p-6 relative overflow-hidden`}>
         <div className="flex items-center gap-4 relative z-10">
            <div className={`w-14 h-14 bg-${accent}-500/20 rounded-full flex items-center justify-center border border-${accent}-500/30`}>
               <UserCircle className={`text-${accent}-500`} size={32} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{data.user.name}</h3>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 uppercase">Age {data.user.age}</span>
                  <span className={`text-[10px] font-bold bg-${accent}-500/20 px-2 py-0.5 rounded text-${accent}-600 dark:text-${accent}-400 uppercase`}>{data.user.faceType} Face</span>
               </div>
            </div>
         </div>
         <Activity className={`absolute top-4 right-4 text-${accent}-500/20`} size={48} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
            { label: 'Current Height', val: data.user.height, icon: Ruler, color: 'emerald', suffix: 'cm' },
            { label: 'Body Weight', val: data.physical.weight, icon: Weight, color: 'blue', suffix: 'kg' },
            { label: 'Water Intake', val: data.physical.waterIntake, icon: Droplets, color: 'cyan', suffix: 'gl' },
            { label: 'Sleep Hours', val: data.physical.sleepHours, icon: Moon, color: 'violet', suffix: 'h' }
        ].map((item: any) => (
            <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <item.icon size={14} className={`text-${item.color}-500`} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{item.val}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{item.suffix}</span>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 bg-${item.color}-500/20 w-full`}>
                   <div className={`h-full bg-${item.color}-500`} style={{ width: '40%' }} />
                </div>
            </div>
        ))}
      </div>

      {/* Height Potential Module */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUp size={18} className="text-emerald-500" /> Vertical Growth Protocol
            </h4>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase">Target: +2cm Posture</span>
          </div>
          <div className="space-y-3">
             {heightHabits.map(habit => {
               const today = new Date().toISOString().split('T')[0];
               const isDone = habit.completedDates.includes(today);
               return (
                 <button 
                  key={habit.id}
                  onClick={() => actions.toggleHabit(habit.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/50'
                  }`}
                 >
                   <span className={`text-xs font-bold ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{habit.name}</span>
                   {isDone ? <CheckCircle2 size={16} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                 </button>
               );
             })}
          </div>
      </div>

      {/* Face Aesthetics Module */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScanFace size={18} className="text-purple-500" /> Aesthetics & Structure
            </h4>
            <span className="text-[10px] font-black text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full uppercase">Focus: {data.user.faceType} Optimization</span>
          </div>
          <div className="space-y-3">
             {faceHabits.map(habit => {
               const today = new Date().toISOString().split('T')[0];
               const isDone = habit.completedDates.includes(today);
               return (
                 <button 
                  key={habit.id}
                  onClick={() => actions.toggleHabit(habit.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isDone ? 'bg-purple-500/10 border-purple-500/30' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/50'
                  }`}
                 >
                   <span className={`text-xs font-bold ${isDone ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`}>{habit.name}</span>
                   {isDone ? <CheckCircle2 size={16} className="text-purple-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                 </button>
               );
             })}
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500 dark:text-yellow-400" /> Physical Performance (PBs)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.physical.pbs).map(([key, val]) => (
              <div key={key} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">{key}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={val}
                      onChange={(e) => actions.updatePB(key as keyof typeof data.physical.pbs, parseInt(e.target.value) || 0)}
                      className={`bg-transparent w-full text-lg font-black text-${accent}-600 dark:text-${accent}-400 focus:outline-none`}
                    />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{key === 'plank' ? 's' : 'rep'}</span>
                  </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

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

      <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Brain size={16} /> Study Protocols
          </h4>
          {intelHabits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isDone = habit.completedDates.includes(today);
            return (
              <button 
                key={habit.id}
                onClick={() => actions.toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDone ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-100' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{habit.name}</span>
                {isDone ? <CheckCircle2 size={18} className="text-blue-500 dark:text-blue-400" /> : <div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600" />}
              </button>
            );
          })}
      </div>
    </div>
  );
};

const SkillsSection: React.FC<SectionProps> = ({ data, actions }) => {
  const skillHabits = data.habits.filter(h => h.category === Area.Skills);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="Skill Tree" subtitle="Talent stacking" />
      
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <Music size={24} className="mx-auto text-purple-500 dark:text-purple-400 mb-2" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Music</p>
              <p className="text-xs text-slate-500">Lv. 3</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <Share2 size={24} className="mx-auto text-pink-500 dark:text-pink-400 mb-2" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Social</p>
              <p className="text-xs text-slate-500">Lv. 5</p>
          </div>
      </div>

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
                  isDone ? 'bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-100' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{habit.name}</span>
                {isDone ? <CheckCircle2 size={18} className="text-purple-500 dark:text-purple-400" /> : <div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600" />}
              </button>
            );
          })}
      </div>
    </div>
  );
};

const WealthSection: React.FC<SectionProps> = ({ data, actions }) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = () => {
      if(!newProjectName.trim()) return;
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        title: newProjectName,
        description: "New initiative",
        status: 'planning',
        monetized: false,
        income: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium'
      };
      actions.setData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
      setNewProjectName('');
      actions.addXP(50, 'Project Created');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="Wealth" subtitle="Resource generation" />

      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
              <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider mb-1">Total MRR</p>
              <h3 className="text-3xl font-black text-white">$0.00</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-emerald-400" />
          </div>
      </div>

      <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Projects</h4>
          </div>

          <div className="flex gap-2 mb-4">
              <input 
                  type="text" 
                  placeholder="New Project Name..." 
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
              />
              <button 
                  onClick={handleCreateProject}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg shadow-sm"
              >
                  <Plus size={20} />
              </button>
          </div>

          {data.projects.map(project => (
              <div key={project.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                      <div>
                          <h5 className="font-bold text-slate-900 dark:text-white">{project.title}</h5>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${
                              project.status === 'planning' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 
                              project.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' : 
                              'bg-emerald-500/10 text-emerald-500'
                          }`}>{project.status}</span>
                      </div>
                      <button className="text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-3" />
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>Due: {project.dueDate}</span>
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">${project.income}</span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

const SettingsSection: React.FC<SectionProps> = ({ data, actions }) => {
  const { accent } = actions;
  
  const colors: AccentColor[] = ['teal', 'cyan', 'violet', 'rose', 'orange'];

  const toggleDarkMode = () => {
      actions.setData(prev => ({ 
          ...prev, 
          settings: { ...prev.settings, darkMode: !prev.settings.darkMode } 
      }));
  };

  const setAccent = (color: AccentColor) => {
      actions.setData(prev => ({ 
          ...prev, 
          settings: { ...prev.settings, accentColor: color } 
      }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionHeader title="System" subtitle="Meta-configuration" />

      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">User Profile</h4>
              <div className="text-sm text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-2 mt-2">
                  <div>Name: <span className="text-slate-900 dark:text-white">{data.user.name}</span></div>
                  <div>Level: <span className={`text-${accent}-500 dark:text-${accent}-400 font-black`}>{actions.level}</span></div>
                  <div>Face: <span className="text-slate-900 dark:text-white">{data.user.faceType}</span></div>
                  <div>Age: <span className="text-slate-900 dark:text-white">{data.user.age}</span></div>
              </div>
          </div>
      </div>

      {/* Aesthetics Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Palette size={18} className={`text-${accent}-500`} /> System Styling
          </h4>
          
          <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-600 dark:text-slate-300">Theme Mode</span>
              <button 
                onClick={toggleDarkMode}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                  {data.settings.darkMode ? (
                      <><MoonIcon size={14} className="text-indigo-400" /><span className="text-xs font-bold text-slate-300">Dark</span></>
                  ) : (
                      <><Sun size={14} className="text-amber-500" /><span className="text-xs font-bold text-slate-600">Light</span></>
                  )}
              </button>
          </div>

          <div>
              <span className="text-sm text-slate-600 dark:text-slate-300 block mb-3">System Accent</span>
              <div className="flex gap-3">
                  {colors.map(c => (
                      <button 
                        key={c}
                        onClick={() => setAccent(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${data.settings.accentColor === c ? 'border-white ring-2 ring-slate-400 dark:ring-slate-500 scale-110' : 'border-transparent'}`}
                      >
                         <div className={`w-full h-full rounded-full bg-${c}-500`} />
                      </button>
                  ))}
              </div>
          </div>
      </div>
      
      <div className="space-y-4">
          <button 
              onClick={() => {
                  if(confirm('Reset all progress? This cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                  }
              }}
              className="w-full py-3 bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
          >
              Factory Reset
          </button>
      </div>

      <div className="text-center space-y-4 pt-8">
          <div className="flex justify-center">
             <span className={`text-[10px] font-black tracking-widest text-${accent}-500/50 uppercase bg-${accent}-500/5 px-3 py-1 rounded-full border border-${accent}-500/10`}>
                Build Version: {APP_VERSION}
             </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
              <p className="mb-2 font-bold tracking-tight">7K ECOSYSTEM | GROWTH SYSTEM</p>
              <div className="flex justify-center gap-4 mb-4">
                  <a href="#" className={`hover:text-${accent}-400`}><LayoutDashboard size={18} /></a>
                  <a href="#" className="hover:text-pink-400"><Instagram size={18} /></a>
                  <a href="#" className="hover:text-white"><Github size={18} /></a>
                  <a href="mailto:kunal@7kc.me" className="hover:text-blue-400"><Mail size={18} /></a>
              </div>
              <p>© 2025 7K Ecosystem. Neo Protocol Active.</p>
          </div>
      </div>
    </div>
  );
};

// --- App Component ---
const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'physical' | 'intelligence' | 'skills' | 'wealth' | 'settings'>('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Computed Accent Color
  const accent = data.settings.accentColor || 'teal';

  // Apply Dark Mode Class
  useEffect(() => {
    if (data.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.settings.darkMode]);
  
  // Undo State
  const [undoStack, setUndoStack] = useState<UndoAction | null>(null);
  const [undoTimer, setUndoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            setTimeout(() => {
                splash.remove();
            }, 600);
        }
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (userData: any) => {
      setData(prev => ({
          ...prev,
          user: {
              ...prev.user,
              ...userData,
              age: parseInt(userData.age) || 0,
              height: parseInt(userData.height) || 0,
              weight: parseInt(userData.weight) || 0
          },
          physical: {
            ...prev.physical,
            weight: parseInt(userData.weight) || prev.physical.weight 
          },
          onboardingCompleted: true
      }));
  };

  useEffect(() => {
    saveData(data);
  }, [data]);

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
        logs: [newLog, ...prev.logs].slice(0, 500) 
      };
    });
  }, []);

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

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      let xpChange = 0;
      let newLog: LogEntry | null = null;
      
      const newHabits = prev.habits.map(h => {
        if (h.id === id) {
          const isDone = h.completedDates.includes(today);
          if (isDone) {
            xpChange = -h.xpValue;
            return { ...h, completedDates: h.completedDates.filter(d => d !== today) };
          } else {
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

  // Shared Actions Object
  const actions = {
    updatePhysicalStat,
    updatePB,
    addXP,
    toggleHabit,
    addStudyMaterial,
    deleteStudyMaterial,
    setData,
    level,
    accent
  };

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => {
    if (id !== 'dashboard' && id !== 'settings') {
      const sectionKey = id as keyof typeof data.settings.activeSections;
      if (!data.settings.activeSections[sectionKey]) return null;
    }

    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
          activeTab === id ? `text-${accent}-500 dark:text-${accent}-400 bg-${accent}-500/10` : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Icon size={20} />
        <span className="text-[10px] mt-1 font-medium">{label}</span>
      </button>
    );
  };

  const XPHeader = () => (
    <div className="sticky top-0 z-50 bg-[#dbd7d2]/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-300 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg bg-${accent}-500 flex items-center justify-center shadow-lg shadow-${accent}-500/20`}>
            <Trophy className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Lv. {level}</h1>
            <p className={`text-[10px] text-${accent}-600 dark:text-${accent}-400 font-black`}>{xpInCurrentLevel} / 1000 XP</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full text-xs font-black border border-orange-500/20">
            <Flame size={14} /> {data.stats.streak}
          </div>
          <Sparkles className={`text-${accent}-500 dark:text-${accent}-400 animate-pulse`} size={18} />
        </div>
      </div>
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full bg-gradient-to-r from-${accent}-500 to-emerald-400 transition-all duration-500 ease-out`} 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );

  const Dashboard = () => {
    const chartData = useMemo(() => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
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

    const PriorityWidget = () => {
        const [newTask, setNewTask] = useState('');
        const priorityTasks = data.tasks.filter(t => t.isPriority);

        return (
            <div key="priority" className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6 relative overflow-hidden bg-white dark:bg-transparent shadow-sm dark:shadow-none">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Flag size={64} className="text-purple-500"/>
                </div>
                <div className="relative z-10">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <Flag size={18} className="text-purple-500 dark:text-purple-400" /> Critical Mission Board
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Immediate operational priorities</p>
                    
                    <div className="space-y-2 mb-4">
                        {priorityTasks.length === 0 && <p className="text-xs text-slate-500 italic">No priorities set.</p>}
                        {priorityTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-500/10 group">
                                <button onClick={() => toggleTask(task.id)} className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors shrink-0">
                                    {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                </button>
                                <span 
                                    onClick={() => toggleTask(task.id)}
                                    className={`flex-1 text-sm font-medium cursor-pointer select-none transition-colors hover:text-purple-600 dark:hover:text-purple-300 ${task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-100'}`}
                                >
                                    {task.title}
                                </span>
                                <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Set new mission..." 
                            className="flex-1 bg-white dark:bg-slate-900/80 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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

    const TasksWidget = () => {
        const [newTask, setNewTask] = useState('');
        const normalTasks = data.tasks.filter(t => !t.isPriority);

        return (
            <div key="tasks" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity size={16} className={`text-${accent}-500 dark:text-${accent}-400`} /> Daily Operations
                </h4>
                
                <div className="space-y-2 mb-4">
                     {normalTasks.length === 0 && <p className="text-xs text-slate-500 italic">System clear. No pending tasks.</p>}
                     {normalTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
                            <button onClick={() => toggleTask(task.id)} className={`text-slate-400 hover:text-${accent}-500 transition-colors shrink-0`}>
                                {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>
                            <span 
                                onClick={() => toggleTask(task.id)}
                                className={`flex-1 text-sm cursor-pointer select-none transition-colors hover:text-${accent}-500 ${task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}
                            >
                                {task.title}
                            </span>
                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-1">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 items-center mt-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                    <Plus size={14} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Log new operation..." 
                        className="flex-1 bg-transparent border-none text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (addTask(newTask, false), setNewTask(''))}
                    />
                     <button 
                        onClick={() => { addTask(newTask, false); setNewTask(''); }}
                        className={`text-xs font-black text-${accent}-600 dark:text-${accent}-400 uppercase tracking-tighter`}
                    >
                        COMMIT
                    </button>
                </div>
            </div>
        );
    };

    const widgetComponents = {
      welcome: (
        <div key="welcome" className={`bg-${accent}-500/10 border border-${accent}-500/20 rounded-2xl p-6 text-center mb-6`}>
          <p className={`text-${accent}-600 dark:text-${accent}-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1`}>Active Profile: {data.user?.name || 'User'}</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Focus: Board Peak & Growth</h3>
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
                accent={accent}
              />
            ))}
          </div>
        </div>
      ),
      calendar: (
        <div key="calendar" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold text-sm flex items-center gap-2 uppercase tracking-tighter"><CalendarIcon size={16} className={`text-${accent}-500`}/> Schedule Matrix</h4>
             <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date().toLocaleString('default', { month: 'long' })}</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] text-slate-400 font-bold">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {(() => {
              const today = new Date();
              const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
              const els = [];
              
              for(let i=0; i<firstDay; i++) els.push(<div key={`empty-${i}`} className="h-8"></div>);
              
              for(let i=1; i<=daysInMonth; i++) {
                const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
                const isToday = i === today.getDate();
                const exam = data.exams.find(e => e.date === dateStr);
                
                els.push(
                  <div key={i} className={`h-8 flex items-center justify-center rounded-lg text-xs font-black relative ${
                    isToday ? `bg-${accent}-500 text-white shadow-lg shadow-${accent}-500/30` : 
                    exam ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30' : 
                    'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}>
                    {i}
                    {exam && <div className="absolute bottom-1 w-1 h-1 bg-purple-500 rounded-full"></div>}
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-slate-500 text-[10px] font-black uppercase">Efficiency</p>
              <CheckCircle2 size={16} className={`text-${accent}-500`} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{completionRate.toFixed(0)}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-slate-500 text-[10px] font-black uppercase">Concentration</p>
              <Zap size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">High</p>
          </div>
        </div>
      ),
      chart: (
        <div key="chart" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-4 tracking-widest">Growth Velocity (XP)</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? `var(--color-${String(accent)}-500, #14b8a6)` : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
      habits: (
        <div key="habits" className="space-y-3 mb-6">
          <SectionHeader title="Daily Quests" subtitle="Execute these for XP accumulation" />
          {data.habits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isDone = habit.completedDates.includes(today);
            return (
              <button 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isDone ? `bg-${accent}-500/10 border-${accent}-500/40 text-${accent}-600 dark:text-${accent}-100` : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDone ? `bg-${accent}-500 text-white` : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {habit.category === Area.Physical && <Dumbbell size={18} />}
                    {habit.category === Area.Intelligence && <Brain size={18} />}
                    {habit.category === Area.Skills && <Box size={18} />}
                    {habit.category === Area.Discipline && <Shield size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm tracking-tight">{habit.name}</p>
                    <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">{habit.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${isDone ? `text-${accent}-500` : 'text-slate-500'}`}>+{habit.xpValue} XP</p>
                  {isDone && <CheckCircle2 size={16} className={`ml-auto mt-1 text-${accent}-500`} />}
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

  return (
    <div className={`max-w-md mx-auto min-h-screen bg-[#dbd7d2] dark:bg-slate-950 flex flex-col relative pb-20 shadow-2xl shadow-${accent}-500/5 transition-colors duration-300`}>
      {!data.onboardingCompleted ? (
          <OnboardingOverlay onComplete={handleOnboardingComplete} accent={accent} />
      ) : (
        <>
          <XPHeader />
          
          <main className="flex-1 p-5 overflow-y-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'physical' && <PhysicalSection data={data} actions={actions} />}
            {activeTab === 'intelligence' && <IntelligenceSection data={data} actions={actions} />}
            {activeTab === 'skills' && <SkillsSection data={data} actions={actions} />}
            {activeTab === 'wealth' && <WealthSection data={data} actions={actions} />}
            {activeTab === 'settings' && <SettingsSection data={data} actions={actions} />}
          </main>

          {undoStack && (
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-4 z-50 animate-in slide-in-from-bottom-10 duration-300 border border-slate-700">
                <span className="text-xs font-bold flex items-center gap-2">
                    <RotateCcw size={16} className={`text-${accent}-500`} /> Command Reversed
                </span>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleUndo} 
                        className={`bg-${accent}-500 text-white px-3 py-1 rounded text-[10px] font-black uppercase`}
                    >
                        Undo
                    </button>
                    <button onClick={() => setUndoStack(null)} className="text-slate-500 hover:text-white">
                        <X size={16}/>
                    </button>
                </div>
            </div>
          )}

          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#dbd7d2]/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-300 dark:border-slate-800 px-2 py-3 grid grid-cols-6 gap-1 z-50 shadow-2xl shadow-black/50">
            <TabButton id="dashboard" icon={LayoutDashboard} label="Home" />
            <TabButton id="physical" icon={Dumbbell} label="Body" />
            <TabButton id="intelligence" icon={Brain} label="Mind" />
            <TabButton id="skills" icon={Target} label="Skills" />
            <TabButton id="wealth" icon={DollarSign} label="Wealth" />
            <TabButton id="settings" icon={Settings} label="Meta" />
          </nav>
        </>
      )}
    </div>
  );
};

export default App;
