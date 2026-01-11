
import React, { useState } from 'react';
import { Github, Mail, Lock, User, ArrowRight, Rocket } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
  theme: 'dark' | 'light';
}

const Auth: React.FC<AuthProps> = ({ onLogin, theme }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-[#09090b]' : 'bg-zinc-50'}`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 shadow-xl shadow-indigo-500/20 text-white italic font-bold text-3xl">
            O
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            {isLogin ? 'Welcome back' : 'Join the Verse'}
          </h1>
          <p className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>
            {isLogin ? 'Continue your open source journey.' : 'The launchpad for your next big contribution.'}
          </p>
        </div>

        <div className={`p-8 rounded-3xl border shadow-xl ${
          theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="space-y-4 mb-8">
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              <Github size={20} />
              Continue with GitHub
            </button>
            <div className="relative">
              <div className={`absolute inset-0 flex items-center ${theme === 'dark' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                <span className="w-full border-t border-current"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${theme === 'dark' ? 'bg-[#121214] text-zinc-500' : 'bg-white text-zinc-400'}`}>Or continue with email</span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            {!isLogin && (
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                      theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-400'
                    }`}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-400'
                  }`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Password</label>
                {isLogin && <button type="button" className="text-xs text-indigo-500 hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-400'
                  }`}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <Rocket size={24} className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} />
           <div className={`w-px h-6 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
           <span className={`text-sm font-bold tracking-tighter ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>TRUSTED BY OPENVERSE CONTRIBUTORS</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
