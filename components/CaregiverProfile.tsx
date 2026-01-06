import React, { useState, useRef, useEffect } from 'react';
import { Caregiver, ShiftSession } from '../types';
import { User, Star, Phone, MessageCircle, X, Send, Play, Square, ShieldCheck, Clock, Award, Briefcase } from 'lucide-react';

interface CaregiverProfileProps {
  caregiver: Caregiver;
  currentShift: ShiftSession;
  totalDuration?: number; // accumulated time for the day in ms
  viewMode?: 'caregiver' | 'family';
  onStartShift?: () => void;
  onEndShift?: () => void;
}

export const CaregiverProfile: React.FC<CaregiverProfileProps> = ({ 
  caregiver, 
  currentShift,
  totalDuration = 0,
  viewMode = 'caregiver',
  onStartShift,
  onEndShift
}) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  const [messages, setMessages] = useState([
    { id: 1, text: viewMode === 'family' ? 'Hello! How can the care team help you today?' : 'Good morning Sarah. Dispatch shows you arrived on time.', sender: 'other', time: '08:02 AM' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showChatModal) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChatModal]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: chatInput, sender: 'me', time: 'Now' }]);
    setChatInput('');
    setTimeout(() => {
         setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Thanks for the message.', sender: 'other', time: 'Now' }]);
    }, 2000);
  };

  const formatDuration = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F4F9] relative overflow-y-auto font-sans">
      
      {/* Hero Profile Section */}
      <div className="pt-8 pb-8 px-6 flex flex-col items-center bg-white rounded-b-[40px] shadow-sm border-b border-white">
         <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F0F4F9] shadow-lg mb-4 relative">
             {caregiver.avatarUrl ? (
                 <img src={caregiver.avatarUrl} alt={caregiver.name} className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-400" />
                 </div>
             )}
             <div className={`absolute bottom-1 right-1 w-6 h-6 border-4 border-white rounded-full ${currentShift.isActive ? 'bg-[#146C2E]' : 'bg-[#B3261E]'}`}></div>
         </div>
         <h1 className="text-2xl font-bold text-[#1F1F1F] text-center tracking-tight">{caregiver.name}</h1>
         <div className="flex items-center mt-1 text-[#444746] text-sm font-bold bg-[#F0F4F9] px-4 py-1.5 rounded-full mb-4">
            {caregiver.title}
         </div>

         {/* FAMILY VIEW STATUS BUTTON */}
         {viewMode === 'family' && (
             <div className={`px-6 py-2 rounded-full font-bold text-sm flex items-center shadow-sm mb-4 ${
                 currentShift.isActive 
                 ? 'bg-[#E6F4EA] text-[#146C2E] border border-[#C4EED0]' 
                 : 'bg-[#F9DEDC] text-[#B3261E] border border-[#F2B8B5]'
             }`}>
                 <div className={`w-2.5 h-2.5 rounded-full mr-2 ${currentShift.isActive ? 'bg-[#146C2E] animate-pulse' : 'bg-[#B3261E]'}`}></div>
                 {currentShift.isActive ? 'Caregiver Active' : 'Caregiver Offline'}
             </div>
         )}

         {/* Stats Row - Colorful Cards */}
         <div className="grid grid-cols-3 gap-3 mt-4 w-full">
            <div className="bg-[#FFF8E1] p-3 rounded-[20px] flex flex-col items-center justify-center text-center shadow-sm border border-transparent hover:border-[#F9A825] transition-colors">
                <div className="bg-[#FFD54F] p-2 rounded-full mb-2">
                    <Star className="w-5 h-5 text-[#4E342E] fill-current" />
                </div>
                <span className="text-xl font-bold text-[#4E342E]">{caregiver.rating}</span>
                <span className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wide">Rating</span>
            </div>

            <div className="bg-[#E3F2FD] p-3 rounded-[20px] flex flex-col items-center justify-center text-center shadow-sm border border-transparent hover:border-[#4285F4] transition-colors">
                 <div className="bg-[#90CAF9] p-2 rounded-full mb-2">
                    <Briefcase className="w-5 h-5 text-[#0D47A1]" />
                </div>
                <span className="text-xl font-bold text-[#0D47A1]">{caregiver.totalShifts}</span>
                <span className="text-[10px] font-bold text-[#1565C0] uppercase tracking-wide">Shifts</span>
            </div>

            <div className="bg-[#E8F5E9] p-3 rounded-[20px] flex flex-col items-center justify-center text-center shadow-sm border border-transparent hover:border-[#2E7D32] transition-colors">
                 <div className="bg-[#A5D6A7] p-2 rounded-full mb-2">
                    <Award className="w-5 h-5 text-[#1B5E20]" />
                </div>
                <span className="text-xl font-bold text-[#1B5E20]">{caregiver.reliabilityScore}%</span>
                <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wide">Reliable</span>
            </div>
         </div>
      </div>

      <div className="px-6 space-y-6 pt-6 pb-32">
        {/* Simplified Shift Card (Caregiver Only) */}
        {viewMode === 'caregiver' && onStartShift && onEndShift && (
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E1E3E1]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#1F1F1F]">Shift Status</h3>
                        <div className="flex items-center mt-1">
                            <div className={`w-2.5 h-2.5 rounded-full mr-2 ${currentShift.isActive ? 'bg-[#146C2E] animate-pulse' : 'bg-[#747775]'}`}></div>
                            <span className="text-[#444746] font-medium">
                                {currentShift.isActive ? 'Active Now' : 'Offline'}
                            </span>
                        </div>
                        <p className="text-sm text-[#444746] mt-3 font-medium">
                            {currentShift.isActive && currentShift.startTime
                                ? `Started at ${new Date(currentShift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                : `Total today: ${formatDuration(totalDuration)}`
                            }
                        </p>
                    </div>
                    
                    <button
                        onClick={currentShift.isActive ? onEndShift : onStartShift}
                        className={`px-6 py-3 rounded-full font-bold transition-all active:scale-95 flex items-center ${
                            currentShift.isActive 
                            ? 'bg-[#F9DEDC] text-[#B3261E] hover:bg-[#F2B8B5]' // Subtle Red
                            : 'bg-[#0B57D0] text-white hover:bg-[#0842A0] shadow-md' // Brand Blue
                        }`}
                    >
                        {currentShift.isActive ? (
                            <>
                                <Square className="w-4 h-4 mr-2 fill-current" />
                                Clock Out
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2 fill-current" />
                                Clock In
                            </>
                        )}
                    </button>
                </div>
            </div>
        )}

        {/* Contact Actions */}
        <h3 className="text-sm font-bold text-[#444746] uppercase tracking-wider ml-2">Support</h3>
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => setShowChatModal(true)}
                className="bg-white p-5 rounded-[24px] shadow-sm hover:bg-[#F0F4F9] transition-colors flex flex-col items-center justify-center h-32 active:scale-95 border border-transparent hover:border-[#D3E3FD]"
            >
                <div className="w-12 h-12 bg-[#D3E3FD] rounded-full flex items-center justify-center mb-3 text-[#041E49]">
                    <MessageCircle className="w-6 h-6" />
                </div>
                <span className="font-bold text-[#1F1F1F]">Message</span>
                <span className="text-xs text-[#444746] font-medium">Care Team</span>
            </button>
            <button 
                onClick={() => setShowCallModal(true)}
                className="bg-white p-5 rounded-[24px] shadow-sm hover:bg-[#F0F4F9] transition-colors flex flex-col items-center justify-center h-32 active:scale-95 border border-transparent hover:border-[#F9DEDC]"
            >
                 <div className="w-12 h-12 bg-[#F9DEDC] rounded-full flex items-center justify-center mb-3 text-[#410E0B]">
                    <Phone className="w-6 h-6" />
                </div>
                <span className="font-bold text-[#1F1F1F]">Emergency</span>
                <span className="text-xs text-[#444746] font-medium">Dispatch</span>
            </button>
        </div>

        {/* Certs */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm">
            <h3 className="font-bold text-[#1F1F1F] mb-4 text-lg">Credentials</h3>
            <div className="space-y-3">
                {caregiver.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center text-sm font-medium text-[#444746] bg-[#F0F4F9] p-3 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-[#146C2E] mr-3" />
                        {cert}
                    </div>
                ))}
            </div>
        </div>
        
        {viewMode === 'caregiver' && (
             <button className="w-full py-4 text-[#B3261E] font-bold bg-[#F9DEDC] rounded-[24px] hover:bg-[#F2B8B5] transition-colors">
                Sign Out
             </button>
        )}
      </div>

      {/* Modals */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-[#F0F4F9] rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl">
                <div className="w-20 h-20 bg-[#C4EED0] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-10 h-10 text-[#072711]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">555-019-2834</h2>
                <p className="text-[#444746] mb-8 font-medium">Priority Dispatch Line</p>
                <div className="space-y-3">
                    <button className="w-full bg-[#146C2E] text-white font-bold py-4 rounded-full shadow-lg">Call Now</button>
                    <button onClick={() => setShowCallModal(false)} className="w-full text-[#444746] font-bold py-3 hover:bg-[#E1E3E1] rounded-full transition-colors">Cancel</button>
                </div>
            </div>
        </div>
      )}

      {showChatModal && (
          <div className="fixed inset-0 z-50 bg-[#F0F4F9] flex flex-col">
              <div className="px-6 py-4 bg-white shadow-sm flex items-center justify-between">
                  <h3 className="font-bold text-xl text-[#1F1F1F]">Supervisor Chat</h3>
                  <button onClick={() => setShowChatModal(false)} className="p-2 bg-[#E1E3E1] rounded-full hover:bg-[#C4C7C5] transition-colors"><X className="w-6 h-6 text-[#444746]" /></button>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  {messages.map(m => (
                      <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : ''}`}>
                          <div className={`px-5 py-3 rounded-[20px] max-w-[80%] text-[16px] leading-relaxed shadow-sm ${m.sender === 'me' ? 'bg-[#0B57D0] text-white rounded-br-sm' : 'bg-white text-[#1F1F1F] rounded-bl-sm'}`}>
                              {m.text}
                          </div>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-white border-t border-[#E1E3E1] pb-safe flex gap-3 items-center">
                  <input 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-[#F0F4F9] rounded-full px-6 py-3 text-[#1F1F1F] placeholder-[#444746] outline-none border border-transparent focus:border-[#0B57D0]" 
                    placeholder="Message..." 
                  />
                  <button onClick={handleSendMessage} className={`p-3 rounded-full transition-colors ${chatInput.trim() ? 'bg-[#0B57D0] text-white' : 'bg-[#E1E3E1] text-[#747775]'}`}>
                      <Send className="w-6 h-6" />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};