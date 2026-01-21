
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Crosshair, Terminal, Lock, Zap, 
  Bug, Cpu, Activity, HelpCircle, Target, AlertOctagon, 
  Ghost, Bot, Skull, Flame, Sword, Radiation, Network, 
  ShieldCheck, Dna, Tornado, ArrowLeft, Calendar, 
  MapPin, Fingerprint, ShieldAlert, History, Globe,
  FileText, Info, X, ChevronRight, Hash, Loader2,
  Biohazard, Component, Eye, Layers, ShieldX,
  Scan, ShieldAlert as Alert, Binary
} from 'lucide-react';

export interface ActorIntelligence {
  name: string;
  description: string;
  type: string;
  status: string;
  activity: string;
  tactics: string;
  period: string;
  notable: string;
  victims: string;
  impact: string;
  origin?: string;
}

const iconList = [
  Skull, Bug, Zap, Radiation, Activity, Target, Ghost, Bot, 
  Tornado, Sword, Flame, Dna, Biohazard, Component, Eye, 
  ShieldX, Fingerprint, Crosshair, ShieldAlert, Cpu,
  Scan, Alert, Binary, Network
];

const colorSchemes = [
  { bg: 'from-slate-900 via-red-950/60 to-black', text: 'text-red-500', glow: 'shadow-red-500/20', stroke: 'from-red-500/50 via-red-500/10 to-transparent' },
  { bg: 'from-slate-900 via-purple-950/60 to-black', text: 'text-purple-500', glow: 'shadow-purple-500/20', stroke: 'from-purple-500/50 via-purple-500/10 to-transparent' },
  { bg: 'from-slate-900 via-blue-950/60 to-black', text: 'text-blue-500', glow: 'shadow-blue-500/20', stroke: 'from-blue-500/50 via-blue-500/10 to-transparent' },
  { bg: 'from-slate-900 via-emerald-950/60 to-black', text: 'text-emerald-500', glow: 'shadow-emerald-500/20', stroke: 'from-emerald-500/50 via-emerald-500/10 to-transparent' },
  { bg: 'from-slate-900 via-orange-950/60 to-black', text: 'text-orange-500', glow: 'shadow-orange-500/20', stroke: 'from-orange-500/50 via-orange-500/10 to-transparent' },
  { bg: 'from-slate-900 via-rose-950/60 to-black', text: 'text-rose-500', glow: 'shadow-rose-500/20', stroke: 'from-rose-500/50 via-rose-500/10 to-transparent' },
  { bg: 'from-slate-900 via-cyan-950/60 to-black', text: 'text-cyan-500', glow: 'shadow-cyan-500/20', stroke: 'from-cyan-500/50 via-cyan-500/10 to-transparent' },
];

export const ActorIcon = ({ name }: { name: string }) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const Icon = iconList[hash % iconList.length];
  const scheme = colorSchemes[hash % colorSchemes.length];
  
  const shorthand = name.split('').filter(c => /[a-zA-Z0-9]/.test(c)).slice(0, 2).join('').toUpperCase();
  
  return (
    <div className={`relative w-full h-full p-[1px] rounded-2xl bg-gradient-to-br ${scheme.stroke} shadow-2xl group overflow-hidden`}>
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br ${scheme.bg} rounded-[calc(1rem-1px)] overflow-hidden border border-white/5`}>
        {/* Static HUD Scanlines */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        
        {/* HUD Brackets */}
        <div className={`absolute top-2 left-2 w-1.5 h-1.5 border-t border-l ${scheme.text} opacity-30`}></div>
        <div className={`absolute top-2 right-2 w-1.5 h-1.5 border-t border-r ${scheme.text} opacity-30`}></div>

        {/* Themed Glow behind icon (Static) */}
        <div className={`absolute w-12 h-12 rounded-full bg-current opacity-[0.1] blur-xl ${scheme.text} ${scheme.glow}`}></div>
        
        {/* Transparent Icon */}
        <Icon className={`w-3/5 h-3/5 ${scheme.text} relative z-10 transition-transform duration-300 group-hover:scale-110`} strokeWidth={1.2} />
        
        {/* Shorthand Tag */}
        <div className="absolute top-0 right-0 px-1.5 py-0.5 rounded-bl bg-black/60 backdrop-blur-md border-l border-b border-white/10 z-20">
          <span className="text-[6px] font-black text-white/50 tracking-tighter uppercase font-mono leading-none">{shorthand}</span>
        </div>
      </div>
    </div>
  );
};

interface ThreatActorsProps {
  onSelectActor: (actor: ActorIntelligence) => void;
  onBack: () => void;
}

const ThreatActors: React.FC<ThreatActorsProps> = ({ onSelectActor, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actors, setActors] = useState<ActorIntelligence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setError(null);
        const response = await fetch('/ransomware_groups_info.json');
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Intelligence node returned invalid format (Expected JSON)');
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Intelligence node returned unexpected data structure');
        }

        const normalizedData = data.map((item: any) => ({
          name: item.name || "Unknown Entity",
          description: item.description || "No analysis available.",
          type: item.type || "Unclassified",
          status: item.status || "Unknown",
          activity: item.activity || "N/A",
          tactics: item.tactics || item['tactics & techniques'] || "N/A",
          period: item.period || item['activity period'] || "N/A",
          notable: item.notable || "N/A",
          victims: item.victims || item['victims & reach'] || "N/A",
          impact: item.impact || "N/A",
          origin: item.origin
        }));
        
        setActors(normalizedData);
      } catch (err: any) {
        console.error("Critical Grid Failure:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActors();
  }, []);

  const cardStyle = "bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm backdrop-blur-md transition-all duration-300";

  const filteredActors = useMemo(() => {
    return actors.filter(actor => 
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      actor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, actors]);

  return (
    <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 overflow-visible animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
      
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

      <div className="relative z-10 space-y-8 px-2 md:px-3 lg:px-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-red-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Return to Core Node
            </button>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none uppercase">Threat Inventory</h2>
                <div className="px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-red-500/10 border-red-500/20 text-red-600">
                  <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                  Intelligence Grid v4.2
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="px-6 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
              Node Count: {isLoading ? '...' : actors.length} <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className={`${cardStyle} p-4 md:p-5 lg:p-8 space-y-8 bg-slate-50/50 dark:bg-white/[0.01]`}>
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH ACTORS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/10 focus:border-red-600/40 focus:ring-0 w-full"
            />
          </div>

          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-6">
               <Loader2 className="w-12 h-12 text-red-600 animate-spin" strokeWidth={1.5} />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Synchronizing Intelligence Stream...</p>
            </div>
          ) : error ? (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
               <ShieldAlert className="w-16 h-16 text-red-600/40" strokeWidth={1} />
               <div className="space-y-2">
                 <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Grid Link Failure</h3>
                 <p className="text-sm text-slate-500 dark:text-white/40 max-w-sm font-mono">{error}</p>
               </div>
               <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Retry Sync</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {filteredActors.map((actor, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelectActor(actor)}
                  className="group relative flex flex-col gap-6 p-6 bg-white/60 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl transition-all duration-300 hover:bg-red-50/30 dark:hover:bg-red-900/10 hover:border-red-500/30 cursor-pointer shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 shrink-0 group-hover:scale-105 transition-transform relative">
                      <ActorIcon name={actor.name} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 space-y-1">
                      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white tracking-widest group-hover:text-red-600 transition-colors truncate font-mono uppercase">
                        {actor.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">{actor.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-500 dark:text-white/40 leading-relaxed font-medium line-clamp-2">
                      {actor.description}
                    </p>
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{actor.type.split(',')[0]}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatActors;
