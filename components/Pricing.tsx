
import React, { useState } from 'react';
import { 
  Check, ArrowRight,
  Laptop, Cpu, Layers, Target, 
  Mail, MousePointer2, ShieldCheck, 
  XCircle, Shield, Users, Database, Clock
} from 'lucide-react';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleCustomQuote = (tier: string) => {
    const subject = encodeURIComponent(`Licensing Inquiry: ${tier} [${billingCycle.toUpperCase()}]`);
    const body = encodeURIComponent(`Ref: ORION_DEPLOYMENT_REQUEST\nTier: ${tier}\nCycle: ${billingCycle}\n\nRequesting a pricing quote and deployment details.`);
    window.location.href = `mailto:support@orionintelligence.org?subject=${subject}&body=${body}`;
  };

  const plans = [
    {
      id: "ESSENTIAL-01",
      name: "Essential",
      price: billingCycle === 'annual' ? "1,200" : "1,500",
      isQuote: false,
      desc: "For small teams that need core search, breach monitoring, and basic exposure checks.",
      features: [
        "3 analyst seats + 10 viewers",
        "2 monitored organizations",
        "200k indexed records per month",
        "90-day data retention",
        "Unified search + IOC extraction",
        "News and breach monitoring",
        "Basic alerts and WebScan",
        "Limited API access"
      ],
      button: "Contact Us",
      type: "standard"
    },
    {
      id: "PRO-01",
      name: "Professional",
      price: "QUOTE",
      isQuote: true,
      desc: "For CTI and OSINT teams running active investigations across dark-web, Telegram, exploit, and defacement sources.",
      features: [
        "8 analyst seats + 30 viewers",
        "10 monitored organizations",
        "1M indexed records per month",
        "180-day data retention",
        "Everything in Essential",
        "Forum and Telegram monitoring",
        "Exploit, CVE, and defacement tracking",
        "STIX 2.1 export + ranked search",
        "Standard API access"
      ],
      button: "Request Quote",
      type: "highlight",
      badge: "RECOMMENDED"
    },
    {
      id: "BIZ-01",
      name: "Business",
      price: "QUOTE",
      isQuote: true,
      desc: "For enterprises that need governed investigations, stealer-log workflows, case operations, and audit-ready team controls.",
      features: [
        "20 analyst seats + unlimited viewers",
        "50 monitored organizations",
        "5M indexed records per month",
        "12-month data retention",
        "Everything in Professional",
        "Tracking dashboards and BEC hub",
        "Case management workspace",
        "Full stealer-log workflows",
        "Governance and audit logs",
        "White-labeling and tenant controls"
      ],
      button: "Request Quote",
      type: "sovereign"
    }
  ];

  const matrix = [
    { feat: "Source Collection Coverage", desc: "Clearnet, Onion, I2P, forums, Telegram, and ransomware leak-site ingestion.", orion: true, std: "Partial" },
    { feat: "Ransomware and Breach Tracking", desc: "Victim posts, dump records, leak metadata, screenshots, and source context.", orion: true, std: "Add-on" },
    { feat: "Stealer-log Investigation", desc: "Credential exposure search, persona checks, and enterprise risk scoring.", orion: true, std: "Add-on" },
    { feat: "Exploit and Defacement Intel", desc: "Exploit, CVE, hacktivist, and defacement report workflows.", orion: true, std: "Partial" },
    { feat: "STIX 2.1 Export", desc: "Report-level STIX conversion for breach, exploit, social, chat, and news records.", orion: true, std: "Add-on" },
    { feat: "Case Workspace", desc: "Case records, artifacts, sharing, analyst assignment, and investigation handoff.", orion: true, std: "Partial" },
    { feat: "Governance and Audit Logs", desc: "Tenant controls, role-aware access, FIDO2 support, alerts, and audit history.", orion: true, std: "Add-on" },
    { feat: "Dynamic Scans and IOC Extraction", desc: "Domain, IP, social, crypto, APK, and file-based IOC extraction workflows.", orion: true, std: "Partial" },
  ];

  return (
    <div className="pb-32 animate-in fade-in duration-700 w-full overflow-x-hidden relative">
      
      {/* Galaxy Stars Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
        <div className="absolute inset-0 opacity-40 dark:opacity-100 transition-all duration-1000" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 15% 25%, rgba(59,130,246,0.12), transparent 50%),
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
                 repeating-radial-gradient(circle at center, transparent 0, transparent 200px, rgba(59,130,246,0.03) 201px, transparent 203px)
               `
             }}>
        </div>
        <div className="absolute inset-0 opacity-70 dark:opacity-0 transition-opacity duration-700 light-galaxy-detail"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-900/5 blur-[180px] rounded-full"></div>
      </div>

      {/* 1. Header */}
      <header className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-16 mb-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Operational <span className="text-blue-600 dark:text-blue-500">Tiers</span>
            </h1>
            <p className="text-base md:text-xl text-slate-500 dark:text-white/40 font-medium leading-relaxed max-w-2xl">
              Choose the right Orion plan for your team, data volume, and investigation workflow.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white/60'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl relative transition-all ${billingCycle === 'annual' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white/60'}`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black animate-pulse">Save 20%</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Tier Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-32 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const isHighlight = plan.type === 'highlight';
            const isSovereign = plan.type === 'sovereign';
            
            return (
              <div 
                key={i} 
                className={`group flex flex-col h-full bg-white/80 dark:bg-[#0d0d0f]/80 backdrop-blur-md border rounded-[2.5rem] p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${
                  isHighlight 
                    ? 'border-blue-600/30 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10' 
                    : 'border-slate-200 dark:border-white/10 shadow-sm'
                }`}
              >
                {isHighlight && (
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
                )}
                
                <div className="space-y-10 mb-auto">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                      {plan.id.startsWith('ESSENTIAL') ? <Users className="w-5 h-5" /> : plan.id.startsWith('PRO') ? <Database className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    {plan.badge && (
                      <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-lg">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">{plan.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-white/40 font-medium leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    {!plan.isQuote && <span className="text-sm font-black text-blue-600 uppercase tracking-widest">$</span>}
                    <span className={`${!plan.isQuote ? 'text-5xl lg:text-6xl' : 'text-4xl'} font-black text-slate-900 dark:text-white tracking-tighter font-mono leading-none`}>
                      {plan.price}
                    </span>
                    {!plan.isQuote && (
                      <span className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest">/ month</span>
                    )}
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">Included Access</span>
                    <ul className="space-y-4">
                      {plan.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-blue-600" strokeWidth={4} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 dark:text-white/60 tracking-tight uppercase leading-none">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => handleCustomQuote(plan.name)}
                  className={`mt-12 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg ${
                  isHighlight 
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20' 
                    : isSovereign
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                }`}>
                  {plan.button}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Capability Audit Matrix */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-32 relative z-10">
        <div className="space-y-12">
           <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">Platform Coverage</h2>
              <p className="text-slate-500 dark:text-white/40 font-medium text-base">How Orion maps core investigation, collection, governance, and export workflows against common intelligence tools.</p>
           </div>

           <div className="bg-white/80 dark:bg-[#0d0d0f]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] w-1/2">Intelligence Module</th>
                       <th className="p-8 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] text-center bg-blue-600/[0.02]">Orion Platform</th>
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Typical Tools</th>
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
      </section>

      {/* 4. Final CTA */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="relative p-12 md:p-20 rounded-[3rem] bg-slate-900 dark:bg-white overflow-hidden group shadow-2xl">
           <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_2px_2px,#3b82f6_1px,transparent_0)] bg-[size:32px_32px]"></div>
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                  <Target className="w-3 h-3" />
                  Deployment Ready
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-slate-900 tracking-tighter uppercase leading-none">
                  Secure Your <br className="hidden md:block" /> Intelligence Node
                </h2>
                <p className="text-base md:text-xl text-white/60 dark:text-slate-500 font-medium max-w-xl">
                  Contact us to plan your tactical workspace and begin your investigation with global record access.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                 <a 
                  href="https://calendly.com/msmannan/30min" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                 >
                   Operational Demo <MousePointer2 className="w-4 h-4" />
                 </a>
                 <button 
                  onClick={() => handleCustomQuote('Strategic Enterprise Hub')}
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-500/20 border-t border-white/20"
                 >
                   Request Quote <Mail className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="mt-16 flex items-center justify-center md:justify-start gap-10 opacity-30">
              <div className="flex items-center gap-2 text-[10px] font-black text-white dark:text-slate-900 uppercase tracking-widest">
                <Shield className="w-4 h-4" /> ISO_27001
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-white dark:text-slate-900 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> SOC2_READY
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-white dark:text-slate-900 uppercase tracking-widest">
                <Layers className="w-4 h-4" /> FIPS_ALIGNED
              </div>
           </div>
        </div>
      </section>
      
    </div>
  );
};

export default Pricing;
