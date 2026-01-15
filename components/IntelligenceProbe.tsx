
import React, { useState } from 'react';
import { Loader2, Database, Shield, Crosshair, Search, Terminal, Zap, Download, Share2, Maximize2 } from 'lucide-react';
import { generateThreatReport } from '../services/geminiService';

const IntelligenceProbe: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dossier, setDossier] = useState<string | null>(null);

  const executeProbe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    
    setIsProcessing(true);
    setDossier(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const type = target.includes('.') || target.includes('@') ? 'website' : 'ioc';
    const result = await generateThreatReport(target, type);
    
    setDossier(result);
    setIsProcessing(false);
  };

  return (
    <div id="terminal" className="w-full max-w-full lg:max-w-7xl mx-auto transition-colors duration-300 overflow-hidden px-0">
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_20px_100px_rgba(0,0,0,0.8)] w-full">
        {/* Dashboard Header */}
        <div className="px-3 md:px-8 py-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 dark:bg-white/[0.02] gap-4 w-full">
          <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/10"></div>
              </div>
              <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-white/5"></div>
              <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                <Terminal className="w-3.5 h-3.5 text-slate-400 dark:text-white/40 shrink-0" />
                <span className="text-[9px] md:text-[11px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider md:tracking-[0.2em] truncate">
                  OSINT_CORE <span className="hidden sm:inline">:: ORION-V4</span>
                </span>
              </div>
            </div>
            
            <div className="md:hidden flex items-center gap-1.5 shrink-0">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-[8px] text-blue-600 dark:text-blue-500 font-bold uppercase tracking-widest whitespace-nowrap">GRID LINKED</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 md:gap-8 font-mono text-[9px] md:text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-blue-600 dark:text-blue-500 font-bold uppercase tracking-widest">GRID_LINK: ESTABLISHED</span>
            </div>
            <span className="text-slate-400 dark:text-white/20 uppercase tracking-widest">DB: 14.2B</span>
          </div>
        </div>

        <div className="p-3.5 md:p-8 lg:p-16 w-full overflow-hidden">
          <form onSubmit={executeProbe} className="relative mb-8 lg:mb-16 max-w-full lg:max-w-5xl mx-auto flex flex-col gap-4 w-full">
            <div className="relative w-full max-w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 md:pl-8 flex items-center pointer-events-none">
                <Search className="w-4 h-4 md:w-6 md:h-6 text-slate-300 dark:text-white/10" />
              </div>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="TARGET IDENTIFIER"
                className="w-full max-w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl py-5 md:py-6 pl-10 md:pl-16 pr-4 md:pr-56 text-sm md:text-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 font-mono transition-all placeholder:text-slate-400 dark:placeholder:text-white/5 uppercase tracking-wider md:tracking-widest shadow-sm"
              />
              <button
                disabled={isProcessing || !target}
                className="hidden md:block absolute right-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-slate-400 dark:disabled:text-white/10 text-white px-10 rounded-xl text-[13px] font-bold uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run OSINT Probe'}
              </button>
            </div>
            {/* Mobile Only Button */}
            <button
              disabled={isProcessing || !target}
              className="md:hidden w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-slate-400 dark:disabled:text-white/10 text-white py-4 rounded-xl text-[12px] font-bold uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95 flex items-center justify-center"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run OSINT Probe'}
            </button>
          </form>

          <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl min-h-[400px] md:min-h-[500px] relative overflow-hidden flex flex-col group/terminal transition-colors duration-300 w-full shadow-inner dark:shadow-none">
            {!isProcessing && dossier ? (
              <div className="flex-1 p-5 md:p-10 lg:p-12 animate-in fade-in duration-700 w-full max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 pb-6 border-b border-slate-100 dark:border-white/5 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <Database className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] md:text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Intelligence Dossier</span>
                      <span className="block text-[8px] md:text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-tighter">14.2B Cross-referenced records</span>
                    </div>
                  </div>
                  <div className="flex gap-3 md:gap-4">
                    <button className="flex-1 sm:flex-none p-3 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white flex justify-center">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="flex-1 sm:flex-none p-3 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white flex justify-center">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="flex-1 sm:flex-none p-3 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white flex justify-center">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="font-mono text-[12px] md:text-[13px] text-slate-700 dark:text-white/60 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto no-scrollbar pr-4 break-words">
                  {dossier}
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center h-[400px] md:h-[500px] space-y-8 p-6 w-full">
                 <div className="relative">
                    <div className="w-16 h-16 md:w-24 md:h-24 border border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Crosshair className="w-5 h-5 md:w-8 md:h-8 text-blue-500/50 animate-pulse" />
                    </div>
                 </div>
                 <div className="text-center space-y-3 px-6">
                    <div className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-900 dark:text-white/80">Querying Repositories</div>
                    <div className="text-[8px] md:text-[10px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest">Correlating signals...</div>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-[400px] md:h-[500px] opacity-10 grayscale group-hover/terminal:opacity-30 dark:group-hover/terminal:opacity-20 group-hover/terminal:grayscale-0 transition-all duration-700 p-6 text-center w-full">
                <Shield className="w-16 h-16 md:w-24 md:h-24 stroke-[0.5px] mb-8 text-slate-900 dark:text-white" />
                <p className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] font-bold text-slate-900 dark:text-white">Awaiting Target Identifier</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceProbe;
