
import { AppData, Area } from './types';

const STORAGE_KEY = '7k_ecosystem_growth_v2';
export const APP_VERSION = '1.3.0-ELITE';

const INITIAL_DATA: AppData = {
  user: {
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    faceType: '',
    goal: 'sleeper-build'
  },
  onboardingCompleted: false,
  stats: {
    xp: 0,
    level: 1,
    streak: 0,
    lastActive: new Date().toISOString(),
  },
  habits: [
    { id: 'h1', name: '7h+ Sleep (Growth Hormone)', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 50 },
    { id: 'h2', name: 'Posture Wall-Stretches', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 30 },
    { id: 'h3', name: 'Board Prep (Deep Work)', category: Area.Intelligence, frequency: 'daily', completedDates: [], xpValue: 100 },
    { id: 'h4', name: 'Active Mewing (Face Posture)', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 40 },
    { id: 'h5', name: 'Spinal Decompression (Hanging)', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 50 },
    { id: 'h6', name: 'Language Acquisition (30m)', category: Area.Skills, frequency: 'daily', completedDates: [], xpValue: 40 },
    { id: 'h7', name: 'Social Interaction Challenge', category: Area.Skills, frequency: 'daily', completedDates: [], xpValue: 60 },
    { id: 'h8', name: 'Cold Shower (Discipline)', category: Area.Discipline, frequency: 'daily', completedDates: [], xpValue: 75 },
    { id: 'h9', name: 'Face Yoga (Symmetry)', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 40 },
  ],
  projects: [],
  logs: [],
  // Adding more preloaded study materials to provide a better initial experience for students
  exams: [
    { 
      id: 'e1', 
      subject: 'Political Science', 
      date: '2025-02-18', 
      type: 'board',
      studyMaterials: [
        { id: 'sm1', title: 'Chapter 1: The Cold War Era', url: 'https://ncert.nic.in/textbook.php?feps1=1-9' },
        { id: 'sm2', title: 'Chapter 2: The End of Bipolarity', url: 'https://ncert.nic.in/textbook.php?feps1=2-9' },
        { id: 'sm10', title: '2024 Solved Sample Paper', url: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/PolScience-SQP.pdf' },
        { id: 'sm14', title: 'Chapter 3: Contemporary South Asia', url: 'https://ncert.nic.in/textbook.php?feps1=3-9' },
        { id: 'sm15', title: 'Chapter 4: International Organisations', url: 'https://ncert.nic.in/textbook.php?feps1=4-9' }
      ]
    },
    { 
      id: 'e2', 
      subject: 'Economics', 
      date: '2025-02-24', 
      type: 'board',
      studyMaterials: [
        { id: 'sm3', title: 'Macroeconomics Formulas Sheet', url: 'https://example.com/macro-formulas' },
        { id: 'sm4', title: 'Indian Eco: Rural Development', url: 'https://ncert.nic.in/textbook.php?leec2=6-10' },
        { id: 'sm11', title: 'Money & Banking Flashcards', url: 'https://quizlet.com/search?query=economics-class-12' },
        { id: 'sm16', title: 'National Income PDF Notes', url: 'https://ncert.nic.in/textbook.php?leec1=1-6' },
        { id: 'sm17', title: 'Government Budgeting Guide', url: 'https://ncert.nic.in/textbook.php?leec1=5-6' }
      ]
    },
    { 
      id: 'e3', 
      subject: 'History', 
      date: '2025-03-15', 
      type: 'board',
      studyMaterials: [
        { id: 'sm5', title: 'Map Work: Harappan Sites', url: 'https://example.com/history-maps' },
        { id: 'sm12', title: 'Bhakti-Sufi Traditions PDF', url: 'https://ncert.nic.in/textbook.php?lehs2=2-5' },
        { id: 'sm18', title: 'Bricks, Beads and Bones', url: 'https://ncert.nic.in/textbook.php?lehs1=1-4' },
        { id: 'sm19', title: 'Kings and Chronicles', url: 'https://ncert.nic.in/textbook.php?lehs2=4-5' }
      ]
    },
    { 
      id: 'e4', 
      subject: 'MHCET 5 Year LLB', 
      date: '2025-05-08', 
      type: 'entrance',
      studyMaterials: [
        { id: 'sm6', title: 'Legal Reasoning Mock 1', url: 'https://example.com/mhcet-legal' },
        { id: 'sm13', title: 'Current Affairs 2024-25', url: 'https://gktoday.in' },
        { id: 'sm20', title: 'Logical Reasoning Workbook', url: 'https://example.com/mhcet-logic' },
        { id: 'sm21', title: 'Previous Year Question Papers', url: 'https://cetcell.mahacet.org/' }
      ]
    },
  ],
  tasks: [
    { id: 't1', title: 'Complete Mewing Routine (10m)', completed: false, isPriority: true, createdAt: new Date().toISOString() },
    { id: 't2', title: 'Hanging Exercises (3 sets)', completed: false, isPriority: true, createdAt: new Date().toISOString() },
    { id: 't3', title: 'Read Pol Sci Chapter 4', completed: false, isPriority: false, createdAt: new Date().toISOString() },
  ],
  physical: {
    waterIntake: 0,
    proteinIntake: 0,
    sleepHours: 0,
    weight: 0,
    pbs: {
      pushups: 0,
      pullups: 0,
      squats: 0,
      plank: 0
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
        accentColor: parsed.settings?.accentColor || 'teal',
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
