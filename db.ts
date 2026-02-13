
import { AppData, Area } from './types';

const STORAGE_KEY = '7k_ecosystem_growth_v1';

const INITIAL_DATA: AppData = {
  stats: {
    xp: 0,
    level: 1,
    streak: 0,
    lastActive: new Date().toISOString(),
  },
  habits: [
    { id: 'h1', name: '7h+ Sleep (Height)', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 50 },
    { id: 'h2', name: 'Posture Stretching', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 30 },
    { id: 'h3', name: 'Board Prep (2h)', category: Area.Intelligence, frequency: 'daily', completedDates: [], xpValue: 100 },
    { id: 'h4', name: 'Deep Work Session', category: Area.Intelligence, frequency: 'daily', completedDates: [], xpValue: 80 },
    { id: 'h5', name: 'Language Practice', category: Area.Skills, frequency: 'daily', completedDates: [], xpValue: 40 },
    { id: 'h6', name: 'Instrument Practice', category: Area.Skills, frequency: 'daily', completedDates: [], xpValue: 40 },
    { id: 'h7', name: 'Social Skills Challenge', category: Area.Skills, frequency: 'daily', completedDates: [], xpValue: 60 },
    { id: 'h8', name: 'Cold Shower (Discipline)', category: Area.Discipline, frequency: 'daily', completedDates: [], xpValue: 75 },
  ],
  projects: [],
  logs: [],
  settings: {
    dopamineMode: false,
    darkMode: true,
  },
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};