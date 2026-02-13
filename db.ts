import { AppData, Area } from './types';

const STORAGE_KEY = '7k_ecosystem_growth_v2';

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
    activeSections: {
      physical: true,
      intelligence: true,
      skills: true,
      wealth: true
    },
    dashboardLayout: ['welcome', 'stats', 'chart', 'habits']
  },
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    const parsed = JSON.parse(stored);
    // Deep merge to ensure compatibility with new fields
    return {
      ...INITIAL_DATA,
      ...parsed,
      settings: {
        ...INITIAL_DATA.settings,
        ...parsed.settings,
        activeSections: {
          ...INITIAL_DATA.settings.activeSections,
          ...parsed.settings?.activeSections
        },
        dashboardLayout: parsed.settings?.dashboardLayout || INITIAL_DATA.settings.dashboardLayout
      }
    };
  } catch {
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};