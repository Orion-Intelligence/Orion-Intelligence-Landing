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
    // Determine type for clinical analysis
    const type = target.includes('.') || target.includes('@') ? 'website' : 'ioc';
    const result = await generateThreatReport(target, type);
    
    setDossier(result);
    setIsProcessing(false);
  };

  return (
    <div id="terminal" className="w-full max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
        {/* Dashboard Header */}
        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
            </div>
            <div className="h-6 w-px bg-white/5"></div>
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-white/40" />
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em]">
                OSINT_CORE :: ORION-V4
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-blue-500 font-bold">GRID_LINK: ESTABLISHED</span>
            </div>
            <span className="text-white/20">DB_COUNT: 14.2B</span>
          </div>
        </div>

        <div className="p-8 lg:p-16">
          <form onSubmit={executeProbe} className="relative mb-16 max-w-5xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-white/10" />
            </div>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="EMAIL, USERNAME, DOMAIN, OR IP_ADDRESS"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 pl-16 pr-56 text-lg text-white focus:outline-none focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 font-mono transition-all placeholder:text-white/5 uppercase tracking-widest"
            />
            <button
              disabled={isProcessing || !target}
              className="absolute right-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/10 text-white px-10 rounded-xl text-[13px] font-bold uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run OSINT Probe'}
            </button>
          </form>

          <div className="bg-black/40 border border-white/5 rounded-2xl min-h-[500px] relative overflow-hidden flex flex-col group/terminal">
            {!isProcessing && dossier ? (
              <div className="flex-1 p-10 lg:p-12 animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <Database className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[11px] font-bold text-white uppercase tracking-widest">Intelligence Dossier</span>
                      <span className="block text-[9px] text-white/30 uppercase tracking-tighter">Analysis cross-referenced with 14.2B records</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors text-white/40 hover:text-white">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors text-white/40 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors text-white/40 hover:text-white">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="font-mono text-[13px] text-white/60 leading-[2] whitespace-pre-wrap max-h-[500px] overflow-y-auto no-scrollbar pr-4">
                  {dossier}
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center h-[500px] space-y-8">
                 <div className="relative">
                    <div className="w-24 h-24 border border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Crosshair className="w-8 h-8 text-blue-500/50 animate-pulse" />
                    </div>
                 </div>
                 <div className="text-center space-y-3">
                    <div className="text-[12px] font-bold uppercase tracking-[0.5em] text-white/80">Querying Leak Repositories</div>
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Correlating entities across signals...</div>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-[500px] opacity-10 grayscale group-hover/terminal:opacity-20 group-hover/terminal:grayscale-0 transition-all duration-700">
                <Shield className="w-24 h-24 stroke-[0.5px] mb-8" />
                <p className="text-[11px] uppercase tracking-[0.5em] font-bold">Awaiting Target Identifier</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceProbe;