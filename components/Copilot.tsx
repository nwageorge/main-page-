import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getCopilotResponse } from '../services/geminiService';
import { Send, Sparkles, Image as ImageIcon, Mic, X, StopCircle, Compass } from 'lucide-react';

interface CopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Copilot: React.FC<CopilotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi Sarah. How can I help you with your shift today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await getCopilotResponse(userMsg.text, history);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose}></div>
        
        {/* Mobile Sheet Container - Gemini Style */}
        <div className="bg-[#FFFFFF] w-full h-[90vh] rounded-t-[32px] flex flex-col shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-10 duration-300 z-10">
            
            {/* Header */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-center z-20 shrink-0">
                 <div className="flex items-center space-x-2">
                     <Sparkles className="w-6 h-6 text-gemini" />
                     <span className="text-transparent bg-clip-text bg-gemini font-bold text-lg">ADLTrack Care</span>
                 </div>
                <button onClick={onClose} className="p-2 bg-[#F0F4F9] rounded-full hover:bg-[#E1E3E1] transition-colors">
                    <X className="w-6 h-6 text-[#444746]" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 space-y-8">
                {messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {msg.role === 'user' ? (
                            <div className="bg-[#E8DEF8] text-[#1D192B] px-6 py-4 rounded-[24px] rounded-tr-sm max-w-[85%] text-[16px] font-medium leading-relaxed">
                                {msg.text}
                            </div>
                        ) : (
                            <div className="flex space-x-4 max-w-[95%]">
                                {(idx === 0 || messages[idx-1]?.role === 'user') && (
                                     <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                                         <Sparkles className="w-5 h-5 text-gemini" />
                                     </div>
                                )}
                                <div className={`text-[#1F1F1F] text-[16px] leading-relaxed ${(idx !== 0 && messages[idx-1]?.role === 'model') ? 'ml-12' : ''}`}>
                                    {msg.text}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-center space-x-2 ml-12">
                         <div className="w-2 h-2 bg-gemini rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                         <div className="w-2 h-2 bg-gemini rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                         <div className="w-2 h-2 bg-gemini rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Floating Gemini Input Bar */}
            <div className="absolute bottom-8 left-0 right-0 px-6">
                <div className="relative bg-[#F0F4F9] rounded-[32px] p-2 flex items-center shadow-sm border border-transparent focus-within:border-[#9B72CB] transition-colors">
                    <button className="p-3 text-[#444746] hover:bg-[#E1E3E1] rounded-full transition-colors">
                        <ImageIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type, talk, or share a photo..."
                        className="flex-1 bg-transparent border-none outline-none px-2 text-[#1F1F1F] placeholder-[#444746] text-lg h-12"
                        autoFocus
                    />
                    {input.trim() ? (
                         <button
                            onClick={handleSend}
                            className="p-3 text-[#0B57D0] hover:bg-[#D3E3FD] rounded-full transition-colors"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    ) : (
                        <button className="p-3 text-[#444746] hover:bg-[#E1E3E1] rounded-full transition-colors">
                            <Mic className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};