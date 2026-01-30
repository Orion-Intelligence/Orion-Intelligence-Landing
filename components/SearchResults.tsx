
import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Database, ShieldCheck,
  CheckCircle2, History, TrendingUp, BarChart3,
  Binary, Target, Network,
  AlertOctagon, Fingerprint, Key,
  Radar, Activity, Lock, ExternalLink, X, AlertTriangle
} from 'lucide-react';
import { StealerLogResponse } from '../App';

interface SearchResultsProps {
  query: string;
  data: StealerLogResponse;
  onBack: () => void;
  onNavigateToRemediation: () => void;
  onNavigateToPricing: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, data, onBack, onNavigateToRemediation, onNavigateToPricing }) => {
  const [showApiPopup, setShowApiPopup] = useState(false);

  const getRiskBg = (score: number) => {
    if (score > 80) return 'bg-red-500';
    if (score > 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const cardStyle = "bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm backdrop-blur-md transition-all duration-300";

  // Unified High-Fidelity Galaxy Background
  const Background = ({ type }: { type: 'breach' | 'clearance' }) => (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
      <div className="absolute inset-0 opacity-40 dark:opacity-100 transition-all duration-1000" 
           style={{ 
             backgroundImage: `
               radial-gradient(circle at 15% 25%, ${type === 'breach' ? 'rgba(220,38,38,0.12)' : 'rgba(59,130,246,0.12)'}, transparent 50%),
               radial-gradient(circle at 85% 75%, rgba(217,70,239,0.1), transparent 50%),
               radial-gradient(1.5px 1.5px at 12% 12%, #fff, transparent),
               radial-gradient(1px 1px at 22% 82%, #fff, transparent),
               radial-gradient(1.2px 1.2px at 72% 22%, #fff, transparent),
               radial-gradient(2px 2px at 92% 42%, #fff, transparent),
               radial-gradient(1.1px 1.1px at 37% 47%, #fff, transparent),
               radial-gradient(1.3px 1.3px at 67% 17%, #fff, transparent),
               radial-gradient(1px 1px at 47% 87%, #fff, transparent),
               radial-gradient(1.5px 1.5px at 17% 67%, #fff, transparent),
               radial-gradient(1.1px 1.1px at 85% 15%, #fff, transparent),
               radial-gradient(1.2px 1.2px at 5% 95%, #fff, transparent),
               repeating-radial-gradient(circle at center, transparent 0, transparent 200px, ${type === 'breach' ? 'rgba(220,38,38,0.03)' : 'rgba(59,130,246,0.03)'} 201px, transparent 203px)
             `
           }}>
      </div>
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] ${type === 'breach' ? 'bg-red-500/10' : 'bg-blue-500/10'} blur-[150px] rounded-full`}></div>
      <div className={`absolute bottom-0 left-0 w-[1000px] h-[1000px] ${type === 'breach' ? 'bg-red-900/5' : 'bg-blue-900/5'} blur-[180px] rounded-full`}></div>
    </div>
  );

  if (!data.breach_found) {
    return (
      <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 overflow-visible animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
        <Background type="clearance" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <button 
            onClick={onBack}
            className="mb-12 inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-blue-600 dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Return to Core Node
          </button>

          <div className={`${cardStyle} p-10 md:p-16 text-center space-y-10`}>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl">
                <Radar className="w-8 h-8 animate-spin-slow" strokeWidth={1.5} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-500/60 uppercase tracking-[0.3em]">Investigative Status</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">Security Clearance</h2>
                </div>
                
                <p className="text-sm md:text-base text-slate-600 dark:text-white/60 max-w-lg mx-auto leading-relaxed font-medium">
                  Identifier <code className="text-blue-600 dark:text-blue-400 font-bold">{query}</code> has been verified.
                  No exposures detected in monitored stealer log clusters.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-sm border-t border-slate-200 dark:border-white/5 pt-8">
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Integrity</span>
                   <div className="text-[11px] font-black text-blue-600">100%</div>
                </div>
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Freshness</span>
                   <div className="text-[11px] font-black text-blue-600">LIVE</div>
                </div>
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                   <div className="text-[11px] font-black text-blue-600">HIGH</div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setShowApiPopup(true)}
                  className="px-7 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg flex items-center gap-3 active:scale-95"
                >
                  Raw Audit Log <Activity className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {showApiPopup && <ApiAccessPopup onClose={() => setShowApiPopup(false)} onContact={onNavigateToPricing} />}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 overflow-visible animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
      <Background type="breach" />
      <div className="relative z-10 space-y-8 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Return to Core Node
            </button>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none uppercase">Security Audit Report</h2>
                <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${data.breach_found ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-green-500/10 border-green-600/20 text-green-600'}`}>
                  <div className={`w-1 h-1 rounded-full ${data.breach_found ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  {data.breach_found ? 'Exposure' : 'Clearance'}
                </div>
              </div>
              <div className="flex items-center gap-3 py-4 bg-transparent max-w-xl">
                <div className="p-2.5 rounded-lg bg-blue-600/5 text-blue-600">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <code className="text-lg md:text-xl font-mono text-slate-900 dark:text-white font-bold tracking-tight">{query}</code>
                  <span className="text-[9px] text-slate-400 dark:text-white/30 uppercase font-black tracking-widest">Investigative Identifier</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setShowApiPopup(true)}
              className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-xl active:scale-95"
            >
              Raw Log <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Risk Index', val: `${data.risk_score}%`, color: data.risk_score > 60 ? 'text-red-500' : 'text-blue-500', icon: TrendingUp, meta: data.severity },
            { label: 'Intel Confidence', val: `${data.intel_confidence || 98}%`, color: 'text-slate-900 dark:text-white', icon: CheckCircle2, meta: 'Verified' },
            { label: 'Global Rank', val: data.global_percentile || 91, color: 'text-slate-900 dark:text-white', icon: BarChart3, meta: 'Percentile' },
            { label: 'Exposures', val: data.total_exposures, color: 'text-slate-900 dark:text-white', icon: Database, meta: 'Records' }
          ].map((stat, i) => (
            <div key={i} className={`${cardStyle} p-6 space-y-3`}>
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <stat.icon className="w-3.5 h-3.5 text-blue-500/50" />
                {stat.label}
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{stat.meta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className={`${cardStyle} p-10 space-y-8 bg-slate-50/50 dark:bg-black/40`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-600/5 text-blue-600">
                    <Binary className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest">Heuristic Briefing</h3>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Main Vector</span>
                   <span className="text-[10px] font-black text-blue-600 uppercase">{data.primary_type || 'Botnet_Exfil'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3 text-red-500">
                     <Target className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">High Impact Source</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{data.primary_channel}</span>
                    <span className="text-[10px] font-mono text-red-600">{data.primary_channel_hits} HITS</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3 text-blue-600">
                     <Network className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Network Consistency</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">Verified_Hash</span>
                    <span className="text-[10px] font-mono text-blue-600 uppercase">Consistent</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono text-[10px] text-white/40 leading-relaxed shadow-2xl">
                <div className="flex gap-4 border-b border-white/5 pb-3 mb-4 text-[8px] font-black uppercase text-white/20">
                   <span>Node_v4.2.0</span>
                   <span className="text-blue-500">Analysis_Nominal</span>
                </div>
                <div className="space-y-1.5">
                  <p><span className="text-white/10">{'>>'}</span> TARGET_NODE: <span className="text-white/70">{query}</span></p>
                  <p><span className="text-white/10">{'>>'}</span> SOURCE: <span className="text-white/70">{data.primary_channel}</span> <span className="text-blue-500">[{data.primary_channel_hits} HITS]</span></p>
                  <p><span className="text-white/10">{'>>'}</span> RESULT: <span className="text-red-500">POSITIVE</span> IN <span className="text-white/70">{data.unique_channels}</span> CLUSTERS.</p>
                  <p><span className="text-white/10">{'>>'}</span> PATTERN: <span className="text-white/70">{data.primary_type.toUpperCase()}</span>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-3xl bg-blue-600 space-y-6 text-white relative overflow-hidden shadow-2xl">
              <div className="space-y-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md">
                   <AlertOctagon className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-widest">Mitigation</h4>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-80 relative z-10">
                Exposure confirmed. Neutralize associated session tokens and rotate all compromised credentials immediately.
              </p>
              <div className="pt-2 relative z-10">
                 <button 
                  onClick={onNavigateToRemediation}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
                >
                  Remediation Guide <ShieldCheck className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className={`${cardStyle} p-8 space-y-8`}>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">Operational Protocol</span>
                <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Mandatory steps</p>
              </div>
              <div className="space-y-6">
                {[
                  { icon: Key, label: 'Password Cycle', desc: 'Force update of all credentials.' },
                  { icon: Lock, label: 'Session Purge', desc: 'Terminate all active SSO tokens.' },
                  { icon: Fingerprint, label: 'MFA Hardware', desc: 'Mandate FIDO2 hardware keys.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <step.icon className="w-4.5 h-4.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{step.label}</h5>
                      <p className="text-[9px] text-slate-500 dark:text-white/40 font-medium leading-tight">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showApiPopup && <ApiAccessPopup onClose={() => setShowApiPopup(false)} onContact={onNavigateToPricing} />}
    </div>
  );
};

const ApiAccessPopup: React.FC<{ onClose: () => void, onContact: () => void }> = ({ onClose, onContact }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="w-full max-w-md bg-white dark:bg-[#131315] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-8">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Paid API Access Required</h3>
          <p className="text-sm text-slate-600 dark:text-white/40 leading-relaxed font-medium">
            Full raw log access is restricted to Professional and Business tiers. Please contact support to provision your dedicated intelligence node.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 py-3 px-6 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={() => { onClose(); onContact(); }}
          className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg"
        >
          Contact Support
        </button>
      </div>
    </div>
  </div>
);

export default SearchResults;
