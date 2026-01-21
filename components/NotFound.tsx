
import React from 'react';
import { ArrowLeft, ShieldAlert, Terminal, Globe, Activity } from 'lucide-react';

interface NotFoundProps {
  onBack: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onBack }) => {
  return (
    <div className="relative min-h-screen flex flex-col p-8 md:p-16 lg:p-24 bg-[#050507] text-slate-300 font-sans selection:bg-red-500/30">
      {/* Subtle Technical Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-red-600/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Status_Code: 404</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Resource_Unavailable</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 opacity-20">
          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
            <Globe className="w-3 h-3" /> External_Node
          </div>
          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
            <Activity className="w-3 h-3" /> No_Pulse
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-2 gap-20 items-start max-w-6xl">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-1000">
          <div className="space-y-6">
            <h1 className="text-[10rem] md:text-[12rem] font-black text-white leading-none tracking-tighter italic opacity-90 select-none">
              404
            </h1>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">Endpoint Not Found</h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md">
                The requested path is not recognized within the active Orion extraction grid. 
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onBack}
              className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-100 transition-all active:scale-95 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-600/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-x-1" />
              <span className="relative z-10">Return to Homepage</span>
            </button>
          </div>
        </div>

        {/* Minimal Diagnostics Sidebar */}
        <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
          <div className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500/50 transition-colors"></div>
            
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Terminal className="w-4 h-4 text-white/20" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Trace_Dump</span>
            </div>
            
            <div className="space-y-4 font-mono text-[11px] text-slate-400 opacity-60">
              <p>{'>>'} ERR_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p>{'>>'} STATE: UNRESOLVED_IDENTIFIER</p>
              <p>{'>>'} ACTION: REDIRECT_HOME</p>
              <p className="truncate">{'>>'} RAW_PATH: {window.location.pathname}</p>
              <p className="truncate text-[9px] text-blue-500/60">{'>>'} SYS_RESOLVE: {window.location.href}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="mt-auto pt-24 border-t border-white/5 flex items-center justify-between opacity-20">
        <span className="text-[10px] font-black uppercase tracking-widest">Orion_Protocol_V4.2</span>
        <span className="text-[10px] font-black uppercase tracking-widest font-mono">2025_REF_SIG_LOST</span>
      </div>
    </div>
  );
};

export default NotFound;
