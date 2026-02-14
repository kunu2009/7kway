
import { AppData, Area } from './types';

const STORAGE_KEY = '7k_ecosystem_growth_v2';

const INITIAL_DATA: AppData = {
  user: {
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    faceType: ''
  },
  onboardingCompleted: false,
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
    { 
      id: 'e1', 
      subject: 'Political Science', 
      date: '2025-02-18', 
      type: 'board',
      studyMaterials: [
        { id: 'sm1', title: 'Chapter 1: Cold War Era Notes', url: 'https://example.com/notes1' },
        { id: 'sm2', title: 'Imp Questions 2024', url: 'https://example.com/imp-q' }
      ]
    },
    { 
      id: 'e2', 
      subject: 'Economics', 
      date: '2025-02-24', 
      type: 'board',
      studyMaterials: [
        { id: 'sm3', title: 'Macroeconomics Formulas', url: 'https://example.com/macro' },
        { id: 'sm4', title: 'Indian Eco Development Summary', url: 'https://example.com/ied' }
      ]
    },
    { 
      id: 'e3', 
      subject: 'History', 
      date: '2025-03-15', 
      type: 'board',
      studyMaterials: [
        { id: 'sm5', title: 'Map Work Practice', url: 'https://example.com/maps' }
      ]
    },
    { 
      id: 'e4', 
      subject: 'MHCET 5 Year LLB', 
      date: '2025-05-08', 
      type: 'entrance',
      studyMaterials: [
        { id: 'sm6', title: 'Legal Aptitude Mock', url: 'https://example.com/legal' }
      ]
    },
  ],
  tasks: [
    { id: 't1', title: 'Revise Pol Sci Chapter 2', completed: false, isPriority: true, createdAt: new Date().toISOString() },
    { id: 't2', title: 'Solve 1 Previous Year Paper', completed: false, isPriority: true, createdAt: new Date().toISOString() },
    { id: 't3', title: 'Organize study desk', completed: true, isPriority: false, createdAt: new Date().toISOString() },
    { id: 't4', title: 'Review Economics flashcards', completed: false, isPriority: false, createdAt: new Date().toISOString() }
  ],
  physical: {
    waterIntake: 2,
    proteinIntake: 65,
    sleepHours: 7.0,
    weight: 70,
    pbs: {
      pushups: 40,
      pullups: 10,
      squats: 50,
      plank: 120
    }
  },
  settings: {
    dopamineMode: false,
    darkMode: true,
    accentColor: 'teal',
    activeSections: {
      physical: true,
      intelligence: true,
      skills: true,
      wealth: true
    },
    dashboardLayout: ['welcome', 'priority', 'exams', 'tasks', 'calendar', 'stats', 'chart', 'habits']
  },
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    const parsed = JSON.parse(stored);
    return {
      ...INITIAL_DATA,
      ...parsed,
      user: parsed.user || INITIAL_DATA.user,
      onboardingCompleted: parsed.onboardingCompleted ?? false,
      exams: parsed.exams?.map((e: any) => ({
        ...e,
        studyMaterials: e.studyMaterials || [] 
      })) || INITIAL_DATA.exams,
      tasks: parsed.tasks || INITIAL_DATA.tasks,
      physical: { ...INITIAL_DATA.physical, ...parsed.physical },
      settings: {
        ...INITIAL_DATA.settings,
        ...parsed.settings,
        accentColor: parsed.settings?.accentColor || 'teal', // Default for migration
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
