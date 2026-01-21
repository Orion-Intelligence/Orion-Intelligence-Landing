
import React, { useState, useMemo } from 'react';
import { 
  Zap, CreditCard, ShieldCheck, ChevronRight, 
  Lock, Globe, Database, Terminal, 
  CheckCircle2, AlertTriangle, X, Fingerprint,
  ExternalLink, Layers, Activity, Clock, Users, XCircle
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  category: string;
  type: 'standard' | 'restricted' | 'custom';
  description: string;
  features: string[];
}

const pricingData: PricingTier[] = [
  {
    id: 'ESSENTIAL-01',
    name: 'Essential',
    price: '1,200',
    category: 'Tier I',
    type: 'standard',
    description: 'Ideal for small teams starting dedicated intelligence monitoring and investigative research.',
    features: [
      '3 Analyst + 10 Viewer seats',
      '2 Tracked Companies',
      '200k items/month ingestion',
      '90-day data retention',
      'Search + IOC Extraction',
      'Basic Alerts & WebScan'
    ]
  },
  {
    id: 'PRO-01',
    name: 'Professional',
    price: 'QUOTE',
    category: 'Tier II',
    type: 'restricted',
    description: 'Advanced intelligence engine for active CTI and OSINT teams requiring deep dark-web visibility.',
    features: [
      '8 Analyst + 30 Viewer seats',
      '10 Tracked Companies',
      '1M items/month ingestion',
      '180-day data retention',
      'Forum & Telegram Monitoring',
      'STIX Export + Ranked Search'
    ]
  },
  {
    id: 'BIZ-01',
    name: 'Business',
    price: 'QUOTE',
    category: 'Tier III',
    type: 'custom',
    description: 'Org-wide monitoring and investigation suite for large enterprises with complex compliance needs.',
    features: [
      '20 Analyst + Unlimited Viewers',
      '50 Tracked Companies',
      '5M items/month ingestion',
      '12-month data retention',
      'Case Management System',
      'Full Stealer Log Workflows'
    ]
  }
];

const matrix = [
  { feat: "Custom Python Collectors", desc: "User-defined extraction scripts on remote nodes.", orion: true, std: false },
  { feat: "Automated Deep-Web Crawl", desc: "Multithreaded Onion/I2P indexing agents.", orion: true, std: "Partial" },
  { feat: "Passive Harvest Engine", desc: "Harvester-mode browser integration.", orion: true, std: false },
  { feat: "STIX 2.1 / TAXII Support", desc: "Standardized threat intel export.", orion: true, std: "Add-on" },
  { feat: "Metadata Sanitization", desc: "Automatic stripping of PII identifiers.", orion: true, std: false },
  { feat: "Hardware-Level Isolation", desc: "Isolated virtualization for case data.", orion: true, std: false },
  { feat: "Real-time Telegram Scraping", desc: "Live ingestion from 240+ channels.", orion: true, std: "Add-on" },
  { feat: "Automatic IOC Extraction", desc: "Heuristic-based extraction logic.", orion: true, std: "Partial" },
];

const PricingV1: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleAction = (tierName: string) => {
    const subject = encodeURIComponent(`Licensing Inquiry: ${tierName} [${billingCycle.toUpperCase()}]`);
    const body = encodeURIComponent(`Ref: ORION_DEPLOYMENT_REQUEST\nTier: ${tierName}\nCycle: ${billingCycle}\n\nRequesting technical briefing and quota allocation.`);
    window.location.href = `mailto:support@orionintelligence.org?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out px-0 relative">
      {/* Background stars and gradients mirrored from SourceInventory */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30 w-screen left-1/2 -translate-x-1/2">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: `radial-gradient(1px 1px at 15% 15%, white, transparent),
                                 radial-gradient(1.5px 1.5px at 25% 55%, white, transparent),
                                 radial-gradient(1px 1px at 45% 25%, white, transparent),
                                 radial-gradient(2px 2px at 65% 85%, white, transparent),
                                 radial-gradient(1.2px 1.2px at 95% 15%, white, transparent),
                                 radial-gradient(3px 3px at 15% 15%, rgba(59,130,246,0.1), transparent),
                                 radial-gradient(4px 4px at 85% 85%, rgba(59,130,246,0.08), transparent),
                                 repeating-radial-gradient(circle at center, transparent 0, transparent 200px, rgba(59,130,246,0.03) 201px, transparent 203px)`,
               backgroundSize: '400px 400px, 400px 400px, 400px 400px, 400px 400px, 400px 400px, 800px 800px, 1000px 1000px, 100% 100%'
             }}>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12 px-4 md:px-0">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em]">
            <CreditCard className="w-3 h-3" />
            Quota Allocation Matrix
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">Licensing Matrix</h2>
          <p className="text-lg text-slate-500 dark:text-white/40 font-medium leading-relaxed">
            Clinical distribution of intelligence capacity across clearnet and deep-web extraction nodes.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12 px-4 md:px-0">
        <button 
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${billingCycle === 'monthly' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Monthly Billing
        </button>
        <button 
          onClick={() => setBillingCycle('annual')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${billingCycle === 'annual' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Annual Billing (-20%)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0 mb-16">
        {pricingData.map((tier) => (
          <div 
            key={tier.id} 
            onClick={() => setSelectedTier(tier)}
            className="group flex flex-row items-center gap-4 lg:gap-6 px-4 lg:px-6 py-5 lg:py-6 bg-slate-200/70 dark:bg-[#0d0d0f]/60 border border-slate-300/60 dark:border-white/10 rounded-2xl transition-all cursor-pointer hover:bg-blue-100/40 dark:hover:bg-blue-900/15 hover:border-blue-500/30 dark:hover:border-blue-500/30 shadow-sm dark:shadow-none backdrop-blur-3xl"
          >
            <div className="flex justify-start shrink-0">
               <div className={`p-3 lg:p-4 rounded-xl border transition-colors ${
                  tier.type === 'custom' ? 'bg-purple-600/10 border-purple-600/20 text-purple-600' :
                  tier.type === 'restricted' ? 'bg-red-600/10 border-red-600/20 text-red-600' :
                  'bg-blue-600/10 border-blue-600/20 text-blue-600'
                }`}>
                  {tier.type === 'custom' ? <Layers className="w-5 h-5" /> : 
                   tier.type === 'restricted' ? <ShieldCheck className="w-5 h-5" /> : 
                   <Zap className="w-5 h-5" />}
               </div>
            </div>

            <div className="flex flex-col space-y-1 w-full min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="text-[13px] lg:text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-widest font-mono truncate uppercase">
                  {tier.name}
                </h3>
                <span className="text-[10px] font-black text-slate-400 dark:text-white/20 font-mono">
                  {tier.price === 'QUOTE' ? 'POA' : `$${tier.price}/mo`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${tier.type === 'custom' ? 'bg-purple-600' : tier.type === 'restricted' ? 'bg-red-600' : 'bg-green-600'} opacity-40 shrink-0`}></div>
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest truncate">
                  {tier.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 text-[7px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em]">
                  {tier.id}
                </span>
              </div>
            </div>

            <div className="flex justify-end shrink-0">
              <div className="flex items-center gap-3 text-slate-300 dark:text-white/10 group-hover:text-blue-600 transition-colors">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Matrix Section */}
      <div className="space-y-8 px-4 md:px-0">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">Capability Audit</h2>
          <p className="text-slate-500 dark:text-white/40 font-medium text-sm">Comparing Orion's high-fidelity modules against standard industry intelligence offerings.</p>
        </div>

        <div className="bg-white/80 dark:bg-[#0d0d0f]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] w-1/2">Intelligence Module</th>
                  <th className="p-8 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] text-center bg-blue-600/[0.02]">Orion V4.2</th>
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Industry Std</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {matrix.map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="p-8 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{row.feat}</h4>
                      <p className="text-[11px] text-slate-400 dark:text-white/30 font-medium leading-tight">{row.desc}</p>
                    </td>
                    <td className="p-8 text-center bg-blue-600/[0.02]">
                      <div className="flex justify-center">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex justify-center">
                        {typeof row.std === 'string' ? (
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{row.std}</span>
                        ) : row.std ? (
                          <ShieldCheck className="w-5 h-5 text-slate-300 dark:text-white/10" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-200 dark:text-white/5" strokeWidth={1.5} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20">
                  <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Tier Detail</h3>
              </div>
              <button onClick={() => setSelectedTier(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <p className="text-slate-900 dark:text-white font-bold text-[12px] uppercase tracking-widest">{selectedTier.name} — Quota Breakdown</p>
                <p className="text-slate-500 dark:text-white/60 text-sm leading-relaxed">
                  {selectedTier.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">Module Permissions</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedTier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-[10px] text-slate-900 dark:text-white font-bold uppercase tracking-widest">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-blue-600/5 dark:bg-blue-500/5 border border-blue-600/10 dark:border-blue-500/10 rounded-2xl flex items-start gap-4">
                <Activity className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">SLA Status</p>
                  <p className="text-[9px] text-slate-500 dark:text-white/40 font-medium">99.98% Guaranteed Uptime for Grid Nodes.</p>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => { handleAction(selectedTier.name); setSelectedTier(null); }}
                className="flex-1 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
              >
                Provision Account
                <ExternalLink className="w-4 h-4 opacity-40" />
              </button>
              <button 
                onClick={() => setSelectedTier(null)}
                className="flex-1 px-8 py-4 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingV1;
