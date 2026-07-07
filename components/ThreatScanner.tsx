import React, { useState } from 'react';
import { Loader2, FileText, Database, Shield } from 'lucide-react';
import { generateThreatReport } from '../services/geminiService';

const ThreatScanner: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    
    setIsScanning(true);
    setReport(null);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    const type = target.includes('.') ? 'website' : 'ioc';
    const result = await generateThreatReport(target, type);
    
    setReport(result);
    setIsScanning(false);
  };

  return (
    <div id="terminal" className="w-full">
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#262626] rounded-sm overflow-hidden shadow-sm dark:shadow-none">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#262626] flex items-center justify-between bg-slate-50 dark:bg-[#0f0f0f]">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-slate-400 dark:text-[#737373]" />
            <h2 className="text-xs font-medium text-slate-900 dark:text-white uppercase tracking-widest">
              Intelligence Probe
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-[#525252] font-mono">ENV: ORION_PROD_04</span>
        </div>

        <div className="p-8">
          <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-0">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="TARGET: [DOMAIN / IP / HASH]"
              className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-[#262626] py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/40 dark:focus:border-[#404040] font-mono transition-all placeholder:text-slate-400 dark:placeholder:text-[#404040]"
            />
            <button
              disabled={isScanning || !target}
              className="bg-slate-100 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#262626] border-y md:border-y-0 md:border-r border-slate-200 dark:border-[#262626] border-r md:border-l-0 text-slate-600 dark:text-[#a3a3a3] hover:text-slate-900 dark:hover:text-white px-8 py-3 text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Probe'}
            </button>
          </form>

          <div className="mt-8 border border-slate-200 dark:border-[#262626] bg-slate-50/80 dark:bg-black/50 min-h-[400px] flex flex-col">
            {!isScanning && report ? (
              <div className="flex-1 p-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-[#262626]">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#737373] uppercase tracking-wider">
                    <Shield className="w-3 h-3" />
                    Probe Result
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-[#525252]">
                    TIMESTMP: {new Date().toISOString()}
                  </div>
                </div>
                <div className="font-mono text-[11px] text-slate-600 dark:text-[#a3a3a3] leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {report}
                </div>
              </div>
            ) : isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-[#525252] font-mono space-y-4">
                <div className="w-4 h-4 border border-slate-300 dark:border-[#525252] border-t-blue-600 dark:border-t-white animate-spin"></div>
                <div className="text-[10px] uppercase tracking-[0.2em] animate-pulse">Running heuristic modules...</div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-[#404040] space-y-4">
                <FileText className="w-12 h-12 stroke-[1px] opacity-20" />
                <p className="text-[10px] uppercase tracking-widest font-medium">Ready for input</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatScanner;
