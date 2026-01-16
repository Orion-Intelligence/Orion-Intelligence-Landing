
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Database, 
  Ghost,
  ShieldAlert,
  Lock,
  Zap,
  Command,
  Terminal,
  ShieldCheck,
  EyeOff,
  ExternalLink,
  BookOpen,
  Share2,
  Smartphone,
  Cpu,
  Workflow,
  Network,
  Globe,
  Radio,
  Key,
  Fingerprint,
  Mail,
  Phone,
  Anchor,
  CircleCheck,
  Server,
  FileSearch,
  Search,
  Download,
  Maximize2,
  Crosshair,
  ShieldQuestion,
  Layers,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Rss
} from 'lucide-react';
import Navbar from './components/Navbar';
import IntelligenceProbe from './components/IntelligenceProbe';
import IntelligenceFeed from './components/IntelligenceFeed';
import LegalModals from './components/LegalModals';
import ThreatActors from './components/ThreatActors';
import ApiDocumentation from './components/ApiDocumentation';
import SourceInventory from './components/SourceInventory';
import { useLanguage } from './components/LanguageContext';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'access' | 'compliance' | null>(null);
  const [view, setView] = useState<'home' | 'adversaries' | 'api-docs' | 'sources'>('home');
  const [footerLogoError, setFooterLogoError] = useState(false);
  const { t } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  const CALENDLY_URL = "https://calendly.com/msmannan/30min";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.overflowX = 'hidden'; 
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.title = "Orion Intelligence";
    const interval = setInterval(() => {
      if (document.title !== "Orion Intelligence") {
        document.title = "Orion Intelligence";
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const bgClass = ['adversaries', 'sources'].includes(view) ? 'mesh-gradient-bright' : 'mesh-gradient';

  return (
    <div className={`min-h-screen ${bgClass} selection:bg-blue-500/30 overflow-x-hidden transition-all duration-700`}>
      <div className="grain"></div>
      <Navbar onNavigate={setView} currentView={view} theme={theme} onToggleTheme={toggleTheme} />
      
      <LegalModals 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        type={activeModal || 'privacy'} 
      />

      <main className="relative z-10 w-full overflow-x-hidden">
        {view === 'adversaries' ? (
          <div className="pt-20 lg:pt-32 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto min-h-screen">
            <ThreatActors />
          </div>
        ) : view === 'api-docs' ? (
          <div className="pt-20 min-h-screen">
            <ApiDocumentation />
          </div>
        ) : view === 'sources' ? (
          <div className="pt-20 lg:pt-32 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto min-h-screen">
            <SourceInventory />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-20 overflow-hidden border-b border-slate-200 dark:border-white/5 pt-14 md:pt-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2000px] h-full bg-blue-500/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
              
              <div className="max-w-[1400px] mx-auto relative w-full flex-1 flex flex-col items-center justify-center text-center py-12 md:py-20">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  GOVERNANCE STANDARD V4.2.0
                </div>
                
                <h1 className="hero-heading text-3xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 md:mb-10 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 max-w-full break-words">
                  {t('hero_title')}
                </h1>
                
                <p className="text-base md:text-xl text-slate-500 dark:text-white/50 leading-relaxed font-medium mb-10 md:mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                  {t('hero_desc')}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 w-full sm:w-auto">
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto group px-8 md:px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-[12px] md:text-[13px] uppercase tracking-[0.12em] rounded-xl hover:bg-slate-800 dark:hover:bg-blue-50 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95">
                    {t('hero_demo')}
                    <Command className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <button 
                    onClick={() => setView('adversaries')}
                    className="w-full sm:w-auto px-8 md:px-10 py-4 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-[12px] md:text-[13px] uppercase tracking-[0.12em] rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Ghost className="w-4 h-4" />
                    {t('hero_adversary_inv')}
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="max-w-[1400px] mx-auto w-full pb-12 flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8 font-mono border-t border-slate-200 dark:border-white/5 pt-10 animate-in fade-in duration-1000 delay-500">
                {[
                  { label: t('stats_records'), val: '14.2B+', color: 'text-blue-600 dark:text-blue-500' },
                  { label: t('stats_groups'), val: '240+', color: 'text-slate-900 dark:text-white' },
                  { label: t('stats_throughput'), val: '1.4TB', color: 'text-slate-900 dark:text-white' },
                  { label: t('stats_uptime'), val: '99.98%', color: 'text-green-600 dark:text-green-500' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1 text-center md:text-left min-w-[120px]">
                    <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
                    <span className={`text-lg md:text-xl font-black tracking-tight ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Strategic Modular Core Section */}
            <section id="core" className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-slate-50 dark:bg-[#111113] relative">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 md:gap-16 mb-16 md:mb-24">
                  <div className="max-w-4xl space-y-4 md:space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                      <h2 className="text-[10px] md:text-[12px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider md:tracking-[0.4em]">{t('core_title')}</h2>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none pb-2 break-words">{t('core_subtitle')}</h3>
                  </div>
                  <div className="max-w-md space-y-4 md:space-y-6 border-l border-slate-200 dark:border-white/5 pl-6 md:pl-10">
                    <p className="text-base md:text-lg text-slate-500 dark:text-white/40 leading-relaxed font-medium">{t('core_desc')}</p>
                    <div className="flex items-center gap-4 text-blue-600 dark:text-blue-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">
                      <Layers className="w-4 h-4" />
                      Interoperable V4 Stack
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { id: '01', icon: Cpu, title: t('core_f1_title'), desc: t('core_f1_desc'), footer: 'Active Ingestion' },
                    { id: '02', icon: Workflow, title: t('core_f2_title'), desc: t('core_f2_desc'), footer: 'Clinical Audit' },
                    { id: '03', icon: Network, title: t('core_f3_title'), desc: t('core_f3_desc'), footer: 'Global Grid' },
                    { id: '04', icon: Smartphone, title: t('core_f4_title'), desc: t('core_f4_desc'), footer: 'End-to-End' },
                    { id: '05', icon: FileSearch, title: t('core_f5_title'), desc: t('core_f5_desc'), footer: 'TAXII Supported' },
                    { id: '06', icon: ShieldAlert, title: t('core_f6_title'), desc: t('core_f6_desc'), footer: 'Privacy Tier 1' },
                    { id: '07', icon: Search, title: t('core_f7_title'), desc: t('core_f7_desc'), footer: '14.2B Records' },
                    { id: '08', icon: Lock, title: t('core_f8_title'), desc: t('core_f8_desc'), footer: 'Zero Trust' }
                  ].map((f, i) => (
                    <div key={i} className="group relative bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/5 rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-500 hover:bg-slate-50 dark:hover:bg-[#161618] hover:-translate-y-1 hover:border-blue-500/20 shadow-sm dark:shadow-none hover:shadow-md">
                      <div className="flex items-start justify-between mb-8 md:mb-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                          <f.icon className="w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-slate-200 dark:text-white/5 group-hover:text-slate-400 dark:group-hover:text-white/20 transition-colors uppercase tracking-[0.3em] font-mono">ID: {f.id}</span>
                      </div>
                      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow">
                        <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{f.title}</h4>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-white/40 leading-relaxed font-medium">{f.desc}</p>
                      </div>
                      <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">{f.footer}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/10 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Secure Reporting System - Tablet Optimized (md:grid-cols-2) */}
            <section className="px-6 md:px-12 lg:px-20 py-20 md:py-24 lg:py-32 discovery-gradient relative overflow-hidden border-y border-slate-200 dark:border-white/5">
               <div className="max-w-[1400px] mx-auto">
                 <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-24 border border-slate-200 dark:border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 hidden md:block">
                      <a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-slate-400 dark:text-white/20 hover:text-blue-600 dark:hover:text-blue-500 transition-colors uppercase tracking-[0.4em]">orionleaks.com</a>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                     <div className="space-y-8 md:space-y-10">
                        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
                          <Lock className="w-4 h-4" />
                          TLP:RED SECURE CHANNEL
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">{t('whistle_title')}</h2>
                        <p className="text-base md:text-lg text-slate-500 dark:text-white/40 leading-relaxed max-w-xl font-medium">
                          {t('whistle_desc')}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {[
                             { icon: Fingerprint, title: t('whistle_identity'), desc: 'Metadata scrubbing.' },
                             { icon: Key, title: t('whistle_pgp'), desc: 'E2EE Encryption.' },
                             { icon: Anchor, title: t('whistle_role'), desc: 'Verified auditors only.' },
                             { icon: Radio, title: t('whistle_onion'), desc: 'GlobaLeaks native.' }
                           ].map((feat, i) => (
                             <div key={i} className="space-y-3">
                               <div className="flex items-center gap-3">
                                 <feat.icon className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                                 <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{feat.title}</span>
                               </div>
                               <p className="text-[10px] text-slate-400 dark:text-white/30 leading-relaxed uppercase tracking-tight font-bold">{feat.desc}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="relative">
                        <div className="aspect-square bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center relative group overflow-hidden shadow-sm dark:shadow-none">
                           <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <ShieldAlert className="w-32 md:w-48 h-32 md:h-48 text-slate-100 dark:text-white/[0.01] group-hover:text-blue-600/10 dark:group-hover:text-blue-500/10 transition-colors duration-1000" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
                                <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                              </div>
                              <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">{t('whistle_button')}</h4>
                              <p className="text-[10px] text-slate-400 dark:text-white/30 font-mono mb-8 uppercase tracking-widest">ORION_SECURE_INTAKE</p>
                              <a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 dark:hover:bg-blue-50 transition-all active:scale-95">
                                {t('whistle_button')}
                              </a>
                           </div>
                        </div>
                     </div>
                   </div>
                 </div>
               </div>
            </section>

            {/* Probe & Feed Section */}
            <section id="probe" className="px-6 md:px-12 lg:px-20 py-20 md:py-32 overflow-hidden relative bg-white dark:bg-[#0e0e10] border-y border-slate-200 dark:border-white/5">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/[0.02] blur-[150px] pointer-events-none rounded-full"></div>
              <div className="max-w-[1400px] mx-auto relative z-10 w-full">
                <div className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6 px-2">
                   <div className="inline-flex items-center gap-4 text-blue-600 dark:text-blue-500 font-bold text-[9px] md:text-[10px] uppercase tracking-wider md:tracking-[0.5em]">
                     <Terminal className="w-4 h-4" />
                     Investigation Console
                   </div>
                   <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none pb-2 break-words">{t('probe_title')}</h3>
                   <p className="text-base md:text-lg text-slate-500 dark:text-white/20 max-w-3xl mx-auto leading-relaxed font-medium">
                     {t('probe_desc')}
                   </p>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
                  <div className="lg:col-span-8 flex flex-col order-1 min-w-0">
                    <IntelligenceProbe />
                  </div>
                  <div className="lg:col-span-4 flex flex-col order-2 min-w-0">
                    <IntelligenceFeed />
                  </div>
                </div>
              </div>
            </section>

            {/* Admin Control Section - Tablet Optimized (md:grid-cols-3) */}
            <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-slate-50 dark:bg-[#131315]">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-16 md:mb-24">
                  <div className="max-w-4xl space-y-8">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <CircleCheck className="w-3 h-3" />
                        ISO/SOC2 ALIGNED
                      </div>
                      <h2 className="text-[12px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-[0.4em]">{t('admin_subtitle')}</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">{t('admin_title')}</h3>
                  </div>
                  <div className="max-w-md space-y-6 border-l border-slate-200 dark:border-white/5 pl-8 md:pl-10">
                    <p className="text-base md:text-lg text-slate-500 dark:text-white/40 leading-relaxed font-medium">
                      {t('admin_desc')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8">
                   {[
                     { icon: Fingerprint, title: t('admin_f1'), desc: 'Hardware-backed verification.' },
                     { icon: FileSearch, title: t('admin_f2'), desc: 'Full compliance logging.' },
                     { icon: Server, title: t('admin_f3'), desc: 'Hardware-level virtualization.' }
                   ].map((item, i) => (
                     <div key={i} className="bg-white dark:bg-[#0d0d0f] p-8 md:p-10 rounded-3xl group hover:border-blue-600/20 dark:hover:border-blue-500/20 transition-all border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-600/20 dark:border-blue-500/20 group-hover:scale-110 transition-transform">
                           <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">{item.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                   ))}
                </div>
              </div>
            </section>

            {/* Operational Liaison - Tablet Optimized with proper centering */}
            <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-40 discovery-gradient group overflow-hidden relative border-t border-slate-200 dark:border-white/10">
              <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center relative z-10">
                 <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">
                   <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-500" />
                   ORION_GRID: NOMINAL
                 </div>
                 
                 <div className="space-y-6 mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-white/20">{t('contact_title')}</span>
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-slate-500 dark:text-white/40 leading-relaxed font-medium max-w-3xl mx-auto">
                      {t('contact_desc')}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-y-16 lg:gap-12 w-full max-w-6xl mx-auto mb-20 md:mb-24 text-left">
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-white/60 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/5 pb-2 group-hover/item:border-blue-600/40 dark:group-hover/item:border-blue-500/40 transition-colors">
                          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                          {t('contact_hq')}
                       </div>
                       <p className="text-sm md:text-base text-slate-600 dark:text-white/40 leading-relaxed font-medium">
                         75 H2 Wapda Town <br />
                         Lahore, Pakistan
                       </p>
                    </div>
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-white/60 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/5 pb-2 group-hover/item:border-blue-600/40 dark:group-hover/item:border-blue-500/40 transition-colors">
                          <Anchor className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                          {t('contact_hub')}
                       </div>
                       <p className="text-sm md:text-base text-slate-600 dark:text-white/40 leading-relaxed font-medium">
                         PO Box 65 Minto <br />
                         Sydney, Australia, 2566
                       </p>
                    </div>
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-white/60 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/5 pb-2 group-hover/item:border-blue-600/40 dark:group-hover/item:border-blue-500/40 transition-colors">
                          <Phone className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                          {t('contact_call')}
                       </div>
                       <p className="text-sm md:text-base text-slate-600 dark:text-white/40 leading-relaxed font-medium">
                         (+92) 332 4935230
                       </p>
                    </div>
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-white/60 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/5 pb-2 group-hover/item:border-blue-600/40 dark:group-hover/item:border-blue-500/40 transition-colors">
                          <Mail className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                          {t('contact_email')}
                       </div>
                       <p className="text-sm md:text-base text-slate-600 dark:text-white/40 leading-relaxed font-medium">
                         msmannan00@gmail.com
                       </p>
                    </div>
                 </div>
                 
                 <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[13px] md:text-[14px] uppercase tracking-[0.15em] flex items-center justify-center gap-8 transition-all active:scale-95 shadow-2xl shadow-blue-500/20 border-t border-white/20 group-hover:scale-105">
                   {t('contact_button')}
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                 </a>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="px-6 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-[#0a0a0c] border-t border-slate-200 dark:border-white/10 relative z-10 w-full overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Footer Grid - Fully Optimized for Tablet (md:grid-cols-4) and Desktop (lg:grid-cols-12) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-20">
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
                <div className="w-12 h-12 relative flex items-center justify-center rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-black">
                  {!footerLogoError ? (
                    <img 
                      src="https://try.orionintelligence.org/api/s/static/system/logo_url_default.png" 
                      alt="Orion" 
                      className="w-full h-full object-cover scale-110" 
                      onError={() => setFooterLogoError(true)}
                    />
                  ) : (
                    <div className="text-blue-600 dark:text-blue-500 font-bold text-2xl">O</div>
                  )}
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-[0.3em] uppercase">ORION</span>
              </div>
              <p className="text-slate-600 dark:text-white/70 max-w-sm text-base md:text-lg leading-relaxed font-medium">
                The premier workspace for enterprise defenders and researchers. Clinical data, zero noise.
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-8">
              <h5 className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] opacity-90">{t('footer_platform')}</h5>
              <ul className="space-y-4 text-[12px] text-slate-500 dark:text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><a href="https://try.orionintelligence.org/" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2">Live Portal <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="https://github.com/Orion-Intelligence/Orion-Intelligence" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2">Sources <Share2 className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-8">
              <h5 className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] opacity-90">{t('footer_intelligence')}</h5>
              <ul className="space-y-4 text-[12px] text-slate-500 dark:text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><button onClick={() => setView('adversaries')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-all flex items-center gap-2">Threat Grid <Ghost className="w-3 h-3" /></button></li>
                <li><button onClick={() => setView('sources')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-all flex items-center gap-2">Sources <BookOpen className="w-3 h-3" /></button></li>
                <li><a href="https://orion-search.readthedocs.io/en/latest/app_docs/introduction_to_platform.html" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2">Docs <BookOpen className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-8">
              <h5 className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] opacity-90">{t('footer_network')}</h5>
              <ul className="space-y-4 text-[12px] text-slate-500 dark:text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><a href="https://orionfeed.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2">Feed <Rss className="w-3 h-3" /></a></li>
                <li><a href="https://x.com/orionfeed" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2">X <Twitter className="w-3 h-3" /></a></li>
                <li><a href="https://www.linkedin.com/showcase/108619822/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2">LinkedIn <Linkedin className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-8">
              <h5 className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] opacity-90">{t('footer_policy')}</h5>
              <ul className="space-y-4 text-[12px] text-slate-500 dark:text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Privacy</button></li>
                <li><button onClick={() => setActiveModal('compliance')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Audit</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-slate-500 dark:text-white/80">
               <span>{t('footer_copy')}</span>
               <span className="font-mono text-blue-600 dark:text-blue-400">14.2B RECORDS</span>
            </div>
            <div className="flex gap-10 items-center">
               <span className="flex items-center gap-3 text-slate-900 dark:text-white tracking-widest font-extrabold">
                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                 GRID: ONLINE
               </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
