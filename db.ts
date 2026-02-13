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
  exams: [
    { id: 'e1', subject: 'Political Science', date: '2025-02-18', type: 'board' },
    { id: 'e2', subject: 'Economics', date: '2025-02-24', type: 'board' },
    { id: 'e3', subject: 'History', date: '2025-03-15', type: 'board' },
    { id: 'e4', subject: 'MHCET 5 Year LLB', date: '2025-05-08', type: 'entrance' },
  ],
  settings: {
    dopamineMode: false,
    darkMode: true,
    activeSections: {
      physical: true,
      intelligence: true,
      skills: true,
      wealth: true
    },
    dashboardLayout: ['welcome', 'exams', 'calendar', 'stats', 'chart', 'habits']
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
      exams: parsed.exams || INITIAL_DATA.exams, // Ensure exams exist if loading old data
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