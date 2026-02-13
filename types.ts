export enum Area {
  Physical = 'PHYSICAL',
  Intelligence = 'INTELLIGENCE',
  Skills = 'SKILLS',
  Wealth = 'WEALTH',
  Discipline = 'DISCIPLINE'
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

export type WidgetType = 'welcome' | 'stats' | 'chart' | 'habits' | 'exams' | 'calendar';

export interface AppSettings {
  dopamineMode: boolean;
  darkMode: boolean;
  activeSections: {
    physical: boolean;
    intelligence: boolean;
    skills: boolean;
    wealth: boolean;
  };
  dashboardLayout: WidgetType[];
}

export interface AppData {
  stats: UserStats;
  habits: Habit[];
  projects: Project[];
  logs: LogEntry[];
  exams: Exam[];
  settings: AppSettings;
}