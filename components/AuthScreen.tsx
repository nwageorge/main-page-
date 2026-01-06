import React, { useState } from 'react';
import { UserRole } from '../types';
import { Sparkles, Shield, ArrowLeft, Briefcase, Users, HeartHandshake } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
  targetRole?: UserRole; // Optional prop to lock the screen to a specific role
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, targetRole, onBack }) => {
  // If targetRole is provided, we use it. Otherwise default to Caregiver (legacy behavior)
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole || UserRole.CAREGIVER);
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If no targetRole is passed, show the switcher (Original functionality)
  const showRoleSwitcher = !targetRole;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole);
    }, 1000);
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        onLogin(selectedRole);
    }, 800);
  };

  // Content configuration based on selected role
  const getRoleConfig = () => {
      switch(selectedRole) {
          case UserRole.ENTERPRISE:
              return {
                  icon: <Briefcase className="w-8 h-8 text-[#B3261E]" />,
                  color: 'text-[#B3261E]',
                  bg: 'bg-[#F9DEDC]',
                  title: 'Enterprise Portal',
                  sub: 'Sign in to your agency dashboard'
              };
          case UserRole.FAMILY:
              return {
                  icon: <Users className="w-8 h-8 text-[#1D192B]" />,
                  color: 'text-[#1D192B]',
                  bg: 'bg-[#E8DEF8]',
                  title: 'Family Portal',
                  sub: 'Connect with your loved ones'
              };
          default:
              return {
                  icon: <HeartHandshake className="w-8 h-8 text-[#146C2E]" />,
                  color: 'text-[#146C2E]',
                  bg: 'bg-[#E6F4EA]',
                  title: 'Caregiver Login',
                  sub: 'Access your shift companion'
              };
      }
  };

  const config = getRoleConfig();

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"></div>

      {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full hover:bg-black/5 transition-colors z-20">
              <ArrowLeft className="w-6 h-6 text-[#444746]" />
          </button>
      )}

      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Dynamic Icon */}
        <div className="mb-6 relative">
           <div className={`w-20 h-20 rounded-[24px] ${config.bg} shadow-sm flex items-center justify-center relative overflow-hidden`}>
             {config.icon}
           </div>
        </div>

        <h1 className="text-[2rem] font-bold text-[#1F1F1F] mb-1 tracking-tight text-center">{config.title}</h1>
        <p className="text-[#444746] text-center mb-8 text-lg">{config.sub}</p>

        {/* Legacy Role Switcher - Only visible if no specific target is enforced */}
        {showRoleSwitcher && (
            <div className="bg-white p-1 rounded-full border border-[#E1E3E1] flex w-full mb-8 shadow-sm">
                <button
                onClick={() => setSelectedRole(UserRole.CAREGIVER)}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedRole === UserRole.CAREGIVER 
                    ? 'bg-[#D3E3FD] text-[#041E49]' 
                    : 'text-[#444746] hover:bg-slate-50'
                }`}
                >
                Caregiver
                </button>
                <button
                onClick={() => setSelectedRole(UserRole.FAMILY)}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedRole === UserRole.FAMILY 
                    ? 'bg-[#E8DEF8] text-[#1D192B]' 
                    : 'text-[#444746] hover:bg-slate-50'
                }`}
                >
                Family
                </button>
            </div>
        )}

        {/* Social Login Buttons */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <button 
                onClick={handleSocialLogin}
                className="flex items-center justify-center py-3 px-4 bg-white border border-[#747775] rounded-full hover:bg-slate-50 transition-colors group"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.38-.01-.58z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-medium text-[#1F1F1F]">Google</span>
            </button>
            <button 
                onClick={handleSocialLogin}
                className="flex items-center justify-center py-3 px-4 bg-white border border-[#747775] rounded-full hover:bg-slate-50 transition-colors group"
            >
                <svg className="w-5 h-5 mr-2 text-[#1F1F1F]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.65-.95 2.96.2 4.13 1.93 4.13 1.93-.09.07-2.43 1.34-2.43 4.38 0 3.2 2.76 4.33 2.87 4.36-.06.26-.39 1.48-1.3 2.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.07 4.24-3.74 4.25z" />
                </svg>
                <span className="text-sm font-medium text-[#1F1F1F]">Apple</span>
            </button>
        </div>

        <div className="flex items-center w-full mb-6">
            <div className="flex-1 h-px bg-[#C4C7C5]"></div>
            <span className="px-3 text-xs text-[#444746] uppercase">or with email</span>
            <div className="flex-1 h-px bg-[#C4C7C5]"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="group relative">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full h-[3.5rem] px-4 rounded-[4px] border border-[#747775] text-[#1F1F1F] bg-transparent focus:border-[#0B57D0] focus:border-2 focus:outline-none placeholder-transparent pt-3"
                    id="email"
                    placeholder="Email"
                />
                <label htmlFor="email" className="absolute left-3 top-[-0.5rem] bg-[#F0F4F9] px-1 text-xs text-[#444746] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#0B57D0]">
                    Email
                </label>
            </div>

            <div className="group relative">
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full h-[3.5rem] px-4 rounded-[4px] border border-[#747775] text-[#1F1F1F] bg-transparent focus:border-[#0B57D0] focus:border-2 focus:outline-none placeholder-transparent pt-3"
                    id="password"
                    placeholder="Password"
                />
                <label htmlFor="password" className="absolute left-3 top-[-0.5rem] bg-[#F0F4F9] px-1 text-xs text-[#444746] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-[#0B57D0]">
                    Password
                </label>
            </div>

            <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-[#0B57D0] hover:bg-[#0B57D0]/10 px-3 py-1.5 rounded-full transition-colors">
                    Forgot password?
                </button>
            </div>

            <div className="flex justify-between items-center pt-4">
                <button 
                    type="button" 
                    onClick={() => setIsSignIn(!isSignIn)}
                    className="text-[#0B57D0] font-medium text-sm hover:bg-[#0B57D0]/10 px-4 py-2.5 rounded-full transition-colors"
                >
                    {isSignIn ? 'Create account' : 'Sign in'}
                </button>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#0B57D0] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-md hover:bg-[#0B57D0]/90 transition-all flex items-center"
                >
                    {isLoading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Create')}
                </button>
            </div>
        </form>

        <div className="mt-12 w-full">
            <div className="flex items-center space-x-2 text-sm text-[#444746] bg-white p-4 rounded-xl border border-[#E1E3E1]">
                <Shield className="w-5 h-5 text-[#0B57D0]" />
                <span className="flex-1">Secured by Enterprise Grade HIPAA Compliance</span>
            </div>
        </div>
      </div>
    </div>
  );
};