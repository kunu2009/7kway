
export enum Area {
  Physical = 'PHYSICAL',
  Intelligence = 'INTELLIGENCE',
  Skills = 'SKILLS',
  Wealth = 'WEALTH',
  Discipline = 'DISCIPLINE'
}

export type FitnessGoal = 'bulk' | 'shredded' | 'sleeper-build' | 'athletic';

export type SkillCategory = 'puzzles' | 'music' | 'games' | 'languages' | 'technical' | 'sports' | 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  hoursLogged: number;
  lastPracticed: string;
  targetHours: number;
  notes: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  type: 'freelance' | 'app' | 'job' | 'other';
  amount: number;
  date: string;
  recurring: boolean;
}

export interface PomodoroSession {
  id: string;
  subject: string;
  duration: number; // minutes
  completedAt: string;
  type: 'study' | 'work' | 'skill';
}

export interface DisciplineStats {
  noFapStreak: number;
  noFapLastRelapse: string;
  noFapBestStreak: number;
  coldShowerStreak: number;
  wakeUpStreak: number; // days woke up on time
  targetWakeTime: string; // "05:30"
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActive: string; // ISO date
}

export interface Habit {
  id: string;
  name: string;
  category: Area;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // ['2023-10-01', ...]
  xpValue: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed';
  monetized: boolean;
  income: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'xp' | 'income' | 'measurement';
  value: number;
  label: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  url: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  type: 'board' | 'entrance';
  studyMaterials?: StudyMaterial[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isPriority: boolean; // true = Priority Board, false = Daily Task
  createdAt: string;
}

export type WidgetType = 'welcome' | 'stats' | 'chart' | 'habits' | 'exams' | 'calendar' | 'priority' | 'tasks' | 'pomodoro' | 'nofap' | 'discipline' | 'skills' | 'wealth';

export type AccentColor = 'teal' | 'cyan' | 'violet' | 'rose' | 'orange';

export interface AppSettings {
  dopamineMode: boolean;
  darkMode: boolean;
  accentColor: AccentColor;
  activeSections: {
    physical: boolean;
    intelligence: boolean;
    skills: boolean;
    wealth: boolean;
  };
  dashboardLayout: WidgetType[];
}

export interface PhysicalStats {
  waterIntake: number; // glasses (target 8)
  proteinIntake: number; // grams
  sleepHours: number;
  weight: number; // kg
  height: number; // cm - track height changes
  hangingMinutes: number; // daily hanging for height
  pbs: {
    pushups: number;
    pullups: number;
    squats: number;
    plank: number; // seconds
  };
  measurements: {
    chest: number;
    waist: number;
    biceps: number;
    thighs: number;
  };
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  faceType: string; // e.g., 'diamond', 'oval'
  goal: FitnessGoal;
}

export interface AppData {
  user: UserProfile;
  onboardingCompleted: boolean;
  stats: UserStats;
  habits: Habit[];
  projects: Project[];
  logs: LogEntry[];
  exams: Exam[];
  tasks: Task[];
  physical: PhysicalStats;
  settings: AppSettings;
  // New additions
  skills: Skill[];
  income: IncomeSource[];
  pomodoroSessions: PomodoroSession[];
  discipline: DisciplineStats;
  totalEarnings: number;
}
