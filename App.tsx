import React, { useState } from 'react';
import { CaregiverView } from './components/CaregiverView';
import { FamilyView } from './components/FamilyView';
import { Copilot } from './components/Copilot';
import { CaregiverProfile } from './components/CaregiverProfile';
import { FamilyMessaging } from './components/FamilyMessaging';
import { FamilySettings } from './components/FamilySettings';
import { AuthScreen } from './components/AuthScreen';
import { LandingPage } from './components/LandingPage';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { Task, TaskStatus, ShiftSession, Evidence, UserRole, TaskPriority, Caregiver, VitalRegistry, UserProfile, ShiftRecord } from './types';
import { ClipboardList, Sparkles, User, LayoutGrid, MessageCircle, ShieldAlert, X, TriangleAlert, Pill, Settings } from 'lucide-react';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Morning Vitals & Meds',
    description: 'Administer 5mg Lisinopril. Check BP and record it.',
    startTime: '08:00',
    endTime: '08:30',
    priority: TaskPriority.CRITICAL,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '2',
    title: 'Breakfast & Hydration',
    description: 'Oatmeal with berries. Ensure 8oz water intake.',
    startTime: '08:30',
    endTime: '09:15',
    priority: TaskPriority.STANDARD,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '3',
    title: 'Morning Hygiene',
    description: 'Assist with teeth brushing and dressing.',
    startTime: '09:15',
    endTime: '10:00',
    priority: TaskPriority.STANDARD,
    status: TaskStatus.PENDING,
    requiredEvidence: false,
  },
  {
    id: '4',
    title: 'PT Exercises',
    description: 'Light stretching and leg lifts as per PT sheet.',
    startTime: '10:00',
    endTime: '10:45',
    priority: TaskPriority.STANDARD,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '5',
    title: 'Fun Activity: Music Time',
    description: 'Play the "Big Band" playlist. Sing along together! Capture a happy photo.',
    startTime: '10:45',
    endTime: '11:30',
    priority: TaskPriority.JOY,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '6',
    title: 'Hydration Check',
    description: 'Ensure another 8oz of water or herbal tea.',
    startTime: '11:30',
    endTime: '12:00',
    priority: TaskPriority.STANDARD,
    status: TaskStatus.PENDING,
    requiredEvidence: false,
  },
  {
    id: '7',
    title: 'Lunch Preparation',
    description: 'Turkey sandwich with soup. Low sodium.',
    startTime: '12:00',
    endTime: '13:00',
    priority: TaskPriority.STANDARD,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '8',
    title: 'Afternoon Meds',
    description: 'Administer afternoon calcium supplement.',
    startTime: '13:00',
    endTime: '13:15',
    priority: TaskPriority.CRITICAL,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '9',
    title: 'Fun Activity: Garden Stroll',
    description: 'Walk in the backyard. Look for birds. Take a photo of nature.',
    startTime: '13:15',
    endTime: '14:00',
    priority: TaskPriority.JOY,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
  {
    id: '10',
    title: 'Afternoon Rest',
    description: 'Ensure comfortable position for nap/rest.',
    startTime: '14:00',
    endTime: '15:00',
    priority: TaskPriority.LOW,
    status: TaskStatus.PENDING,
    requiredEvidence: false,
  },
  {
    id: '11',
    title: 'Fun Activity: Puzzle & Chat',
    description: 'Work on the landscape puzzle. Ask about childhood memories.',
    startTime: '15:30',
    endTime: '16:30',
    priority: TaskPriority.JOY,
    status: TaskStatus.PENDING,
    requiredEvidence: false,
  },
  {
    id: '12',
    title: 'Evening Snack',
    description: 'Apple slices and peanut butter.',
    startTime: '16:30',
    endTime: '17:00',
    priority: TaskPriority.STANDARD,
    status: TaskStatus.PENDING,
    requiredEvidence: true,
  },
];

const MOCK_CAREGIVER: Caregiver = {
  id: 'cg-001',
  name: 'Sarah Jenkins',
  title: 'Certified Nursing Assistant (CNA)',
  rating: 4.9,
  totalShifts: 154,
  reliabilityScore: 98,
  certifications: ['CPR / AED Certified', 'State Licensed CNA', 'Diabetes Care Level 1'],
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
};

const PATIENT_DETAILS = {
    fullName: "Johnathan Doe",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop",
    dob: "March 12, 1946 (78 yrs)",
    bloodType: "O+",
    weight: "165 lbs",
    height: "5'10\"",
    primaryPhysician: "Dr. Emily Chen (Cardiology)",
    physicianPhone: "555-0123",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes", "Early-stage Dementia", "Arthritis (Right Knee)"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", freq: "Daily (Morning)", purpose: "Blood Pressure" },
      { name: "Metformin", dosage: "500mg", freq: "Twice Daily with meals", purpose: "Diabetes" },
      { name: "Donepezil", dosage: "5mg", freq: "Daily (Evening)", purpose: "Cognitive Support" },
      { name: "Atorvastatin", dosage: "20mg", freq: "Daily (Bedtime)", purpose: "Cholesterol" }
    ],
    appointments: [
      { date: "Oct 24, 2024", time: "10:00 AM", doctor: "Dr. Emily Chen", type: "Cardiology Follow-up", status: "UPCOMING", note: "Routine 6-month checkup for BP management." },
      { date: "Nov 02, 2024", time: "02:00 PM", doctor: "Dr. Sarah Miller", type: "Podiatry", status: "UPCOMING", note: "Diabetic foot exam." },
      { date: "Sep 15, 2024", time: "09:30 AM", doctor: "Dr. Alan Grant", type: "Neurology", status: "PAST", note: "Cognitive assessment. dosage adjustment for Donepezil." }
    ],
    history: [
      { date: "2023", event: "Total Knee Replacement (Right)" },
      { date: "2018", event: "Diagnosed with Type 2 Diabetes" },
      { date: "2015", event: "Mild Myocardial Infarction (Stent placed)" }
    ]
};

const INITIAL_VITALS: VitalRegistry = {
  bloodPressure: {
    current: "120/80",
    history: [
      { value: "125/82", unit: "mmHg", timestamp: Date.now() - 518400000, dayLabel: 'Mon', splitValue: { sys: 125, dia: 82 } },
      { value: "122/80", unit: "mmHg", timestamp: Date.now() - 432000000, dayLabel: 'Tue', splitValue: { sys: 122, dia: 80 } },
      { value: "119/78", unit: "mmHg", timestamp: Date.now() - 345600000, dayLabel: 'Wed', splitValue: { sys: 119, dia: 78 } },
      { value: "120/80", unit: "mmHg", timestamp: Date.now() - 259200000, dayLabel: 'Thu', splitValue: { sys: 120, dia: 80 } },
      { value: "128/85", unit: "mmHg", timestamp: Date.now() - 172800000, dayLabel: 'Fri', splitValue: { sys: 128, dia: 85 } },
      { value: "124/81", unit: "mmHg", timestamp: Date.now() - 86400000, dayLabel: 'Sat', splitValue: { sys: 124, dia: 81 } },
      { value: "121/79", unit: "mmHg", timestamp: Date.now(), dayLabel: 'Sun', splitValue: { sys: 121, dia: 79 } },
    ]
  },
  temperature: {
    current: 98.6,
    history: [
      { value: 98.4, unit: "°F", timestamp: Date.now() - 518400000, dayLabel: 'Mon' },
      { value: 98.6, unit: "°F", timestamp: Date.now() - 432000000, dayLabel: 'Tue' },
      { value: 98.7, unit: "°F", timestamp: Date.now() - 345600000, dayLabel: 'Wed' },
      { value: 98.5, unit: "°F", timestamp: Date.now() - 259200000, dayLabel: 'Thu' },
      { value: 99.1, unit: "°F", timestamp: Date.now() - 172800000, dayLabel: 'Fri' },
      { value: 98.6, unit: "°F", timestamp: Date.now() - 86400000, dayLabel: 'Sat' },
      { value: 98.4, unit: "°F", timestamp: Date.now(), dayLabel: 'Sun' },
    ]
  }
};

type ViewState = 'LANDING' | 'AUTH' | 'APP' | 'ENTERPRISE_DASHBOARD';

const App: React.FC = () => {
  // Routing State
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | undefined>(undefined);
  
  // App Logic State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CAREGIVER);
  const [caregiverTab, setCaregiverTab] = useState<'tasks' | 'copilot' | 'profile'>('tasks');
  const [familyTab, setFamilyTab] = useState<'timeline' | 'messages' | 'care-team' | 'settings'>('timeline');

  const [shift, setShift] = useState<ShiftSession>({
    isActive: false,
    caregiverName: 'Sarah Jenkins',
  });
  const [totalDailyDuration, setTotalDailyDuration] = useState(0); 
  const [shiftHistory, setShiftHistory] = useState<ShiftRecord[]>([]);

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [vitals, setVitals] = useState<VitalRegistry>(INITIAL_VITALS);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatarUrl: null
  });

  const [isPatientProfileOpen, setIsPatientProfileOpen] = useState(false);

  // Navigation Handlers
  const handleSelectRole = (role: UserRole) => {
      setAuthTargetRole(role);
      setCurrentView('AUTH');
  };

  const handleBackToLanding = () => {
      setCurrentView('LANDING');
      setAuthTargetRole(undefined);
      setIsAuthenticated(false);
  };

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true);
    setActiveRole(role);
    if (role === UserRole.ENTERPRISE) {
        setCurrentView('ENTERPRISE_DASHBOARD');
    } else {
        setCurrentView('APP');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShift({ ...shift, isActive: false });
    setTotalDailyDuration(0);
    setShiftHistory([]);
    setCurrentView('LANDING');
  };

  const handleStartShift = () => {
    setShift({ ...shift, isActive: true, startTime: Date.now() });
  };

  const handleEndShift = () => {
    const confirmEnd = window.confirm("Are you sure you want to end your shift? Ensure all critical tasks are logged.");
    if (confirmEnd) {
        if (shift.startTime) {
            const endTime = Date.now();
            const duration = endTime - shift.startTime;
            setTotalDailyDuration(prev => prev + duration);
            setShiftHistory(prev => [...prev, {
                id: Date.now().toString(),
                startTime: shift.startTime!,
                endTime: endTime
            }]);
        }
        setShift({ ...shift, isActive: false, startTime: undefined });
    }
  };

  const handleUpdateTask = (taskId: string, status: TaskStatus, evidence?: Evidence) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newEvidence = evidence ? [...(t.evidence || []), evidence] : t.evidence;
        return { ...t, status, evidence: newEvidence };
      }
      return t;
    }));
  };

  const handleUpdateVital = (type: 'BP' | 'TEMP', value: string | number, photoUrl?: string) => {
    setVitals(prev => {
      const todayLabel = 'Today';
      if (type === 'BP' && typeof value === 'string') {
        const [sys, dia] = value.split('/').map(Number);
        const newRecord = {
          value,
          unit: 'mmHg',
          timestamp: Date.now(),
          evidencePhotoUrl: photoUrl,
          dayLabel: todayLabel,
          splitValue: { sys, dia }
        };
        return {
          ...prev,
          bloodPressure: {
            current: value,
            history: [...prev.bloodPressure.history.slice(1), newRecord]
          }
        };
      } else if (type === 'TEMP' && typeof value === 'number') {
        const newRecord = {
          value,
          unit: '°F',
          timestamp: Date.now(),
          evidencePhotoUrl: photoUrl,
          dayLabel: todayLabel
        };
        return {
           ...prev,
           temperature: {
             current: value,
             history: [...prev.temperature.history.slice(1), newRecord]
           }
        };
      }
      return prev;
    });
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  // --- VIEW RENDERING ---

  if (currentView === 'LANDING') {
      return <LandingPage onSelectRole={handleSelectRole} />;
  }

  if (currentView === 'AUTH') {
      return <AuthScreen onLogin={handleLogin} targetRole={authTargetRole} onBack={handleBackToLanding} />;
  }

  if (currentView === 'ENTERPRISE_DASHBOARD') {
      return <EnterpriseDashboard onLogout={handleLogout} />;
  }

  // Mobile App View Wrapper (Family & Caregiver)
  
  const renderAppContent = () => {
      if (activeRole === UserRole.CAREGIVER) {
          switch (caregiverTab) {
              case 'tasks':
                  return (
                    <CaregiverView 
                      tasks={tasks} 
                      shift={shift} 
                      vitals={vitals}
                      onStartShift={handleStartShift} 
                      onEndShift={handleEndShift} 
                      onUpdateTask={handleUpdateTask}
                      onUpdateVital={handleUpdateVital}
                    />
                  );
              case 'profile':
                  return (
                    <CaregiverProfile 
                        caregiver={MOCK_CAREGIVER} 
                        currentShift={shift} 
                        totalDuration={totalDailyDuration}
                        viewMode="caregiver" 
                        onStartShift={handleStartShift} 
                        onEndShift={handleEndShift} 
                    />
                  );
              default:
                  return <Copilot isOpen={caregiverTab === 'copilot'} onClose={() => setCaregiverTab('tasks')} />;
          }
      } else {
          switch (familyTab) {
              case 'timeline':
                  return (
                    <FamilyView 
                        tasks={tasks} 
                        vitals={vitals} 
                        currentShift={shift} 
                        shiftHistory={shiftHistory}
                    />
                  );
              case 'messages':
                  return <FamilyMessaging />;
              case 'care-team':
                  return <CaregiverProfile caregiver={MOCK_CAREGIVER} currentShift={shift} viewMode="family" />;
              case 'settings':
                  return <FamilySettings userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
              default:
                  return (
                    <FamilyView 
                        tasks={tasks} 
                        vitals={vitals} 
                        currentShift={shift} 
                        shiftHistory={shiftHistory}
                    />
                  );
          }
      }
  };

  const NavButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative`}
    >
        <div className={`w-14 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${active ? 'bg-[#C2E7FF]' : 'bg-transparent'}`}>
             <Icon className={`w-6 h-6 ${active ? 'text-[#001D35] fill-current' : 'text-[#444746]'}`} strokeWidth={active ? 2 : 2} />
        </div>
        <span className={`text-[10px] font-bold mt-1 ${active ? 'text-[#001D35]' : 'text-[#444746]'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F9] max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans text-[#1F1F1F]">
      {/* Header - Floating Island Style */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 py-3 bg-[#F0F4F9]">
        <div className="flex justify-between items-center">
            {activeRole === UserRole.CAREGIVER ? (
                <button 
                    onClick={() => setIsPatientProfileOpen(true)}
                    className="flex items-center space-x-3 bg-white pl-1 pr-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={PATIENT_DETAILS.image} alt={PATIENT_DETAILS.fullName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-[#1F1F1F]">{PATIENT_DETAILS.fullName}</span>
                </button>
            ) : (
                <div className="flex items-center space-x-2">
                     <span className="text-xl font-bold text-transparent bg-clip-text bg-gemini pl-2">ADLTrack</span>
                </div>
            )}
            
            <div className="flex items-center space-x-2">
                <div onClick={handleLogout} className="w-9 h-9 rounded-full bg-gemini p-[2px] cursor-pointer" title="Sign Out">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#444746] font-bold text-xs">
                        SJ
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative pt-[64px] bg-[#F0F4F9]">
        {renderAppContent()}
      </main>

      {/* Patient Profile Modal (Gemini Bottom Sheet) */}
      {isPatientProfileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-[#F0F4F9] w-full max-w-md h-[92vh] sm:h-[85vh] rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Drag Handle */}
                <div className="h-8 flex items-center justify-center shrink-0">
                    <div className="w-8 h-1 bg-[#747775] opacity-40 rounded-full" />
                </div>

                <div className="px-6 pb-2 flex justify-between items-center shrink-0">
                    <h2 className="text-2xl font-bold text-[#1F1F1F]">Health Profile</h2>
                    <button 
                        onClick={() => setIsPatientProfileOpen(false)}
                        className="p-2 bg-[#E1E3E1] rounded-full hover:bg-[#C4C7C5] transition-colors"
                    >
                        <X className="w-5 h-5 text-[#444746]" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header Card */}
                    <div className="surface-card p-6 flex flex-col items-center text-center">
                        <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                            <img src={PATIENT_DETAILS.image} alt="Patient" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#1F1F1F]">{PATIENT_DETAILS.fullName}</h1>
                        <p className="text-[#444746] font-medium">{PATIENT_DETAILS.dob}</p>
                        <div className="flex space-x-2 mt-4">
                            <span className="px-4 py-1.5 bg-[#D3E3FD] text-[#041E49] text-xs font-bold rounded-full">{PATIENT_DETAILS.bloodType}</span>
                            <span className="px-4 py-1.5 bg-[#E1E3E1] text-[#1F1F1F] text-xs font-bold rounded-full">{PATIENT_DETAILS.height}</span>
                        </div>
                    </div>

                    {/* Critical Info */}
                    <div className="bg-[#F9DEDC] rounded-[24px] p-5">
                         <div className="flex items-start space-x-3">
                             <TriangleAlert className="w-6 h-6 text-[#B3261E] shrink-0" />
                             <div>
                                 <h4 className="text-sm font-bold text-[#8C1D18] uppercase tracking-wide mb-1">Critical Allergies</h4>
                                 <p className="text-lg font-medium text-[#410E0B]">{PATIENT_DETAILS.allergies.join(", ")}</p>
                             </div>
                         </div>
                    </div>

                    {/* Section: Meds */}
                    <div>
                         <h3 className="text-lg font-bold text-[#1F1F1F] mb-4 flex items-center">
                            <Pill className="w-5 h-5 mr-2 text-[#9B72CB]" /> Medications
                        </h3>
                        <div className="space-y-3">
                            {PATIENT_DETAILS.medications.map((med, i) => (
                                <div key={i} className="surface-card p-4 flex justify-between items-center hover:bg-white/80 transition-colors">
                                    <div>
                                        <p className="font-bold text-[#1F1F1F] text-lg">{med.name}</p>
                                        <p className="text-sm text-[#444746]">{med.dosage} • {med.purpose}</p>
                                    </div>
                                    <span className="text-xs font-bold bg-[#E1E3E1] text-[#1F1F1F] px-3 py-1.5 rounded-lg">{med.freq}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Bottom Navigation - Floating Island */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <nav className="bg-[#F0F4F9] bg-opacity-90 backdrop-blur-md rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] px-2 py-2 flex items-center pointer-events-auto border border-white">
            {activeRole === UserRole.CAREGIVER ? (
                <>
                    <NavButton active={caregiverTab === 'tasks'} onClick={() => setCaregiverTab('tasks')} icon={ClipboardList} label="Tasks" />
                    <NavButton active={caregiverTab === 'copilot'} onClick={() => setCaregiverTab('copilot')} icon={Sparkles} label="Ask Me" />
                    <NavButton active={caregiverTab === 'profile'} onClick={() => setCaregiverTab('profile')} icon={User} label="Profile" />
                </>
            ) : (
                 <>
                    <NavButton active={familyTab === 'timeline'} onClick={() => setFamilyTab('timeline')} icon={LayoutGrid} label="Feed" />
                    <NavButton active={familyTab === 'messages'} onClick={() => setFamilyTab('messages')} icon={MessageCircle} label="Chat" />
                    <NavButton active={familyTab === 'care-team'} onClick={() => setFamilyTab('care-team')} icon={ShieldAlert} label="Team" />
                    <NavButton active={familyTab === 'settings'} onClick={() => setFamilyTab('settings')} icon={Settings} label="Settings" />
                </>
            )}
        </nav>
      </div>
    </div>
  );
};

export default App;