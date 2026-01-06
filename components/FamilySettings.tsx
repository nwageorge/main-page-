import React, { useState } from 'react';
import { Shield, Key, Users, LogOut, Lock, ChevronRight, Copy, Check, Smartphone, Camera } from 'lucide-react';
import { UserProfile } from '../types';

interface FamilySettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export const FamilySettings: React.FC<FamilySettingsProps> = ({ userProfile, onUpdateProfile }) => {
  const [isPOA, setIsPOA] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleGenerate = () => {
    setGeneratedCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    setShowInvite(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateProfile({ avatarUrl: url });
    }
  };

  return (
    <div className="h-full bg-[#F2F2F7] overflow-y-auto font-sans pb-24">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Settings</h1>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
            <label className="relative cursor-pointer group mb-3">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-400">{userProfile.name.split(' ').map(n => n[0]).join('')}</span>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-[#F2F2F7]">
                    <Camera className="w-4 h-4 text-white" />
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
            <h2 className="text-xl font-bold text-slate-900">{userProfile.name}</h2>
            <p className="text-slate-500 text-sm">{userProfile.email}</p>
        </div>

        {/* Security Group */}
        <div className="mb-2 px-4 uppercase text-xs font-semibold text-slate-500 tracking-wide">Security</div>
        <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 active:bg-slate-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                    <div className="bg-orange-500 p-1.5 rounded-lg">
                        <Lock className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-medium text-slate-900">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-500 p-1.5 rounded-lg">
                         <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-medium text-slate-900">Two-Factor Auth</span>
                </div>
                <button 
                    onClick={() => setTwoFactor(!twoFactor)} 
                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${twoFactor ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${twoFactor ? 'translate-x-5' : ''}`} />
                </button>
            </div>
        </div>

        {/* Access Control Group */}
        <div className="mb-2 px-4 uppercase text-xs font-semibold text-slate-500 tracking-wide">Care Access</div>
        <div className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm p-4">
             {isPOA ? (
                <>
                    <div className="flex items-center mb-4">
                         <div className="bg-blue-500 p-1.5 rounded-lg mr-3">
                            <Users className="w-4 h-4 text-white" />
                         </div>
                         <div>
                             <h4 className="font-medium text-slate-900">Invite Family Member</h4>
                             <p className="text-xs text-slate-500">Generate a secure code for read-only access.</p>
                         </div>
                    </div>

                    {!showInvite ? (
                        <button 
                            onClick={handleGenerate}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-colors"
                        >
                            Generate Code
                        </button>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 text-center font-mono text-xl font-bold tracking-widest text-slate-900">
                                    {generatedCode}
                                </div>
                                <button 
                                    onClick={copyToClipboard}
                                    className="p-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-500" />}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-4">
                     <div className="flex items-center">
                         <div className="bg-purple-500 p-1.5 rounded-lg mr-3">
                            <Key className="w-4 h-4 text-white" />
                         </div>
                         <h4 className="font-medium text-slate-900">Redeem Code</h4>
                    </div>
                    <div className="flex space-x-2">
                        <input 
                            placeholder="X8J9L2"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono uppercase"
                        />
                        <button className="bg-blue-500 text-white px-5 rounded-xl font-bold text-sm">
                            Add
                        </button>
                    </div>
                </div>
            )}
            
            {/* Dev Toggle */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <button onClick={() => setIsPOA(!isPOA)} className="text-[10px] text-slate-400 font-medium">
                    Toggle Role (Dev: {isPOA ? 'POA' : 'Member'})
                </button>
            </div>
        </div>

        <button className="w-full bg-white text-red-500 font-medium py-3 rounded-2xl shadow-sm mb-6">
            Log Out
        </button>
        
        <p className="text-center text-xs text-slate-400">ADLTrack v2.4.1</p>
      </div>
    </div>
  );
};