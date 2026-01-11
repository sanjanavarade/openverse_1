
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Zap, 
  Rocket, 
  FileText, 
  Users, 
  BookOpen,
  Award,
  Palette,
  LogOut,
  X,
  ChevronDown
} from 'lucide-react';
import { ThemeType } from '../App';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme, onLogout, isOpen, onClose }) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'onboarding', label: 'Launchpad', icon: Rocket },
    { id: 'explorer', label: 'Explorer', icon: Compass },
    { id: 'analyzer', label: 'Repo Analyzer', icon: Zap },
    { id: 'readme', label: 'README Gen', icon: FileText },
    { id: 'practice', label: 'Practice Zone', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
  ];

  const themes: { id: ThemeType, label: string, color: string }[] = [
    { id: 'dark', label: 'Default Dark', color: 'bg-zinc-900' },
    { id: 'light', label: 'Clean Light', color: 'bg-white' },
    { id: 'nord', label: 'Nordic Frost', color: 'bg-[#2e3440]' },
    { id: 'midnight', label: 'Midnight Blue', color: 'bg-[#020617]' },
    { id: 'sunset', label: 'Vibrant Sunset', color: 'bg-[#1a0b16]' },
  ];

  const currentThemeData = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className={`fixed inset-y-0 left-0 w-64 border-r flex flex-col z-50 transition-all duration-300 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      theme === 'light' ? 'bg-white border-zinc-200 shadow-xl' : 
      theme === 'nord' ? 'bg-[#3b4252] border-[#4c566a]' :
      theme === 'midnight' ? 'bg-[#0f172a] border-[#1e293b]' :
      theme === 'sunset' ? 'bg-[#2d1624] border-[#4a203a]' :
      'bg-[#09090b] border-zinc-800'
    }`}>
      
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white italic shadow-lg shadow-indigo-600/20">O</div>
          <h1 className={`text-xl font-bold tracking-tight ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>OpenVerse</h1>
        </div>
        <button 
          onClick={onClose}
          className={`lg:hidden p-2 rounded-lg ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-6 flex-1 overflow-y-auto">
        {/* Navigation */}
        <nav className="space-y-1 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : theme === 'light'
                    ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Theme Selector */}
        <div className="mb-8">
          <label className={`text-[10px] font-bold uppercase tracking-widest block mb-3 opacity-50 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
            Appearance
          </label>
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-indigo-500" />
                {currentThemeData.label}
              </div>
              <ChevronDown size={14} className={`transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
            </button>

            {showThemeMenu && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 p-2 rounded-xl border shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-10 ${
                theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
              }`}>
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setShowThemeMenu(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      theme === t.id 
                        ? 'bg-indigo-600 text-white' 
                        : theme === 'light' ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border border-white/20 ${t.color}`} />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 mt-auto space-y-4">
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'light' 
            ? 'bg-indigo-50 border-indigo-100' 
            : theme === 'nord' ? 'bg-indigo-900/10 border-indigo-400/20' :
              theme === 'sunset' ? 'bg-rose-900/10 border-rose-400/20' :
            'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
        }`}>
          <div className={`flex items-center gap-2 mb-2 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
            <Award size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Lvl 12 Contributor</span>
          </div>
          <div className={`w-full rounded-full h-1.5 overflow-hidden mb-1 ${theme === 'light' ? 'bg-zinc-200' : 'bg-white/10'}`}>
            <div className={`h-full ${theme === 'sunset' ? 'bg-rose-500' : 'bg-indigo-600'}`} style={{ width: '65%' }}></div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            theme === 'light' ? 'text-rose-600 hover:bg-rose-50' : 'text-rose-400 hover:bg-rose-500/10'
          }`}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
