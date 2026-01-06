import React, { useState } from 'react';
import { LayoutDashboard, Users, Clock, ClipboardCheck, Settings, Search, Plus, MoreHorizontal, CircleAlert, CircleCheck, FileText, ChevronRight, LogOut, Bell, X, Mail, Shield, UserPlus } from 'lucide-react';

interface EnterpriseDashboardProps {
  onLogout: () => void;
}

// Mock Data
const MOCK_CASES = [
    { id: '1', patient: 'Johnathan Doe', plan: 'Post-Op Recovery', status: 'ACTIVE', caregiver: 'Sarah Jenkins', lastUpdate: '10 mins ago', escalation: null },
    { id: '2', patient: 'Martha Stewart', plan: 'Dementia Care', status: 'ALERT', caregiver: 'Mike Ross', lastUpdate: '2 hours ago', escalation: 'Missed Meds' },
    { id: '3', patient: 'Robert DeNiro', plan: 'Companionship', status: 'ACTIVE', caregiver: 'Pending', lastUpdate: '1 day ago', escalation: null },
    { id: '4', patient: 'Alice Cooper', plan: 'Palliative Care', status: 'INACTIVE', caregiver: '-', lastUpdate: '3 days ago', escalation: null },
];

const MOCK_STAFF = [
    { id: '1', name: 'Sarah Jenkins', role: 'CNA', status: 'ON_SHIFT', location: 'Doe Residence', clockIn: '08:00 AM', email: 'sarah.j@care.com' },
    { id: '2', name: 'Mike Ross', role: 'RN', status: 'OFF_SHIFT', location: '-', clockIn: '-', email: 'mike.r@care.com' },
    { id: '3', name: 'Jessica Pearson', role: 'HHA', status: 'ON_SHIFT', location: 'Smith Residence', clockIn: '09:15 AM', email: 'jessica.p@care.com' },
    { id: '4', name: 'Louis Litt', role: 'PT', status: 'LEAVE', location: '-', clockIn: '-', email: 'louis.l@care.com' },
];

const MOCK_FAMILIES = [
    { id: '1', name: 'Jane Doe', patient: 'Johnathan Doe', relation: 'Daughter', access: 'GRANTED', email: 'jane@example.com' },
    { id: '2', name: 'Peter Stewart', patient: 'Martha Stewart', relation: 'Son', access: 'PENDING', email: 'peter@example.com' },
    { id: '3', name: 'Helen DeNiro', patient: 'Robert DeNiro', relation: 'Spouse', access: 'GRANTED', email: 'helen@example.com' },
];

const MOCK_SHIFTS = [
    { id: '1', staff: 'Sarah Jenkins', patient: 'Johnathan Doe', date: 'Oct 24', duration: '8h 00m', verified: true },
    { id: '2', staff: 'Mike Ross', patient: 'Martha Stewart', date: 'Oct 24', duration: '6h 30m', verified: true },
    { id: '3', staff: 'Jessica Pearson', patient: 'Alice Cooper', date: 'Oct 23', duration: '12h 00m', verified: true },
    { id: '4', staff: 'Sarah Jenkins', patient: 'Johnathan Doe', date: 'Oct 23', duration: '8h 15m', verified: false },
];

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CASES' | 'STAFF' | 'TIME' | 'FAMILIES'>('OVERVIEW');
  const [showAddCaregiver, setShowAddCaregiver] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === id 
            ? 'bg-[#E8DEF8] text-[#1D192B] font-bold' 
            : 'text-[#444746] hover:bg-[#F0F4F9]'
        }`}
    >
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-[#1D192B]' : 'text-[#444746]'}`} />
        <span>{label}</span>
    </button>
  );

  const StatCard = ({ label, value, trend, trendUp }: { label: string, value: string, trend: string, trendUp: boolean }) => (
      <div className="bg-white p-6 rounded-[24px] border border-[#E1E3E1] shadow-sm">
          <h3 className="text-[#444746] font-medium text-sm uppercase tracking-wide mb-2">{label}</h3>
          <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-[#1F1F1F]">{value}</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${trendUp ? 'bg-[#E6F4EA] text-[#146C2E]' : 'bg-[#F9DEDC] text-[#B3261E]'}`}>
                  {trend}
              </span>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-[#F0F4F9] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E1E3E1] flex flex-col p-6 hidden md:flex shrink-0">
         <div className="flex items-center space-x-2 mb-10 px-2">
             <div className="w-8 h-8 rounded-lg bg-[#0B57D0] flex items-center justify-center">
                 <span className="text-white font-bold text-lg">E</span>
             </div>
             <span className="text-xl font-bold text-[#1F1F1F]">Enterprise</span>
         </div>
         
         <nav className="flex-1 space-y-2">
             <SidebarItem id="OVERVIEW" icon={LayoutDashboard} label="Overview" />
             <SidebarItem id="CASES" icon={ClipboardCheck} label="Case Management" />
             <SidebarItem id="STAFF" icon={Users} label="Caregivers" />
             <SidebarItem id="FAMILIES" icon={UserPlus} label="Families" />
             <SidebarItem id="TIME" icon={Clock} label="Time & Attendance" />
         </nav>

         <div className="pt-6 border-t border-[#E1E3E1]">
             <button className="w-full flex items-center space-x-3 px-4 py-3 text-[#444746] hover:bg-[#F0F4F9] rounded-xl mb-2">
                 <Settings className="w-5 h-5" />
                 <span>Settings</span>
             </button>
             <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-[#B3261E] bg-[#F9DEDC] hover:bg-[#F2B8B5] rounded-xl font-bold transition-colors">
                 <LogOut className="w-5 h-5" />
                 <span>Sign Out</span>
             </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
          {/* Top Header */}
          <header className="px-8 py-5 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-[#E1E3E1]">
              <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  {activeTab === 'OVERVIEW' && 'Dashboard Overview'}
                  {activeTab === 'CASES' && 'Case Management'}
                  {activeTab === 'STAFF' && 'Staff Directory'}
                  {activeTab === 'FAMILIES' && 'Family Access'}
                  {activeTab === 'TIME' && 'Timesheets'}
              </h2>
              <div className="flex items-center space-x-4">
                  <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#444746]" />
                      <input 
                        placeholder="Search..." 
                        className="pl-10 pr-4 py-2 bg-white border border-[#C4C7C5] rounded-full text-sm focus:outline-none focus:border-[#0B57D0] w-64"
                      />
                  </div>
                  <button className="p-2 bg-white rounded-full border border-[#E1E3E1] hover:bg-[#F0F4F9] relative">
                      <Bell className="w-5 h-5 text-[#444746]" />
                      <div className="absolute top-1 right-2 w-2 h-2 bg-[#B3261E] rounded-full"></div>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-[#0B57D0] text-white flex items-center justify-center font-bold">
                      AD
                  </div>
              </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto space-y-8">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'OVERVIEW' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard label="Active Cases" value="124" trend="+12%" trendUp={true} />
                        <StatCard label="Staff on Shift" value="48" trend="+4%" trendUp={true} />
                        <StatCard label="Escalations" value="3" trend="-2" trendUp={false} />
                        <StatCard label="Weekly Hours" value="1.2k" trend="+5%" trendUp={true} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Escalations / Alerts */}
                        <div className="bg-white p-6 rounded-[24px] border border-[#E1E3E1] shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-[#1F1F1F]">Priority Escalations</h3>
                                <button className="text-sm text-[#0B57D0] font-bold">View All</button>
                            </div>
                            <div className="space-y-4">
                                {MOCK_CASES.filter(c => c.status === 'ALERT').map(c => (
                                    <div key={c.id} className="flex items-center p-4 bg-[#F9DEDC] rounded-xl border border-[#F2B8B5]">
                                        <CircleAlert className="w-6 h-6 text-[#B3261E] mr-4 shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-[#1F1F1F]">{c.patient}</h4>
                                                <span className="text-xs font-bold text-[#B3261E] bg-white px-2 py-0.5 rounded-full">{c.escalation}</span>
                                            </div>
                                            <p className="text-sm text-[#410E0B]">Supervisor review required.</p>
                                        </div>
                                        <button className="ml-3 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-[#B3261E] shadow-sm">Review</button>
                                    </div>
                                ))}
                                <div className="flex items-center p-4 bg-[#F0F4F9] rounded-xl border border-[#E1E3E1]">
                                    <Clock className="w-6 h-6 text-[#0B57D0] mr-4 shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#1F1F1F]">Staffing Request</h4>
                                        <p className="text-sm text-[#444746]">Late call-out for Sunday Shift (Doe Family).</p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-[#0B57D0] shadow-sm">Fill Shift</button>
                                </div>
                            </div>
                        </div>

                        {/* Live Map / List */}
                        <div className="bg-white p-6 rounded-[24px] border border-[#E1E3E1] shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-[#1F1F1F]">Live Attendance</h3>
                                <div className="flex items-center space-x-2 text-xs font-bold text-[#146C2E] bg-[#E6F4EA] px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-[#146C2E] animate-pulse"></div>
                                    <span>Live Updates</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {MOCK_STAFF.slice(0, 3).map(s => (
                                    <div key={s.id} className="flex justify-between items-center p-3 hover:bg-[#F0F4F9] rounded-xl transition-colors">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#E1E3E1] flex items-center justify-center font-bold text-[#444746] mr-3">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-[#1F1F1F]">{s.name}</h4>
                                                <p className="text-xs text-[#444746]">{s.status === 'ON_SHIFT' ? `Active @ ${s.location}` : 'Off Shift'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${s.status === 'ON_SHIFT' ? 'bg-[#E6F4EA] text-[#146C2E]' : 'bg-[#F2F2F2] text-[#444746]'}`}>
                                            {s.clockIn}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                  </>
              )}

              {/* CASES TAB */}
              {activeTab === 'CASES' && (
                  <div className="bg-white rounded-[24px] border border-[#E1E3E1] shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-[#E1E3E1] flex justify-between items-center">
                          <h3 className="font-bold text-lg">Active Cases</h3>
                          <button className="flex items-center space-x-2 bg-[#0B57D0] text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-md transition-all">
                              <Plus className="w-4 h-4" />
                              <span>New Case</span>
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#F0F4F9] text-[#444746] text-sm font-bold uppercase">
                              <tr>
                                  <th className="p-4 pl-6">Patient</th>
                                  <th className="p-4">Care Plan</th>
                                  <th className="p-4">Assigned Staff</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {MOCK_CASES.map((c, i) => (
                                  <tr key={c.id} className={`border-b border-[#E1E3E1] hover:bg-[#F0F4F9] transition-colors ${i === MOCK_CASES.length - 1 ? 'border-none' : ''}`}>
                                      <td className="p-4 pl-6 font-bold text-[#1F1F1F]">{c.patient}</td>
                                      <td className="p-4 text-[#444746] text-sm">{c.plan}</td>
                                      <td className="p-4">
                                          {c.caregiver !== '-' ? (
                                              <div className="flex items-center space-x-2">
                                                  <div className="w-6 h-6 rounded-full bg-[#E1E3E1] flex items-center justify-center text-xs font-bold">{c.caregiver.charAt(0)}</div>
                                                  <span className="text-sm text-[#1F1F1F]">{c.caregiver}</span>
                                              </div>
                                          ) : <span className="text-xs text-[#B3261E] font-bold bg-[#F9DEDC] px-2 py-1 rounded">Unassigned</span>}
                                      </td>
                                      <td className="p-4">
                                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                              c.status === 'ACTIVE' ? 'bg-[#E6F4EA] text-[#146C2E]' :
                                              c.status === 'ALERT' ? 'bg-[#F9DEDC] text-[#B3261E]' :
                                              'bg-[#E1E3E1] text-[#444746]'
                                          }`}>
                                              {c.status}
                                          </span>
                                      </td>
                                      <td className="p-4">
                                          <button className="p-2 hover:bg-[#E1E3E1] rounded-full text-[#444746]">
                                              <MoreHorizontal className="w-5 h-5" />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* STAFF TAB - Caregiver Management */}
              {activeTab === 'STAFF' && (
                   <div className="bg-white rounded-[24px] border border-[#E1E3E1] shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-[#E1E3E1] flex justify-between items-center">
                          <h3 className="font-bold text-lg">Caregiver Directory</h3>
                          <div className="flex space-x-2">
                              <button 
                                onClick={() => setShowAddCaregiver(true)}
                                className="flex items-center space-x-2 bg-[#0B57D0] text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-md transition-all"
                              >
                                  <Plus className="w-4 h-4" />
                                  <span>Register Caregiver</span>
                              </button>
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                          {MOCK_STAFF.map(s => (
                              <div key={s.id} className="p-5 border border-[#E1E3E1] rounded-[20px] hover:shadow-md transition-all cursor-pointer group bg-white">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-12 h-12 rounded-full bg-[#E1E3E1] flex items-center justify-center font-bold text-lg text-[#444746]">
                                          {s.name.charAt(0)}
                                      </div>
                                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${s.status === 'ON_SHIFT' ? 'bg-[#E6F4EA] text-[#146C2E]' : 'bg-[#F0F4F9] text-[#444746]'}`}>
                                          {s.status.replace('_', ' ')}
                                      </span>
                                  </div>
                                  <h4 className="font-bold text-[#1F1F1F] text-lg">{s.name}</h4>
                                  <p className="text-sm text-[#444746] mb-1">{s.role}</p>
                                  <p className="text-xs text-[#444746] opacity-70 mb-4">{s.email}</p>
                                  <div className="flex justify-between items-center pt-4 border-t border-[#E1E3E1]">
                                      <span className="text-xs text-[#444746] font-medium">Last: {s.clockIn !== '-' ? 'Today' : 'Yesterday'}</span>
                                      <button className="text-sm font-bold text-[#0B57D0] group-hover:underline">Manage</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* FAMILIES TAB - Family Management */}
              {activeTab === 'FAMILIES' && (
                  <div className="bg-white rounded-[24px] border border-[#E1E3E1] shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-[#E1E3E1] flex justify-between items-center">
                          <h3 className="font-bold text-lg">Family & Client Access</h3>
                          <button 
                             onClick={() => setShowAddFamily(true)}
                             className="flex items-center space-x-2 bg-[#0B57D0] text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-md transition-all"
                          >
                              <Plus className="w-4 h-4" />
                              <span>Grant Access</span>
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#F0F4F9] text-[#444746] text-sm font-bold uppercase">
                              <tr>
                                  <th className="p-4 pl-6">Family Member</th>
                                  <th className="p-4">Relation</th>
                                  <th className="p-4">Linked Patient</th>
                                  <th className="p-4">Access Status</th>
                                  <th className="p-4">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {MOCK_FAMILIES.map((f, i) => (
                                  <tr key={f.id} className={`border-b border-[#E1E3E1] hover:bg-[#F0F4F9] transition-colors ${i === MOCK_FAMILIES.length - 1 ? 'border-none' : ''}`}>
                                      <td className="p-4 pl-6">
                                          <div className="flex flex-col">
                                              <span className="font-bold text-[#1F1F1F]">{f.name}</span>
                                              <span className="text-xs text-[#444746]">{f.email}</span>
                                          </div>
                                      </td>
                                      <td className="p-4 text-[#444746]">{f.relation}</td>
                                      <td className="p-4 font-medium text-[#1F1F1F]">{f.patient}</td>
                                      <td className="p-4">
                                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                              f.access === 'GRANTED' ? 'bg-[#E6F4EA] text-[#146C2E]' : 'bg-[#FFF8E1] text-[#8D6E63]'
                                          }`}>
                                              {f.access}
                                          </span>
                                      </td>
                                      <td className="p-4">
                                          <button className="text-sm font-bold text-[#0B57D0] hover:underline">Revoke</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* TIME TAB */}
               {activeTab === 'TIME' && (
                  <div className="bg-white rounded-[24px] border border-[#E1E3E1] shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-[#E1E3E1] flex justify-between items-center">
                          <h3 className="font-bold text-lg">Timesheets & Attendance</h3>
                          <button className="flex items-center space-x-2 bg-white border border-[#E1E3E1] text-[#444746] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#F0F4F9]">
                              <FileText className="w-4 h-4" />
                              <span>Export Payroll</span>
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#F0F4F9] text-[#444746] text-sm font-bold uppercase">
                              <tr>
                                  <th className="p-4 pl-6">Staff</th>
                                  <th className="p-4">Patient</th>
                                  <th className="p-4">Date</th>
                                  <th className="p-4">Duration</th>
                                  <th className="p-4">Verification</th>
                                  <th className="p-4"></th>
                              </tr>
                          </thead>
                          <tbody>
                              {MOCK_SHIFTS.map((s, i) => (
                                  <tr key={s.id} className={`border-b border-[#E1E3E1] hover:bg-[#F0F4F9] transition-colors`}>
                                      <td className="p-4 pl-6 font-bold text-[#1F1F1F]">{s.staff}</td>
                                      <td className="p-4 text-[#444746]">{s.patient}</td>
                                      <td className="p-4 text-[#444746]">{s.date}</td>
                                      <td className="p-4 font-mono text-sm font-bold text-[#1F1F1F]">{s.duration}</td>
                                      <td className="p-4">
                                          {s.verified ? (
                                              <span className="flex items-center text-xs font-bold text-[#146C2E]">
                                                  <CircleCheck className="w-4 h-4 mr-1" /> Verified
                                              </span>
                                          ) : (
                                              <span className="flex items-center text-xs font-bold text-[#B3261E]">
                                                  <CircleAlert className="w-4 h-4 mr-1" /> Flagged
                                              </span>
                                          )}
                                      </td>
                                      <td className="p-4 text-right">
                                          <ChevronRight className="w-5 h-5 text-[#444746] inline-block" />
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

          </div>

          {/* ADD CAREGIVER MODAL */}
          {showAddCaregiver && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center space-x-3">
                              <div className="p-2 bg-[#E6F4EA] rounded-full">
                                  <Users className="w-6 h-6 text-[#146C2E]" />
                              </div>
                              <h2 className="text-2xl font-bold text-[#1F1F1F]">Register Caregiver</h2>
                          </div>
                          <button onClick={() => setShowAddCaregiver(false)} className="p-2 hover:bg-[#F0F4F9] rounded-full"><X className="w-6 h-6 text-[#444746]" /></button>
                      </div>
                      
                      <form className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-[#444746] mb-1">First Name</label>
                                  <input className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0]" placeholder="Jane" />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-[#444746] mb-1">Last Name</label>
                                  <input className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0]" placeholder="Smith" />
                              </div>
                          </div>
                          <div>
                               <label className="block text-sm font-bold text-[#444746] mb-1">Email Address (for Activation)</label>
                               <input className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0]" placeholder="jane.smith@care.com" />
                          </div>
                          <div>
                               <label className="block text-sm font-bold text-[#444746] mb-1">Role / Title</label>
                               <select className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0] bg-white">
                                   <option>Certified Nursing Assistant (CNA)</option>
                                   <option>Home Health Aide (HHA)</option>
                                   <option>Registered Nurse (RN)</option>
                                   <option>Physical Therapist (PT)</option>
                               </select>
                          </div>
                          <div className="pt-4 flex justify-end space-x-3">
                              <button type="button" onClick={() => setShowAddCaregiver(false)} className="px-6 py-3 font-bold text-[#444746] hover:bg-[#F0F4F9] rounded-full">Cancel</button>
                              <button type="button" onClick={() => setShowAddCaregiver(false)} className="px-6 py-3 bg-[#0B57D0] text-white font-bold rounded-full hover:shadow-md">Send Invitation</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

          {/* ADD FAMILY MODAL */}
          {showAddFamily && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center space-x-3">
                              <div className="p-2 bg-[#E8DEF8] rounded-full">
                                  <Mail className="w-6 h-6 text-[#1D192B]" />
                              </div>
                              <h2 className="text-2xl font-bold text-[#1F1F1F]">Invite Family Member</h2>
                          </div>
                          <button onClick={() => setShowAddFamily(false)} className="p-2 hover:bg-[#F0F4F9] rounded-full"><X className="w-6 h-6 text-[#444746]" /></button>
                      </div>
                      
                      <div className="bg-[#F0F4F9] p-4 rounded-xl mb-6 flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-[#0B57D0] mt-0.5" />
                          <p className="text-sm text-[#444746]">
                              Invited members will receive a secure link to create their account. They will have <strong>read-only access</strong> to the selected patient's care timeline.
                          </p>
                      </div>

                      <form className="space-y-4">
                          <div>
                               <label className="block text-sm font-bold text-[#444746] mb-1">Family Member Email</label>
                               <input className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0]" placeholder="email@example.com" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-[#444746] mb-1">Relation</label>
                                  <input className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0]" placeholder="Daughter" />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-[#444746] mb-1">Link to Patient</label>
                                  <select className="w-full border border-[#C4C7C5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B57D0] bg-white">
                                      {MOCK_CASES.map(c => <option key={c.id}>{c.patient}</option>)}
                                  </select>
                              </div>
                          </div>
                          <div className="pt-4 flex justify-end space-x-3">
                              <button type="button" onClick={() => setShowAddFamily(false)} className="px-6 py-3 font-bold text-[#444746] hover:bg-[#F0F4F9] rounded-full">Cancel</button>
                              <button type="button" onClick={() => setShowAddFamily(false)} className="px-6 py-3 bg-[#0B57D0] text-white font-bold rounded-full hover:shadow-md">Grant Access</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

      </main>
    </div>
  );
};