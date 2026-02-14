
export enum Area {
  Physical = 'PHYSICAL',
  Intelligence = 'INTELLIGENCE',
  Skills = 'SKILLS',
  Wealth = 'WEALTH',
  Discipline = 'DISCIPLINE'
}

export type FitnessGoal = 'bulk' | 'shredded' | 'sleeper-build' | 'athletic';

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

export type WidgetType = 'welcome' | 'stats' | 'chart' | 'habits' | 'exams' | 'calendar' | 'priority' | 'tasks';

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
  pbs: {
    pushups: number;
    pullups: number;
    squats: number;
    plank: number; // seconds
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
}
