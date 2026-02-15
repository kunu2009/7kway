import { AppData, Area } from './types';

const STORAGE_KEY = '7k_ecosystem_growth_v2';
export const APP_VERSION = '2.0.0-KUNAL';

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
    { id: 'h7', name: 'No Fap Day Complete', category: Area.Discipline, frequency: 'daily', completedDates: [], xpValue: 100 },
    { id: 'h8', name: 'Cold Shower (Discipline)', category: Area.Discipline, frequency: 'daily', completedDates: [], xpValue: 75 },
    { id: 'h9', name: 'Face Yoga (Symmetry)', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 40 },
    { id: 'h10', name: 'Workout Complete', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 80 },
    { id: 'h11', name: '3L Water Intake', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 30 },
    { id: 'h12', name: 'SPF Sunscreen Applied', category: Area.Physical, frequency: 'daily', completedDates: [], xpValue: 20 },
  ],
  projects: [
    { id: 'p1', title: '7K Launcher', description: 'Custom Android launcher with Stan AI', status: 'in-progress', monetized: false, income: 0, dueDate: '2026-06-01', priority: 'high' },
    { id: 'p2', title: '7K LawPrep', description: 'CLAT/MHT-CET preparation app', status: 'in-progress', monetized: false, income: 0, dueDate: '2026-04-01', priority: 'high' },
    { id: 'p3', title: '7K Life Dashboard', description: 'This improvement system app', status: 'in-progress', monetized: false, income: 0, dueDate: '2026-03-01', priority: 'high' },
  ],
  logs: [],
  exams: [
    { 
      id: 'e1', 
      subject: 'Political Science', 
      date: '2026-02-18', 
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
      date: '2026-02-24', 
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
      date: '2026-03-15', 
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
      date: '2026-05-08', 
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
    { id: 't2', title: 'Hanging Exercises (20 min)', completed: false, isPriority: true, createdAt: new Date().toISOString() },
    { id: 't3', title: 'Read Economics Chapter 1', completed: false, isPriority: true, createdAt: new Date().toISOString() },
    { id: 't4', title: 'Apply Sunscreen before going out', completed: false, isPriority: false, createdAt: new Date().toISOString() },
  ],
  physical: {
    waterIntake: 0,
    proteinIntake: 0,
    sleepHours: 0,
    weight: 49.9,
    height: 164,
    hangingMinutes: 0,
    pbs: {
      pushups: 0,
      pullups: 0,
      squats: 0,
      plank: 0
    },
    measurements: {
      chest: 0,
      waist: 0,
      biceps: 0,
      thighs: 0
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
    dashboardLayout: ['welcome', 'nofap', 'pomodoro', 'priority', 'exams', 'tasks', 'habits', 'stats']
  },
  // New features
  skills: [
    { id: 'sk1', name: "Rubik's Cube", category: 'puzzles', level: 'beginner', hoursLogged: 0, lastPracticed: '', targetHours: 50, notes: 'Target: Sub-30 seconds' },
    { id: 'sk2', name: 'Guitar', category: 'music', level: 'beginner', hoursLogged: 0, lastPracticed: '', targetHours: 100, notes: 'Learn 10 songs' },
    { id: 'sk3', name: 'Flute', category: 'music', level: 'beginner', hoursLogged: 0, lastPracticed: '', targetHours: 100, notes: 'Learn 5 songs' },
    { id: 'sk4', name: 'Chess', category: 'games', level: 'beginner', hoursLogged: 0, lastPracticed: '', targetHours: 200, notes: 'Target: 1500 ELO' },
    { id: 'sk5', name: 'Spanish', category: 'languages', level: 'beginner', hoursLogged: 0, lastPracticed: '', targetHours: 300, notes: 'Conversational level' },
    { id: 'sk6', name: 'Video Editing', category: 'technical', level: 'beginner', hoursLogged: 0, lastPracticed: '', targetHours: 100, notes: 'DaVinci Resolve' },
    { id: 'sk7', name: 'React/TypeScript', category: 'technical', level: 'intermediate', hoursLogged: 50, lastPracticed: new Date().toISOString(), targetHours: 500, notes: 'Building 7K apps' },
  ],
  income: [],
  pomodoroSessions: [],
  discipline: {
    noFapStreak: 0,
    noFapLastRelapse: new Date().toISOString(),
    noFapBestStreak: 0,
    coldShowerStreak: 0,
    wakeUpStreak: 0,
    targetWakeTime: '05:30'
  },
  totalEarnings: 0
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  
  try {
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return INITIAL_DATA;

    return {
      ...INITIAL_DATA,
      ...parsed,
      user: { ...INITIAL_DATA.user, ...(parsed.user || {}) },
      stats: { ...INITIAL_DATA.stats, ...(parsed.stats || {}) },
      physical: { 
        ...INITIAL_DATA.physical, 
        ...(parsed.physical || {}),
        pbs: { ...INITIAL_DATA.physical.pbs, ...(parsed.physical?.pbs || {}) },
        measurements: { ...INITIAL_DATA.physical.measurements, ...(parsed.physical?.measurements || {}) }
      },
      discipline: { ...INITIAL_DATA.discipline, ...(parsed.discipline || {}) },
      settings: {
        ...INITIAL_DATA.settings,
        ...(parsed.settings || {}),
        activeSections: {
          ...INITIAL_DATA.settings.activeSections,
          ...(parsed.settings?.activeSections || {})
        }
      },
      habits: Array.isArray(parsed.habits) ? parsed.habits : INITIAL_DATA.habits,
      exams: Array.isArray(parsed.exams) ? parsed.exams.map((e: any) => ({
        ...e,
        studyMaterials: Array.isArray(e.studyMaterials) ? e.studyMaterials : []
      })) : INITIAL_DATA.exams,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : INITIAL_DATA.tasks,
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_DATA.projects,
      logs: Array.isArray(parsed.logs) ? parsed.logs : INITIAL_DATA.logs,
      skills: Array.isArray(parsed.skills) ? parsed.skills : INITIAL_DATA.skills,
      income: Array.isArray(parsed.income) ? parsed.income : INITIAL_DATA.income,
      pomodoroSessions: Array.isArray(parsed.pomodoroSessions) ? parsed.pomodoroSessions : INITIAL_DATA.pomodoroSessions,
      totalEarnings: parsed.totalEarnings || 0,
      onboardingCompleted: !!parsed.onboardingCompleted
    };
  } catch (error) {
    console.error("Critical: Data corruption detected. Reverting to initial state.", error);
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data to local storage", e);
  }
};