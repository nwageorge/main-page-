import React, { useState } from 'react';
import { Task, TaskStatus, VitalRegistry, ShiftSession, ShiftRecord } from '../types';
import { CircleCheck, Clock, Activity, Heart, Shield, X, Calendar, Pill, TriangleAlert, FileText, ChevronRight, Stethoscope, Phone, Thermometer, Camera, User } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, LineChart, Line, YAxis, CartesianGrid } from 'recharts';

interface FamilyViewProps {
  tasks: Task[];
  vitals: VitalRegistry;
  currentShift: ShiftSession;
  shiftHistory: ShiftRecord[];
}

export const FamilyView: React.FC<FamilyViewProps> = ({ tasks, vitals, currentShift, shiftHistory }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'BP' | 'TEMP' | null>(null);

  const sortedTasks = [...tasks].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
  });

  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  // Calculate raw percentage
  const rawProgress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  // Rounded for display
  const displayProgress = Math.round(rawProgress) || 0;

  const latestBpPhoto = [...vitals.bloodPressure.history].reverse().find(h => h.evidencePhotoUrl)?.evidencePhotoUrl;
  const latestTempPhoto = [...vitals.temperature.history].reverse().find(h => h.evidencePhotoUrl)?.evidencePhotoUrl;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Neon Circle Logic
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rawProgress / 100) * circumference;

  const getNeonColor = (percent: number) => {
    if (percent === 0) return '#D1D5DB'; // Gray 300
    if (percent <= 25) return '#FF2E2E'; // Neon Red
    if (percent <= 50) return '#FFBB00'; // Neon Amber
    if (percent <= 75) return '#00E5FF'; // Neon Cyan
    return '#00FF94'; // Neon Green
  };

  const neonColor = getNeonColor(rawProgress);

  return (
    <div className="bg-[#F0F4F9] h-full overflow-y-auto pb-24 font-sans relative">
      <div className="p-4 space-y-4">
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-3">
            
            {/* Task Completed - Neon Glow Design */}
            <div className="col-span-2 bg-white p-6 rounded-[24px] shadow-sm flex items-center justify-between relative overflow-hidden">
                <div className="flex flex-col justify-center z-10">
                     <h3 className="text-lg font-bold text-[#1F1F1F] mb-1">Daily Progress</h3>
                     <p className="text-sm text-[#444746] font-medium mb-4">
                        {completedCount} of {tasks.length} tasks completed
                     </p>
                     
                     <div className="flex items-center space-x-2 bg-[#F0F4F9] px-3 py-1.5 rounded-full w-fit">
                        <div 
                            className="w-2 h-2 rounded-full animate-pulse" 
                            style={{ backgroundColor: neonColor, boxShadow: `0 0 8px ${neonColor}` }}
                        ></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#444746]">
                            {rawProgress === 100 ? 'Completed' : 'Active'}
                        </span>
                     </div>
                </div>
                
                {/* Neon Circular Animation */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                        {/* Track Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="#F3F4F6"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                        
                        {/* Glow/Neon Progress Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={neonColor}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{ 
                                filter: `drop-shadow(0 0 6px ${neonColor})`,
                            }}
                        />
                    </svg>
                    
                    {/* Centered Percentage */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span 
                            className="text-3xl font-black tracking-tighter transition-colors duration-500"
                            style={{ color: neonColor, textShadow: `0 0 10px ${neonColor}40` }}
                        >
                            {displayProgress}%
                        </span>
                    </div>
                </div>
            </div>

            {/* BP Widget */}
            <button 
                onClick={() => setActiveModal('BP')}
                className="bg-[#FFD8E4] p-5 rounded-[24px] flex flex-col justify-between h-36 items-start text-[#31111D] hover:opacity-90 transition-opacity"
            >
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mb-2">
                     <Heart className="w-5 h-5 fill-current" />
                </div>
                <span className="text-3xl font-bold">{vitals.bloodPressure.current}</span>
                <span className="text-xs font-bold uppercase opacity-60">BP mmHg</span>
            </button>

             {/* Temp Widget */}
             <button 
                onClick={() => setActiveModal('TEMP')}
                className="bg-[#FFDCC2] p-5 rounded-[24px] flex flex-col justify-between h-36 items-start text-[#2E1500] hover:opacity-90 transition-opacity"
            >
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mb-2">
                    <Thermometer className="w-5 h-5" />
                </div>
                <span className="text-3xl font-bold">{vitals.temperature.current}°</span>
                <span className="text-xs font-bold uppercase opacity-60">Temp F</span>
            </button>
        </div>

        <h3 className="text-xl font-bold text-[#1F1F1F] mt-6 ml-2">Today's Timeline</h3>
        
        {/* Timeline */}
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div key={task.id} className="flex gap-4">
               {/* Time Column */}
               <div className="flex flex-col items-center pt-2 min-w-[3rem]">
                   <span className="text-xs font-bold text-[#444746]">{task.startTime}</span>
                   <div className={`w-[2px] h-full mt-2 rounded-full ${task.status === TaskStatus.COMPLETED ? 'bg-[#0B57D0]' : 'bg-[#E1E3E1]'}`}></div>
               </div>

               {/* Card */}
               <div className={`flex-1 p-5 rounded-[20px] bg-white border border-transparent ${
                   task.status === TaskStatus.COMPLETED ? 'bg-white' : 'bg-white/60'
               }`}>
                  <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className={`font-bold text-[#1F1F1F] text-base ${task.status !== TaskStatus.COMPLETED && 'text-[#444746]'}`}>{task.title}</h4>
                            {task.status === TaskStatus.COMPLETED ? (
                                <span className="inline-flex items-center text-xs font-bold text-[#146C2E] mt-1">
                                    <CircleCheck className="w-4 h-4 mr-1" /> Completed
                                </span>
                            ) : (
                                <span className="text-xs text-[#444746] mt-1 block">Scheduled</span>
                            )}
                        </div>
                        
                        {/* Evidence Photo Thumbnail */}
                        {task.evidence && task.evidence.length > 0 && task.evidence[0].type === 'PHOTO' && (
                            <div 
                              className="w-16 h-16 rounded-[16px] overflow-hidden ml-3 border-2 border-[#E1E3E1] cursor-pointer"
                              onClick={() => setSelectedImage(task.evidence![0].content)}
                            >
                                 <img src={task.evidence[0].content} alt="Evidence" className="w-full h-full object-cover" />
                            </div>
                        )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals History Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center backdrop-blur-[2px]"
          onClick={() => setActiveModal(null)}
        >
          <div 
             className="bg-[#F0F4F9] w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10"
             onClick={e => e.stopPropagation()}
          >
             <div className="p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                    {activeModal === 'BP' ? 'Blood Pressure' : 'Temperature'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-[#E1E3E1] rounded-full hover:bg-[#C4C7C5]">
                    <X className="w-6 h-6 text-[#444746]" />
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto max-h-[70vh] bg-[#F0F4F9]">
                <div className="bg-white rounded-[24px] p-6 h-64 w-full mb-6 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activeModal === 'BP' ? vitals.bloodPressure.history : vitals.temperature.history}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="dayLabel" axisLine={false} tickLine={false} tick={{fill: '#444746', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#444746', fontSize: 12}} domain={['auto', 'auto']} />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            />
                            {activeModal === 'BP' ? (
                                <>
                                    <Line type="monotone" dataKey="splitValue.sys" stroke="#B3261E" strokeWidth={4} dot={{fill: '#B3261E', r: 4, strokeWidth: 0}} />
                                    <Line type="monotone" dataKey="splitValue.dia" stroke="#0B57D0" strokeWidth={4} dot={{fill: '#0B57D0', r: 4, strokeWidth: 0}} />
                                </>
                            ) : (
                                <Line type="monotone" dataKey="value" stroke="#E65100" strokeWidth={4} dot={{fill: '#E65100', r: 4, strokeWidth: 0}} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Evidence Tile */}
                <h3 className="text-sm font-bold text-[#444746] uppercase tracking-wide mb-3 pl-2">Latest Reading</h3>
                {(activeModal === 'BP' && latestBpPhoto) || (activeModal === 'TEMP' && latestTempPhoto) ? (
                     <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-black shadow-sm">
                         <img 
                            src={activeModal === 'BP' ? latestBpPhoto : latestTempPhoto} 
                            alt="Evidence" 
                            className="w-full h-full object-cover"
                            onClick={() => setSelectedImage(activeModal === 'BP' ? latestBpPhoto! : latestTempPhoto!)}
                         />
                         <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-sm">
                             <CircleCheck className="w-4 h-4 text-[#146C2E] mr-1.5" />
                             <span className="text-xs font-bold text-[#001D35]">Verified by Caregiver</span>
                         </div>
                     </div>
                 ) : (
                     <div className="bg-white rounded-[24px] p-8 text-center border-2 border-dashed border-[#C4C7C5]">
                         <p className="text-sm text-[#444746] font-medium">No photos captured recently.</p>
                     </div>
                 )}
             </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
            <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
                <X className="w-6 h-6 text-white" />
            </button>
            <img src={selectedImage} alt="Evidence Full" className="max-w-full max-h-[90vh] rounded-[24px] shadow-2xl" />
        </div>
      )}
    </div>
  );
};