
import React, { useState, useEffect, useCallback } from 'react';
import { Command, Ghost, Lock, Code2, ListTree, Menu, X, Sun, Moon, ChevronRight, Terminal, Shield } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'adversaries' | 'api-docs' | 'sources') => void;
  currentView: 'home' | 'adversaries' | 'api-docs' | 'sources';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Logo = () => {
  const [error, setError] = useState(false);

  return (
    <div className="w-8 h-8 relative flex items-center justify-center rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm">
      {!error ? (
        <img 
          src="https://try.orionintelligence.org/api/s/static/system/logo_url_default.png" 
          alt="Orion Logo" 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="text-blue-600 dark:text-blue-500 font-black text-sm tracking-tighter">O</div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMenu = useCallback((open: boolean) => {
    if (open) {
      setIsMenuOpen(true);
      requestAnimationFrame(() => setIsAnimating(true));
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }, 200);
    }
  }, []);

  const handleNavigate = (view: 'home' | 'adversaries' | 'api-docs' | 'sources') => {
    onNavigate(view);
    toggleMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Intelligence OS', icon: Terminal },
    { id: 'adversaries', label: 'Adversaries', icon: Ghost },
    { id: 'sources', label: 'Sources', icon: ListTree },
    { id: 'api-docs', label: 'API Docs', icon: Code2 },
  ] as const;

  return (
    <>
      <nav className="fixed top-0 w-full z-[60] border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/70 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-screen-2xl mx-auto px-5 lg:px-12">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div 
              className="flex items-center gap-2.5 group cursor-pointer" 
              onClick={() => handleNavigate('home')}
            >
              <Logo />
              <span className="text-base font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase leading-none">
                Orion
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavigate(item.id)} 
                  className={`${currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-white/40'} hover:text-blue-600 dark:hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5`}
                >
                  {item.id !== 'home' && <item.icon className="w-3 h-3" />}
                  {item.label}
                </button>
              ))}
              
              <div className="h-3 w-px bg-slate-200 dark:bg-white/10"></div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={onToggleTheme}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 transition-all"
                >
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </button>
                <a 
                  href="https://calendly.com/msmannan/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all"
                >
                  Demo
                </a>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-1">
               <button 
                onClick={onToggleTheme}
                className="p-2 text-slate-500 dark:text-white/60"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button 
                className="p-2 text-slate-500 dark:text-white/60"
                onClick={() => toggleMenu(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Optimized Mobile HUD Menu */}
      {isMenuOpen && (
        <div 
          className={`md:hidden fixed inset-0 w-full h-full bg-white dark:bg-[#080808] z-[9999] transition-opacity duration-200 ease-in-out flex flex-col ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ position: 'fixed', touchAction: 'none' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between h-14 px-5 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-black/20">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-base font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase">
                Orion
              </span>
            </div>
            <button 
              className="p-2 text-slate-500 dark:text-white/60 active:scale-90 transition-transform"
              onClick={() => toggleMenu(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Optimized Scrollable Links */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 no-scrollbar">
            {/* Nav Group */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] px-3 mb-2 block">Intelligence Layers</span>
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavigate(item.id)} 
                  className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all duration-200 border ${
                    currentView === item.id 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' 
                      : 'bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-white/40 border-slate-100 dark:border-white/5 active:bg-slate-100 dark:active:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${currentView === item.id ? 'opacity-100' : 'opacity-40'}`} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${currentView === item.id ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
                </button>
              ))}
            </div>

            {/* Action Group */}
            <div className="space-y-3 pt-4">
              <div className="h-px bg-slate-100 dark:bg-white/5 mb-4"></div>
              <a 
                href="https://calendly.com/msmannan/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
              >
                <Command className="w-4 h-4" />
                Schedule Demo
              </a>
              
              <a 
                href="https://try.orionintelligence.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-[11px] font-black uppercase tracking-widest active:scale-[0.98] transition-all"
              >
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                Secure Login
              </a>
            </div>
          </div>
          
          {/* Footer HUD info */}
          <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] space-y-3">
            <div className="flex items-center justify-between opacity-40">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest dark:text-white">Enc: AES-256</span>
              </div>
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest dark:text-white">Node: AMS-04</span>
            </div>
            <p className="text-[8px] text-center text-slate-400 dark:text-white/20 uppercase tracking-[0.4em] font-bold">
              Secure Intelligence Environment v4.2
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
