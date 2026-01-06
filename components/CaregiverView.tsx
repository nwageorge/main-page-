import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, ShiftSession, Evidence, VitalRegistry } from '../types';
import { Camera, CircleCheck, CircleAlert, FileText, ChevronRight, X, Sparkles, Activity, Heart, Thermometer, MoreHorizontal, Clock, PenTool } from 'lucide-react';

interface CaregiverViewProps {
  tasks: Task[];
  shift: ShiftSession;
  vitals: VitalRegistry;
  onStartShift: () => void;
  onEndShift: () => void;
  onUpdateTask: (taskId: string, status: TaskStatus, evidence?: Evidence) => void;
  onUpdateVital: (type: 'BP' | 'TEMP', value: string | number, photoUrl?: string) => void;
}

export const CaregiverView: React.FC<CaregiverViewProps> = ({
  tasks,
  shift,
  vitals,
  onStartShift,
  onEndShift,
  onUpdateTask,
  onUpdateVital
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [activeVitalModal, setActiveVitalModal] = useState<'BP' | 'TEMP' | null>(null);
  const [vitalInput, setVitalInput] = useState('');
  const [vitalPhoto, setVitalPhoto] = useState<File | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEvidenceNote('');
    setEvidenceFile(null);
  };

  const handleCompleteTask = () => {
    if (!selectedTask) return;
    
    // 1. Save Note if exists (Update state but keep status PENDING or SAME to allow second update)
    if (evidenceNote.trim()) {
        const noteEvidence: Evidence = {
            id: Date.now().toString() + '-note',
            type: 'NOTE',
            content: evidenceNote,
            timestamp: Date.now()
        };
        // We call this first. App logic appends evidence.
        onUpdateTask(selectedTask.id, selectedTask.status, noteEvidence);
    }

    // 2. Save Photo if exists and Finalize Status
    const photoEvidence: Evidence | undefined = evidenceFile ? {
        id: Date.now().toString() + '-file',
        type: 'PHOTO',
        content: URL.createObjectURL(evidenceFile),
        timestamp: Date.now()
    } : undefined;

    // This call will finalize the status to COMPLETED and add photo if present
    onUpdateTask(selectedTask.id, TaskStatus.COMPLETED, photoEvidence);
    setSelectedTask(null);
  };

  const handleSaveVital = () => {
    if (!activeVitalModal) return;
    const photoUrl = vitalPhoto ? URL.createObjectURL(vitalPhoto) : undefined;
    if (activeVitalModal === 'BP') {
      onUpdateVital('BP', vitalInput, photoUrl);
    } else {
      onUpdateVital('TEMP', parseFloat(vitalInput), photoUrl);
    }
    setActiveVitalModal(null);
    setVitalInput('');
    setVitalPhoto(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F4F9] relative font-sans overflow-y-auto scrollbar-hide">
      
      {/* Dashboard Header */}
      <div className="pt-6 pb-4 px-6">
        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6 tracking-tight">
             Good Morning, <span className="text-transparent bg-clip-text bg-gemini">Sarah</span>
        </h2>
        
        {/* Vitals Grid */}
        <div className="grid grid-cols-2 gap-4">
            {/* BP Card - Soft Red/Rose */}
            <button 
                onClick={() => setActiveVitalModal('BP')}
                className="rounded-[24px] bg-[#F2B8B5] p-5 flex flex-col justify-between h-[120px] text-[#601410] shadow-sm hover:opacity-90 transition-all active:scale-95"
            >
                <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">BP mmHg</span>
                    <div className="bg-white/30 p-1.5 rounded-full">
                         <Heart className="w-5 h-5 fill-current" />
                    </div>
                </div>
                <div className="text-left">
                    <span className="text-3xl font-bold">{vitals.bloodPressure.current}</span>
                    <span className="text-xs font-medium opacity-80 block mt-1">
                        Last: {vitals.bloodPressure.history[vitals.bloodPressure.history.length-2]?.value}
                    </span>
                </div>
            </button>

            {/* Temp Card - Soft Orange */}
            <button 
                onClick={() => setActiveVitalModal('TEMP')}
                className="rounded-[24px] bg-[#FFDCC2] p-5 flex flex-col justify-between h-[120px] text-[#2E1500] shadow-sm hover:opacity-90 transition-all active:scale-95"
            >
                <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Temp °F</span>
                    <div className="bg-white/30 p-1.5 rounded-full">
                         <Thermometer className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-left">
                    <span className="text-3xl font-bold">{vitals.temperature.current}°</span>
                    <span className="text-xs font-medium opacity-80 block mt-1">
                        Last: {vitals.temperature.history[vitals.temperature.history.length-2]?.value}°
                    </span>
                </div>
            </button>
        </div>
      </div>

      {/* Task List */}
      <div className="px-6 pb-32 space-y-4">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-[#1F1F1F]">Today's Care Plan</h3>
            <span className="text-sm font-bold text-[#444746] bg-white px-3 py-1 rounded-full border border-[#E1E3E1]">
                {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}/{tasks.length} Done
            </span>
        </div>
        
        {tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => handleTaskClick(task)}
            className={`p-5 rounded-[24px] border transition-all active:scale-95 cursor-pointer flex flex-col justify-between min-h-[120px] relative overflow-hidden group ${
                task.status === TaskStatus.COMPLETED 
                ? 'bg-[#E6F4EA] border-[#C4EED0]' 
                : 'bg-white border-transparent shadow-sm hover:shadow-md'
            }`}
          >
             {/* Status Badge */}
             <div className="flex justify-between items-start mb-2">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.priority === TaskPriority.CRITICAL ? 'bg-[#F9DEDC] text-[#B3261E]' :
                    task.priority === TaskPriority.JOY ? 'bg-[#E8DEF8] text-[#4A4458]' :
                    'bg-[#F0F4F9] text-[#444746]'
                 }`}>
                     {task.priority}
                 </div>
                 {task.status === TaskStatus.COMPLETED ? (
                     <CircleCheck className="w-6 h-6 text-[#146C2E] fill-[#C4EED0]" />
                 ) : (
                     <div className="w-6 h-6 rounded-full border-2 border-[#E1E3E1] group-hover:border-[#0B57D0] transition-colors"></div>
                 )}
             </div>

             <div>
                 <h4 className={`font-bold text-lg mb-1 ${task.status === TaskStatus.COMPLETED ? 'text-[#1F1F1F] opacity-60 line-through' : 'text-[#1F1F1F]'}`}>
                     {task.title}
                 </h4>
                 <div className="flex items-center text-[#444746] text-xs font-medium">
                     <Clock className="w-3.5 h-3.5 mr-1" />
                     {task.startTime} - {task.endTime}
                 </div>
             </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelectedTask(null)}
        >
          <div 
            className="bg-[#F0F4F9] w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[28px] rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-start shrink-0">
               <div>
                   <h2 className="text-2xl font-bold text-[#1F1F1F] leading-tight pr-4">{selectedTask.title}</h2>
               </div>
               <button onClick={() => setSelectedTask(null)} className="p-2 bg-[#E1E3E1] rounded-full hover:bg-[#C4C7C5] transition-colors">
                   <X className="w-6 h-6 text-[#444746]" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               
               {/* Description */}
               <div>
                   <p className="text-[#444746] text-lg leading-relaxed">{selectedTask.description}</p>
                   <div className="flex items-center mt-3 text-sm font-bold text-[#0B57D0] bg-[#D3E3FD] px-3 py-1 rounded-lg w-fit">
                        <Clock className="w-4 h-4 mr-2" />
                        Due {selectedTask.startTime}
                   </div>
               </div>

               {/* Shift Notes Section (Requested Feature) */}
               <div className="space-y-3">
                    <h4 className="font-bold text-[#1F1F1F] flex items-center">
                        <PenTool className="w-5 h-5 mr-2 text-[#9B72CB]" />
                        Shift Notes
                    </h4>
                    <textarea
                        value={evidenceNote}
                        onChange={(e) => setEvidenceNote(e.target.value)}
                        placeholder="Add observations, patient mood, or extra details here..."
                        className="w-full bg-white border border-[#C4C7C5] rounded-[16px] p-4 text-[#1F1F1F] placeholder-[#747775] focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0] outline-none resize-none h-32 text-base transition-shadow"
                    />
               </div>

               {/* Evidence Section */}
               {selectedTask.requiredEvidence && (
                 <div className="space-y-4">
                    <h4 className="font-bold text-[#1F1F1F] flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-[#9B72CB]" />
                        Required Photo
                    </h4>
                    
                    <div 
                        onClick={() => document.getElementById('evidence-upload')?.click()}
                        className={`border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative overflow-hidden ${evidenceFile ? 'border-[#146C2E] bg-[#E6F4EA]' : 'border-[#747775] hover:bg-[#E1E3E1] bg-white'}`}
                    >
                        {evidenceFile ? (
                            <>
                                <img src={URL.createObjectURL(evidenceFile)} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Preview" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <CircleCheck className="w-8 h-8 text-[#146C2E] mb-2" />
                                    <span className="text-[#146C2E] font-bold">Photo Captured</span>
                                    <span className="text-xs text-[#0F5223] mt-1">Tap to retake</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-[#F0F4F9] p-3 rounded-full mb-3">
                                    <Camera className="w-6 h-6 text-[#444746]" />
                                </div>
                                <span className="font-medium text-[#1F1F1F]">Tap to capture photo</span>
                            </>
                        )}
                    </div>
                    <input 
                        type="file" 
                        id="evidence-upload" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                    />
                 </div>
               )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white border-t border-[#E1E3E1] shrink-0">
                 {selectedTask.status === TaskStatus.COMPLETED ? (
                     <button 
                        disabled
                        className="w-full bg-[#E6F4EA] text-[#146C2E] font-bold py-4 rounded-full flex items-center justify-center"
                     >
                        <CircleCheck className="w-5 h-5 mr-2" />
                        Task Completed
                     </button>
                 ) : (
                    <button 
                        onClick={handleCompleteTask}
                        className="w-full bg-[#0B57D0] text-white font-bold py-4 rounded-full hover:bg-[#0842A0] transition-colors shadow-md active:scale-[0.98]"
                    >
                        Mark as Complete
                    </button>
                 )}
            </div>
          </div>
        </div>
      )}
      
      {/* Vitals Input Modal */}
      {activeVitalModal && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-6"
            onClick={() => setActiveVitalModal(null)}
        >
            <div 
                className="bg-[#F0F4F9] rounded-[28px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className={`p-6 text-white ${activeVitalModal === 'BP' ? 'bg-[#B3261E]' : 'bg-[#E65100]'}`}>
                    <h3 className="text-xl font-bold flex items-center">
                        {activeVitalModal === 'BP' ? <Heart className="w-6 h-6 mr-2" /> : <Thermometer className="w-6 h-6 mr-2" />}
                        Record {activeVitalModal === 'BP' ? 'Blood Pressure' : 'Temperature'}
                    </h3>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-sm font-bold text-[#444746] ml-2 mb-1 block">
                            {activeVitalModal === 'BP' ? 'Value (sys/dia)' : 'Value (°F)'}
                        </label>
                        <input 
                            type={activeVitalModal === 'BP' ? "text" : "number"}
                            autoFocus
                            placeholder={activeVitalModal === 'BP' ? "120/80" : "98.6"}
                            value={vitalInput}
                            onChange={e => setVitalInput(e.target.value)}
                            className="w-full text-3xl font-bold bg-white border border-[#C4C7C5] rounded-[16px] px-4 py-4 text-[#1F1F1F] focus:border-[#0B57D0] focus:ring-4 focus:ring-[#D3E3FD] outline-none placeholder-[#E1E3E1] text-center"
                        />
                    </div>

                    {/* Vital Evidence Photo */}
                    <div>
                         <label className="text-sm font-bold text-[#444746] ml-2 mb-2 block">Evidence Photo (Optional)</label>
                         <div 
                            onClick={() => document.getElementById('vital-photo')?.click()}
                            className="border-2 border-dashed border-[#C4C7C5] rounded-[16px] h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors relative overflow-hidden"
                         >
                            {vitalPhoto ? (
                                <img src={URL.createObjectURL(vitalPhoto)} className="absolute inset-0 w-full h-full object-cover" alt="vital preview" />
                            ) : (
                                <Camera className="w-6 h-6 text-[#747775]" />
                            )}
                         </div>
                         <input type="file" id="vital-photo" className="hidden" accept="image/*" onChange={e => setVitalPhoto(e.target.files?.[0] || null)} />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setActiveVitalModal(null)} className="flex-1 py-3 font-bold text-[#444746] hover:bg-[#E1E3E1] rounded-full transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveVital}
                            disabled={!vitalInput}
                            className={`flex-1 py-3 font-bold text-white rounded-full transition-colors shadow-md ${!vitalInput ? 'opacity-50 cursor-not-allowed bg-[#747775]' : (activeVitalModal === 'BP' ? 'bg-[#B3261E]' : 'bg-[#E65100]')}`}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};