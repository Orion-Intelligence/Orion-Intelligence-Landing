
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
    <div className="w-10 h-10 relative flex items-center justify-center rounded-xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-white/10 bg-white dark:bg-[#0a0a0c]">
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
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
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
      <nav className="fixed top-0 w-full z-[60] border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-4 group cursor-pointer" 
              onClick={() => handleNavigate('home')}
            >
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                 <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <Logo />
              </div>
              <span className="text-xl font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase leading-none">
                Orion
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 lg:space-x-10">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavigate(item.id as any)} 
                  className={`${currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-white/40'} hover:text-blue-600 dark:hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2`}
                >
                  {item.icon && <item.icon className={`w-3 h-3 ${currentView === item.id ? 'opacity-100' : 'opacity-40'}`} />}
                  {item.label}
                </button>
              ))}
              
              <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{language}</span>
                  </button>
                  {showLangMenu && (
                    <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-20">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                            language === lang.code ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/5' : 'text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5'
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
                  className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <a 
                  href="https://calendly.com/msmannan/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-blue-50 transition-all rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-95"
                >
                  <Command className="w-3 h-3" />
                  {t('nav_get_access')}
                </a>
                <a 
                  href="https://try.orionintelligence.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all rounded-xl active:scale-95 shadow-sm"
                >
                  <Lock className="w-3 h-3 text-blue-600 dark:text-blue-500" />
                  {t('nav_login')}
                </a>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-3">
               <button 
                onClick={onToggleTheme}
                className="p-2.5 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white transition-colors bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button 
                className="p-2.5 text-slate-900 dark:text-white hover:text-blue-600 transition-colors bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                onClick={() => toggleMenu(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className={`lg:hidden fixed inset-0 z-[9999] h-[100dvh] w-screen flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-3xl -z-10"></div>
          
          <div className={`flex flex-col h-full w-full transition-all duration-500 ease-out ${
            isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
          }`}>
            {/* Header - Scaled for Tablet */}
            <header className="flex items-center justify-between h-16 md:h-20 px-6 md:px-10 shrink-0 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-3 md:gap-5">
                <Logo />
                <span className="text-lg md:text-2xl font-black tracking-[0.3em] md:tracking-[0.4em] text-slate-900 dark:text-white uppercase leading-none">
                  Orion
                </span>
              </div>
              <button 
                className="p-2 md:p-3 text-slate-900 dark:text-white hover:text-blue-600 transition-colors bg-slate-100/50 dark:bg-white/5 rounded-lg md:rounded-xl border border-slate-200 dark:border-white/10 active:scale-95 shadow-sm"
                onClick={() => toggleMenu(false)}
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </header>

            {/* Improved Action Bar - Responsive Sizing */}
            <div className={`px-6 md:px-10 py-4 md:py-6 flex gap-2 md:gap-4 shrink-0 border-b border-slate-100 dark:border-white/5 transition-all duration-500 delay-100 ${
              isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}>
              <a 
                href="https://try.orionintelligence.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 md:py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[8px] md:text-[11px] font-black uppercase tracking-wider rounded-lg md:rounded-xl active:scale-95 transition-all shadow-sm"
              >
                <Lock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                {t('nav_login')}
              </a>
              <a 
                href="https://calendly.com/msmannan/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-[3] flex items-center justify-center gap-2 py-2.5 md:py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[8px] md:text-[11px] font-black uppercase tracking-wider rounded-lg md:rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
              >
                <Shield className="w-3 h-3 md:w-4 md:h-4" />
                {t('nav_get_access')}
              </a>
              <button 
                onClick={onToggleTheme}
                className="w-10 md:w-14 flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg md:rounded-xl text-slate-600 dark:text-white/40 active:scale-95 transition-all shadow-sm"
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Sun className="w-3.5 h-3.5 md:w-5 md:h-5" />}
              </button>
            </div>

            {/* Navigation List - Responsive Scaling */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <div className="py-2 md:py-6 px-5 md:px-10 space-y-0.5 md:space-y-2">
                <div className="text-[7px] md:text-[10px] font-black text-blue-600/50 dark:text-blue-500/40 uppercase tracking-[0.3em] py-4 md:py-6 px-3 md:px-5">System Matrix</div>
                
                {menuItems.map((item, index) => (
                  <button 
                    key={item.id}
                    onClick={() => handleNavigate(item.id as any)} 
                    style={{ transitionDelay: `${index * 25}ms` }}
                    className={`group relative w-full text-left py-2 md:py-3.5 px-3 md:px-5 rounded-lg md:rounded-2xl transition-all duration-200 flex items-center gap-3 md:gap-5 ${
                      isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    } ${
                      currentView === item.id 
                        ? 'bg-blue-600/5 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-white/30 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 ${
                      currentView === item.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-white/10'
                    }`}>
                      <item.icon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] md:text-base font-black uppercase tracking-widest leading-none mb-1">{item.label}</span>
                      <span className="text-[6px] md:text-[8px] font-mono uppercase opacity-30 tracking-[0.2em]">module_{item.id}</span>
                    </div>
                  </button>
                ))}

                <div className="pt-6 md:pt-10 px-3 md:px-5 space-y-3 md:space-y-5">
                  <div className="text-[7px] md:text-[10px] font-black text-slate-400 dark:text-white/10 uppercase tracking-[0.3em]">Language Hub</div>
                  <div className="flex flex-wrap gap-2 md:gap-3 pb-8">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                          language === lang.code ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 shadow-sm'
                        }`}
                      >
                        {lang.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Responsive Footer */}
            <footer className="px-6 md:px-10 pb-6 md:pb-8 pt-4 md:pt-6 border-t border-slate-200 dark:border-white/5 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl shrink-0 flex justify-center">
               <div className="text-[7px] md:text-[10px] font-black text-slate-300 dark:text-white/5 uppercase tracking-[0.4em]">
                 ORION_PRIME_V4.2_NODE
               </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
