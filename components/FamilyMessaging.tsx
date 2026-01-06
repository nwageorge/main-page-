import React, { useState } from 'react';
import { Search, Send, ChevronLeft, User, Users, Phone, Video, Camera, Plus, ChevronRight, MoreVertical } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl?: string;
  isGroup: boolean;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  isMe: boolean;
  time: string;
}

const CONTACTS: Contact[] = [
  { 
    id: 'family-room', 
    name: 'Family Room', 
    avatarColor: 'bg-[#4285F4]', 
    isGroup: true, 
    lastMessage: 'Dad looks great today!', 
    time: '10:30 AM', 
    unreadCount: 2 
  },
  { 
    id: 'mom', 
    name: 'Mom', 
    avatarColor: 'bg-[#9B72CB]', 
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    isGroup: false, 
    lastMessage: 'Did you call the pharmacy?', 
    time: 'Yesterday' 
  },
  { 
    id: 'tom', 
    name: 'Brother (Tom)', 
    avatarColor: 'bg-[#146C2E]', 
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    isGroup: false, 
    lastMessage: 'I can take the shift on Sunday.', 
    time: 'Tuesday' 
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'family-room': [
     { id: '1', text: 'Morning everyone! Caregiver arrived on time.', sender: 'Mom', isMe: false, time: '08:00 AM' },
     { id: '2', text: 'Great. I will stop by later.', sender: 'Me', isMe: true, time: '08:05 AM' },
     { id: '3', text: 'Dad looks great today!', sender: 'Tom', isMe: false, time: '10:30 AM' },
  ],
  'mom': [
     { id: '1', text: 'Did you call the pharmacy?', sender: 'Mom', isMe: false, time: 'Yesterday' },
  ],
  'tom': [
     { id: '1', text: 'I can take the shift on Sunday.', sender: 'Tom', isMe: false, time: 'Tuesday' },
  ]
};

export const FamilyMessaging: React.FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const activeContact = CONTACTS.find(c => c.id === selectedContactId);
  const activeMessages = selectedContactId ? (messages[selectedContactId] || []) : [];

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedContactId) return;
    
    const newMsg: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'Me',
        isMe: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
        ...prev,
        [selectedContactId]: [...(prev[selectedContactId] || []), newMsg]
    }));
    setInputText('');
  };

  if (selectedContactId && activeContact) {
      // Chat View - Material 3 Style
      return (
          <div className="flex flex-col h-full bg-[#F0F4F9] font-sans">
              <div className="bg-[#F0F4F9] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
                  <div className="flex items-center">
                      <button onClick={() => setSelectedContactId(null)} className="p-2 -ml-2 hover:bg-[#E1E3E1] rounded-full transition-colors mr-2">
                          <ChevronLeft className="w-6 h-6 text-[#1F1F1F]" />
                      </button>
                      <div className="flex items-center">
                           <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                               {activeContact.avatarUrl ? (
                                   <img src={activeContact.avatarUrl} alt="" className="w-full h-full object-cover" />
                               ) : (
                                   <div className={`w-full h-full ${activeContact.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>{activeContact.name[0]}</div>
                               )}
                           </div>
                           <span className="text-lg font-bold text-[#1F1F1F]">{activeContact.name}</span>
                      </div>
                  </div>
                  <div className="flex space-x-2 text-[#444746]">
                      <button className="p-2 hover:bg-[#E1E3E1] rounded-full">
                          <Phone className="w-6 h-6" />
                      </button>
                      <button className="p-2 hover:bg-[#E1E3E1] rounded-full">
                          <MoreVertical className="w-6 h-6" />
                      </button>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2"> 
                  {activeMessages.map((msg, i) => {
                      const isMe = msg.isMe;
                      return (
                      <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
                          <div className={`max-w-[75%] px-5 py-3 text-[16px] leading-relaxed rounded-[24px] ${
                              isMe 
                              ? 'bg-[#0B57D0] text-white rounded-br-sm' 
                              : 'bg-[#E1E3E1] text-[#1F1F1F] rounded-bl-sm'
                          }`}>
                              <p>{msg.text}</p>
                          </div>
                      </div>
                  )})}
              </div>

              <div className="p-4 bg-[#F0F4F9] pb-safe">
                  <div className="bg-[#E1E3E1] rounded-full p-2 flex items-center">
                      <button className="p-2 bg-[#F0F4F9] rounded-full text-[#444746] mr-2">
                          <Plus className="w-5 h-5" />
                      </button>
                      <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-transparent border-none outline-none text-[#1F1F1F] placeholder-[#444746] text-lg px-2"
                        placeholder="Message"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className={`p-3 rounded-full transition-all ${
                            inputText.trim() ? 'bg-[#0B57D0] text-white' : 'text-[#747775]'
                        }`}
                      >
                          <Send className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // List View
  return (
    <div className="flex flex-col h-full bg-[#F0F4F9] font-sans">
        <div className="px-6 pt-4 pb-2">
            <h1 className="text-3xl font-bold text-[#1F1F1F] mb-6 tracking-tight">Messages</h1>
            
            <div className="relative bg-[#E1E3E1] rounded-full flex items-center px-4 py-3">
                <Search className="w-5 h-5 text-[#444746] mr-3" />
                <input 
                    placeholder="Search conversations" 
                    className="bg-transparent border-none outline-none text-[#1F1F1F] placeholder-[#444746] text-base w-full"
                />
                <div className="w-8 h-8 rounded-full bg-[#0B57D0] text-white flex items-center justify-center font-bold text-xs ml-2">
                    SJ
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 mt-4 space-y-1">
            {CONTACTS.map((contact, index) => (
                <div 
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className="flex items-center p-4 cursor-pointer hover:bg-[#E1E3E1] rounded-[20px] transition-colors"
                >
                    <div className="relative mr-4">
                         <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden ${contact.avatarColor}`}>
                            {contact.avatarUrl ? (
                                <img src={contact.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                contact.isGroup ? <Users className="w-6 h-6" /> : contact.name[0]
                            )}
                        </div>
                        {contact.unreadCount && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0B57D0] rounded-full border-2 border-[#F0F4F9]"></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className={`font-bold text-lg truncate ${contact.unreadCount ? 'text-[#1F1F1F]' : 'text-[#444746]'}`}>{contact.name}</h3>
                            <span className={`text-xs ${contact.unreadCount ? 'text-[#0B57D0] font-bold' : 'text-[#444746]'}`}>{contact.time}</span>
                        </div>
                        <p className={`text-base truncate ${contact.unreadCount ? 'text-[#1F1F1F] font-bold' : 'text-[#444746]'}`}>
                            {contact.lastMessage}
                        </p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="absolute bottom-24 right-6">
            <button className="w-14 h-14 bg-[#0B57D0] text-white rounded-[16px] shadow-lg flex items-center justify-center hover:bg-[#0842A0] transition-colors">
                <Plus className="w-7 h-7" />
            </button>
        </div>
    </div>
  );
};