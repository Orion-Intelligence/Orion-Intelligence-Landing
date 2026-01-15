import React, { useState, useEffect } from 'react';
import { Command, Ghost, Lock, Code2, ListTree, Menu, X, Sun, Moon, Shield, Radio, Activity, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Language } from '../translations';

interface NavbarProps {
  onNavigate: (view: 'home' | 'adversaries' | 'api-docs' | 'sources') => void;
  currentView: 'home' | 'adversaries' | 'api-docs' | 'sources';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Logo = () => {
  const [error, setError] = useState(false);

  return (
    <div className="w-10 h-10 relative flex items-center justify-center rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0c]">
      {!error ? (
        <img 
          src="https://try.orionintelligence.org/api/s/static/system/logo_url_default.png" 
          alt="Orion Logo" 
          className="w-full h-full object-cover scale-105"
          onError={() => setError(true)}
        />
      ) : (
        <div className="text-blue-600 dark:text-blue-500 font-black text-xl tracking-tighter">O</div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleMenu = (open: boolean) => {
    if (open) {
      setIsAnimating(true);
      setIsMenuOpen(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsMenuOpen(false), 300);
    }
  };

  const handleNavigate = (view: 'home' | 'adversaries' | 'api-docs' | 'sources') => {
    onNavigate(view);
    toggleMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const menuItems = [
    { id: 'home', label: t('nav_intelligence_os'), icon: Activity },
    { id: 'adversaries', label: t('nav_adversaries'), icon: Ghost },
    { id: 'sources', label: t('nav_sources'), icon: ListTree },
    { id: 'api-docs', label: t('nav_api_docs'), icon: Code2 },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
    { code: 'it', label: 'Italiano' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[60] border-b border-slate-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-4 group cursor-pointer" 
              onClick={() => handleNavigate('home')}
            >
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <Logo />
              </div>
              <span className="text-xl font-black tracking-[0.4em] text-slate-900 dark:text-white uppercase leading-none">
                Orion
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavigate(item.id as any)} 
                  className={`${currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-white/40'} hover:text-blue-600 dark:hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}
                >
                  {item.icon && <item.icon className="w-3 h-3" />}
                  {item.label}
                </button>
              ))}
              
              <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>
              
              <div className="flex items-center gap-3">
                {/* Language Picker */}
                <div className="relative">
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">{language}</span>
                  </button>
                  {showLangMenu && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            language === lang.code ? 'text-blue-600 bg-blue-600/5' : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={onToggleTheme}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <a 
                  href="https://calendly.com/msmannan/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-blue-50 transition-all rounded-xl shadow-lg shadow-black/5 dark:shadow-white/5 active:scale-95"
                >
                  <Command className="w-3 h-3" />
                  {t('nav_get_access')}
                </a>
                <a 
                  href="https://try.orionintelligence.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all rounded-xl border-slate-300 dark:hover:border-white/20 active:scale-95"
                >
                  <Lock className="w-3 h-3 text-blue-600 dark:text-blue-500" />
                  {t('nav_login')}
                </a>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
               <button 
                onClick={onToggleTheme}
                className="p-2 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button 
                className="p-3 text-slate-900 dark:text-white hover:text-blue-600 transition-colors bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                onClick={() => toggleMenu(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className={`md:hidden fixed inset-0 w-full h-full z-[9999] transition-all duration-500 ease-in-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Backdrop Blur Layer */}
          <div className="absolute inset-0 bg-white dark:bg-[#0c0c0e]/95 backdrop-blur-3xl"></div>
          
          <div 
            className={`relative flex flex-col h-full w-full transition-all duration-500 ease-out ${
              isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between h-20 px-6 shrink-0 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <Logo />
                <span className="text-xl font-black tracking-[0.4em] text-slate-900 dark:text-white uppercase leading-none">
                  Orion
                </span>
              </div>
              <button 
                className="p-3 text-slate-900 dark:text-white hover:text-blue-600 transition-colors bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 active:scale-95"
                onClick={() => toggleMenu(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="flex-1 flex flex-col pt-8 px-6 space-y-1">
              <div className="text-[9px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] mb-4 opacity-70 px-4">Navigation System</div>
              {menuItems.map((item, index) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavigate(item.id as any)} 
                  style={{ transitionDelay: `${index * 40}ms` }}
                  className={`group relative w-full text-left py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
                    isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
                  } ${
                    currentView === item.id 
                      ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-500 ${
                    currentView === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/20'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-widest leading-none mb-0.5">{item.label}</span>
                    <span className="text-[8px] font-mono uppercase opacity-50 tracking-widest">Module_{item.id.toUpperCase()}</span>
                  </div>
                </button>
              ))}

              {/* Mobile Language Switcher */}
              <div className="flex flex-wrap gap-2 px-4 mt-6">
                 {languages.map(lang => (
                   <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                      language === lang.code ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10'
                    }`}
                   >
                     {lang.code}
                   </button>
                 ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-8 pt-6 border-t border-slate-200 dark:border-white/5 space-y-3">
               <div className="flex gap-3">
                  <a 
                    href="https://try.orionintelligence.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-widest rounded-xl active:scale-95 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    {t('nav_login')}
                  </a>
                  <button 
                    onClick={onToggleTheme}
                    className="w-12 flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-white/40 active:scale-95 transition-all"
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>
               </div>
               <a 
                  href="https://calendly.com/msmannan/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  {t('nav_get_access')}
                </a>
            </div>
            
            {/* Menu Footer Diagnostic */}
            <div className="pb-6 px-6 flex items-center justify-between text-slate-500 dark:text-white/20 font-mono">
               <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 animate-pulse text-blue-600 dark:text-blue-50" />
                  <span className="text-[8px] uppercase tracking-widest font-bold">GRID: NOMINAL</span>
               </div>
               <div className="text-[7px] uppercase tracking-tighter opacity-70">
                 CORE-V4.2
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;