import React, { useState } from 'react';
import { Command, Ghost, Lock, Code2, ListTree } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'adversaries' | 'api-docs' | 'sources') => void;
  currentView: 'home' | 'adversaries' | 'api-docs' | 'sources';
}

const Logo = () => {
  const [error, setError] = useState(false);

  return (
    <div className="w-10 h-10 relative flex items-center justify-center rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/10 bg-[#0a0a0a]">
      {!error ? (
        <img 
          src="public_html/logo.png" 
          alt="Orion Logo" 
          className="w-full h-full object-cover scale-105"
          onError={() => setError(true)}
        />
      ) : (
        <div className="text-blue-500 font-black text-xl tracking-tighter">O</div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="fixed top-0 w-full z-[60] border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center gap-4 group cursor-pointer" 
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative group-hover:scale-110 transition-transform duration-500">
               <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Logo />
            </div>
            <span className="text-xl font-black tracking-[0.4em] text-white uppercase leading-none">
              Orion
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <button 
              onClick={() => onNavigate('home')} 
              className={`${currentView === 'home' ? 'text-white' : 'text-white/40'} hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest`}
            >
              Intelligence OS
            </button>
            <button 
              onClick={() => onNavigate('adversaries')} 
              className={`${currentView === 'adversaries' ? 'text-blue-400' : 'text-white/40'} hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}
            >
              <Ghost className="w-3 h-3" />
              Adversaries
            </button>
            <button 
              onClick={() => onNavigate('sources')} 
              className={`${currentView === 'sources' ? 'text-blue-400' : 'text-white/40'} hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}
            >
              <ListTree className="w-3 h-3" />
              Sources
            </button>
            <button 
              onClick={() => onNavigate('api-docs')} 
              className={`${currentView === 'api-docs' ? 'text-white' : 'text-white/40'} hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}
            >
              <Code2 className="w-3 h-3" />
              API Docs
            </button>
            
            <div className="h-4 w-px bg-white/10"></div>
            
            <div className="flex items-center gap-3">
              <a 
                href="https://calendly.com/msmannan/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 transition-all rounded-xl shadow-lg shadow-white/5 active:scale-95"
              >
                <Command className="w-3 h-3" />
                Get Access
              </a>
              <a 
                href="https://try.orionintelligence.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all rounded-xl hover:border-white/20 active:scale-95"
              >
                <Lock className="w-3 h-3 text-blue-500" />
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;