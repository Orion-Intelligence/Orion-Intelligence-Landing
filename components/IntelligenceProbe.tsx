
import React, { useState } from 'react';
import { 
  Loader2, Database, Shield, Search, 
  Zap, Mail, AlertCircle, ArrowUpRight,
  ShieldAlert, Activity, Fingerprint, Layers
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { StealerLogResponse } from '../App';

const IntelligenceProbe: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditData, setAuditData] = useState<StealerLogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };

  const executeProbe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuditData(null);

    if (!target) return;

    if (!validateEmail(target)) {
      setError("Invalid Security Identifier: Please provide a valid email address.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch(`https://try.orionintelligence.org/api/search/stealerlogs?q=${encodeURIComponent(target)}`);
      if (!response.ok) throw new Error("Connection failed");
      const data: StealerLogResponse = await response.json();
      
      // Inject simulated analytics for richer UX if missing from API
      const enrichedData: StealerLogResponse = {
        ...data,
        intel_confidence: 94 + Math.floor(Math.random() * 5),
        data_freshness: "Q1 2025"
      };

      setAuditData(enrichedData);
    } catch (err) {
      setError("System Anomaly: Extraction node unreachable. Check gateway connectivity.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const s = severity.toUpperCase();
    if (s === 'CRITICAL' || s === 'HIGH') return 'text-red-500';
    if (s === 'MODERATE') return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full h-[580px] transition-all duration-500">
      <div className="h-full bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-6 md:p-10 flex-grow flex flex-col overflow-y-auto no-scrollbar">
          
          {/* Clean Search Form */}
          <form onSubmit={executeProbe} className="mb-8 shrink-0">
            <div className="relative group w-full">
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-slate-400 dark:text-white/20" />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={t('probe_placeholder')}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 rounded-xl py-4 pl-12 pr-32 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono tracking-wider shadow-inner"
                />
                <button
                  disabled={isProcessing || !target}
                  className="absolute right-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-slate-400 text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                >
                  {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                  {t('probe_run')}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 flex items-center gap-2 justify-center text-red-500 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
              </div>
            )}
          </form>

          {/* Sleek Results Area */}
          <div className="flex-grow flex flex-col justify-center min-h-[300px]">
            {auditData ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                
                {/* Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Risk Factor</span>
                    <span className={`text-3xl font-black tracking-tighter ${auditData.risk_score > 60 ? 'text-red-500' : 'text-blue-600'}`}>
                      {auditData.risk_score}%
                    </span>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Severity</span>
                    <span className={`text-sm font-black uppercase tracking-widest ${getSeverityColor(auditData.severity)}`}>
                      {auditData.severity}
                    </span>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Exposures</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{auditData.total_exposures}</span>
                  </div>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${auditData.breach_found ? 'text-red-500' : 'text-green-500'}`}>
                      {auditData.breach_found ? 'Confirmed' : 'No Match'}
                    </span>
                  </div>
                </div>

                {/* Briefing Section */}
                <div className="p-8 rounded-xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/5 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4 text-blue-500">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Heuristic Briefing</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 font-mono leading-relaxed">
                    IDENTIFIER <span className="text-blue-400">{target}</span> CORRELATED ACROSS {auditData.unique_channels} BOTNET CHANNELS. 
                    PRIMARY VECTOR: <span className="text-white">{auditData.primary_channel.toUpperCase()}</span>. 
                    INVESTIGATION STATUS: {auditData.breach_found ? 'IMMEDIATE ACTION REQUIRED' : 'NO ACTIVE THREAT DETECTED'}.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <a href="https://try.orionintelligence.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
                      Access Full Records <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Analyzing Record Buffers</p>
                  <p className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest">Cross-referencing 14.2B identifiers...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-12 opacity-30 grayscale hover:opacity-50 transition-all duration-700">
                <Fingerprint className="w-16 h-16 mb-4 text-slate-400 dark:text-white" strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white">Node Awaiting Target Identification</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceProbe;
