
import React from 'react';
import { 
  ArrowLeft, FileText, History, MapPin, Terminal, 
  Info, ExternalLink, Fingerprint, Globe, X, Activity
} from 'lucide-react';
import { ActorIntelligence, ActorIcon } from './ThreatActors';

interface ActorDossierProps {
  actor: ActorIntelligence;
  onBack: () => void;
}

const ActorDossier: React.FC<ActorDossierProps> = ({ actor, onBack }) => {
  return (
    <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      
      {/* Background Style consistent with site */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
        <div className="absolute inset-0 opacity-40 dark:opacity-100 transition-all duration-1000" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 15% 25%, rgba(220,38,38,0.08), transparent 50%),
                 radial-gradient(circle at 85% 75%, rgba(217,70,239,0.06), transparent 50%),
                 radial-gradient(1.5px 1.5px at 12% 12%, #fff, transparent),
                 radial-gradient(1px 1px at 22% 82%, #fff, transparent),
                 radial-gradient(1.2px 1.2px at 72% 22%, #fff, transparent),
                 repeating-radial-gradient(circle at center, transparent 0, transparent 200px, rgba(220,38,38,0.02) 201px, transparent 203px)
               `
             }}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-8">
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-red-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Return to Inventory
            </button>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 shrink-0">
                <ActorIcon name={actor.name} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-mono truncate">
                    {actor.name}
                  </h1>
                  <div className="px-3 py-1 rounded bg-red-600/10 border border-red-600/20 text-red-600 text-[10px] font-black uppercase tracking-widest hidden sm:block">
                    Confidential
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> {actor.name.toLowerCase().replace(/\s/g, '_')}</span>
                  <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> {actor.status}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="px-6 py-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                Priority: Critical <Activity className="w-3.5 h-3.5 animate-pulse" />
             </div>
          </div>
        </div>

        {/* Dossier Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Intelligence Column */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
                <FileText className="w-5 h-5" />
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em]">Executive Intelligence Summary</h3>
              </div>
              <div className="text-base md:text-lg text-slate-600 dark:text-white/60 leading-relaxed font-medium bg-white/40 dark:bg-[#0d0d0f]/60 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                {actor.description}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-red-600/60 dark:text-red-500/60">
                  <History className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Operational Period</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-mono">{actor.period}</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600/60 dark:text-blue-400/60">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Attributed Origin</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-mono uppercase">{actor.origin || "Unknown / Proxy-Net"}</p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
                <Terminal className="w-5 h-5" />
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em]">Tactics, Techniques & Procedures</h3>
              </div>
              <div className="font-mono text-sm text-red-600 dark:text-red-400/80 bg-red-600/5 p-8 md:p-10 rounded-[2.5rem] border border-red-600/10 leading-relaxed break-words shadow-inner">
                {actor.tactics}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400 dark:text-white/20">
                <Info className="w-5 h-5" />
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em]">Activity Log</h3>
              </div>
              <p className="text-base text-slate-500 dark:text-white/40 leading-relaxed font-medium italic pl-6 border-l-4 border-slate-200 dark:border-white/5 py-2">
                {actor.activity}
              </p>
            </section>
          </div>

          {/* Sidebar Panel */}
          <div className="lg:col-span-4 space-y-8 sticky top-24">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/10 space-y-8 shadow-2xl">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-[0.3em]">High Priority Analysis</span>
                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Operational Impact</h4>
              </div>
              <p className="text-sm font-medium leading-relaxed text-white/50">
                {actor.impact}
              </p>
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Notable Events</span>
                  <p className="text-xs text-white/70 font-mono leading-relaxed">{actor.notable}</p>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Affected Sectors</span>
                  <p className="text-xs text-white/70 font-mono leading-relaxed">{actor.victims}</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Intelligence Matrix</span>
              <div className="space-y-4">
                {[
                  { label: 'Classification', val: 'ADVERSARY' },
                  { label: 'Intelligence Type', val: actor.type.split(',')[0] },
                  { label: 'Risk Factor', val: actor.impact.includes('High') ? 'CRITICAL' : 'MODERATE' },
                  { label: 'Data Verified', val: 'YES' }
                ].map((meta, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase">{meta.label}</span>
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase font-mono">{meta.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-red-600/10 active:scale-95 flex items-center justify-center gap-3 border-t border-white/20">
              Export STIX 2.1 <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDossier;
