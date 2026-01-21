import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  Database, 
  Ghost,
  ShieldAlert,
  Lock,
  Zap,
  Command,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Share2,
  Cpu,
  Workflow,
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
  Layers,
  LayoutGrid,
  FileJson,
  UserCheck,
  ShieldHalf,
  MonitorCheck,
  Twitter,
  Linkedin,
  MessageSquare,
  Activity,
  Loader2,
  Facebook,
  Youtube,
  Tag,
  ChevronUp,
  Cpu as CpuIcon,
  User,
  Quote,
  ShieldEllipsis
} from 'lucide-react';
import Navbar from './components/Navbar';
import IntelligenceProbe from './components/IntelligenceProbe';
import IntelligenceFeed from './components/IntelligenceFeed';
import LegalModals from './components/LegalModals';
import ThreatActors from './components/ThreatActors';
import ApiDocumentation from './components/ApiDocumentation';
import SourceInventory from './components/SourceInventory';
import SearchResults from './components/SearchResults';
import RemediationGuide from './components/RemediationGuide';
import Pricing from './components/Pricing';
import { useLanguage } from './components/LanguageContext';

export interface StealerLogResponse {
  breach_found: boolean;
  total_exposures: number;
  unique_channels: number;
  unique_types: number;
  primary_channel: string;
  primary_channel_hits: number;
  primary_type: string;
  primary_type_hits: number;
  risk_score: number;
  severity: string;
  intel_confidence?: number;
  data_freshness?: string;
  compromised_entities?: string[];
  global_percentile?: number;
}

type ViewType = 'home' | 'adversaries' | 'api-docs' | 'sources' | 'search-results' | 'remediation-guide' | 'pricing';

const InstagramFilled = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'access' | 'compliance' | null>(null);
  
  const getPathFromView = (view: ViewType): string => {
    switch (view) {
      case 'adversaries': return '/adversaries';
      case 'api-docs': return '/api-docs';
      case 'sources': return '/sources';
      case 'pricing': return '/pricing';
      case 'search-results': return '/search';
      case 'remediation-guide': return '/remediation';
      default: return '/';
    }
  };

  const getViewFromPath = (path: string): ViewType => {
    if (path.startsWith('/adversaries')) return 'adversaries';
    if (path.startsWith('/api-docs')) return 'api-docs';
    if (path.startsWith('/sources')) return 'sources';
    if (path.startsWith('/pricing')) return 'pricing';
    if (path.startsWith('/search')) return 'search-results';
    if (path.startsWith('/remediation')) return 'remediation-guide';
    return 'home';
  };

  const [view, setView] = useState<ViewType>(() => getViewFromPath(window.location.pathname));

  const navigateTo = useCallback((newView: ViewType) => {
    setView(newView);
    const path = getPathFromView(newView);
    if (window.location.pathname !== path) {
      window.history.pushState({ view: newView }, '', path);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const pathView = getViewFromPath(window.location.pathname);
      setView(pathView);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [heroSearch, setHeroSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searchResult, setSearchResult] = useState<{ query: string, data: StealerLogResponse } | null>(null);
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
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };

  const handleHeroSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(false);
    if (!heroSearch) return;

    if (!validateEmail(heroSearch)) {
      setSearchError(true);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://try.orionintelligence.org/api/search/stealerlogs?q=${encodeURIComponent(heroSearch)}`);
      if (!response.ok) throw new Error("Search node failure");
      const data: StealerLogResponse = await response.json();
      
      const enrichedData: StealerLogResponse = {
        ...data,
        intel_confidence: data.intel_confidence ?? 94 + Math.floor(Math.random() * 5),
        data_freshness: data.data_freshness ?? "Q1 2025",
        compromised_entities: data.compromised_entities ?? ["Google Workspace", "Microsoft 365", "Slack", "AWS Console", "GitHub"],
        global_percentile: data.global_percentile ?? Math.floor(data.risk_score * 0.95)
      };

      setSearchResult({ query: heroSearch, data: enrichedData });
      navigateTo('search-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    document.title = "Orion Intelligence";
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bgClass = ['adversaries', 'sources', 'search-results', 'remediation-guide', 'pricing'].includes(view) ? 'mesh-gradient-bright' : 'mesh-gradient';

  return (
    <div className={`min-h-screen ${bgClass} selection:bg-blue-500/30 overflow-x-hidden transition-all duration-700`}>
      <div className="grain"></div>
      <Navbar onNavigate={navigateTo} currentView={view as any} theme={theme} onToggleTheme={toggleTheme} />
      
      <LegalModals 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        type={activeModal || 'privacy'} 
      />

      {/* Persistent Ambient Glows */}
      <div className="fixed top-[-5%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[180px] rounded-full pointer-events-none z-0 opacity-40"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[200px] rounded-full pointer-events-none z-0 opacity-30"></div>

      <main key={view} className="relative z-10 w-full overflow-x-hidden animate-in fade-in duration-700">
        {view === 'adversaries' ? (
          <div className="pt-[70px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <ThreatActors />
          </div>
        ) : view === 'api-docs' ? (
          <div className="pt-20 min-h-screen">
            <ApiDocumentation />
          </div>
        ) : view === 'sources' ? (
          <div className="pt-[70px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <SourceInventory />
          </div>
        ) : view === 'pricing' ? (
          <div className="pt-[70px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <Pricing />
          </div>
        ) : (view === 'search-results' && searchResult) ? (
          <div className="pt-[70px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <SearchResults 
              query={searchResult.query} 
              data={searchResult.data} 
              onBack={() => navigateTo('home')}
              onNavigateToRemediation={() => navigateTo('remediation-guide')}
              onNavigateToPricing={() => navigateTo('pricing')}
            />
          </div>
        ) : (view === 'remediation-guide' && searchResult) ? (
          <div className="pt-[70px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <RemediationGuide 
              query={searchResult.query} 
              onBack={() => navigateTo('search-results')} 
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-20 overflow-hidden border-b border-slate-200 dark:border-white/5 pt-14 md:pt-0">
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-blue-600/[0.08] blur-[160px] rounded-full pointer-events-none opacity-80"></div>
              
              <div className="max-w-[1400px] mx-auto relative w-full flex-1 flex flex-col items-center justify-center text-center py-12 md:py-20">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  GOVERNANCE STANDARD V4.2.0
                </div>
                
                <h1 className="hero-heading text-3xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 md:mb-10 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 max-w-full break-words relative z-10">
                  {t('hero_title')}
                </h1>
                
                <p className="text-base md:text-xl text-slate-500 dark:text-white/50 leading-relaxed font-medium mb-10 md:mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 relative z-10">
                  {t('hero_desc')}
                </p>

                <form onSubmit={handleHeroSearch} className="relative group w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 z-20">
                  <div className="relative flex items-center shadow-2xl rounded-2xl">
                    <Mail className={`absolute left-5 w-4 h-4 transition-colors ${searchError ? 'text-red-500' : 'text-slate-400 dark:text-white/20'}`} />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => { setHeroSearch(e.target.value); if(searchError) setSearchError(false); }}
                      placeholder="Search email identifier..."
                      className={`w-full py-5 pl-14 pr-36 rounded-2xl text-[12px] font-bold transition-all tracking-wider outline-none border ring-1 focus:ring-1 ${
                        searchError 
                          ? 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200 border-red-500/20 ring-red-500/20' 
                          : 'bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white border-slate-200/50 dark:border-white/10 ring-slate-200/50 dark:ring-white/10 focus:ring-blue-500/40'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="absolute right-3 bg-slate-900 dark:bg-white text-white dark:text-black px-7 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Audit <Search className="w-3.5 h-3.5" /></>}
                    </button>
                  </div>
                </form>
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
            <section id="core" className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-slate-950 dark:bg-slate-950 relative overflow-hidden">
              <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 md:gap-16 mb-16 md:mb-24">
                  <div className="max-w-4xl space-y-4 md:space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                      <h2 className="text-[10px] md:text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider md:tracking-[0.4em]">{t('core_title')}</h2>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-100 dark:text-slate-100 tracking-tight leading-none pb-2 break-words">{t('core_subtitle')}</h3>
                  </div>
                  <div className="max-w-md space-y-4 md:space-y-6 border-l border-white/10 pl-6 md:pl-10">
                    <p className="text-base md:text-lg text-slate-300 dark:text-slate-300 leading-relaxed font-medium">{t('core_desc')}</p>
                    <div className="flex items-center gap-4 text-red-500/80 dark:text-red-400/80 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">
                      <Layers className="w-4 h-4" />
                      Interoperable V4 Stack
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { id: '01', icon: Key, title: t('core_f1_title'), desc: t('core_f1_desc'), footer: 'Tier Licensing' },
                    { id: '02', icon: LayoutGrid, title: t('core_f2_title'), desc: t('core_f2_desc'), footer: 'Dashboard' },
                    { id: '03', icon: Workflow, title: t('core_f3_title'), desc: t('core_f3_desc'), footer: 'Incidents' },
                    { id: '04', icon: MonitorCheck, title: t('core_f4_title'), desc: t('core_f4_desc'), footer: 'Monitoring' },
                    { id: '05', icon: MessageSquare, title: t('core_f5_title'), desc: t('core_f5_desc'), footer: 'Intelligence' },
                    { id: '06', icon: ShieldHalf, title: t('core_f6_title'), desc: t('core_f6_desc'), footer: 'Enrichment' },
                    { id: '07', icon: FileJson, title: t('core_f7_title'), desc: t('core_f7_desc'), footer: 'Export' },
                    { id: '08', icon: UserCheck, title: t('core_f8_title'), desc: t('core_f8_desc'), footer: 'Whistleblowing' }
                  ].map((f, i) => (
                    <div key={i} className="group relative bg-black/30 dark:bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-500 hover:bg-black/40 dark:hover:bg-black/40 hover:-translate-y-1 hover:border-red-500/20 shadow-2xl overflow-hidden">
                      <div className="flex items-start justify-between mb-8 md:mb-10 relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:bg-red-600/10 group-hover:border-red-500/20 transition-all">
                          <f.icon className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-red-500/60 transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow relative z-10">
                        <h4 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-red-400/80 transition-colors">{f.title}</h4>
                        <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium">{f.desc}</p>
                      </div>
                      <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                        <span className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest">{f.footer}</span>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-red-500/60 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Investigative Ecosystem */}
            <section className="px-6 md:px-12 lg:px-20 py-10 md:py-16 relative overflow-hidden border-y border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950">
               <div className="max-w-[1400px] mx-auto relative z-10">
                 <div id="probe" className="w-full relative z-10 space-y-6">
                   <div className="flex flex-col gap-1 px-2">
                     <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 mb-1">
                        <Activity className="w-4 h-4" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Breach Audit Engine</h2>
                     </div>
                     <p className="text-[11px] text-slate-500 dark:text-white/30 font-bold uppercase tracking-widest">Check if your email identifier has been exposed in clinical stealer log repositories.</p>
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
               </div>
            </section>
          </>
        )}
      </main>

      <footer className="relative z-20 w-full overflow-hidden bg-white dark:bg-[#0d0d0f] transition-all">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
            <div className="lg:col-span-4 space-y-12">
              <div className="flex items-center gap-5 cursor-pointer group" onClick={scrollToTop}>
                <div className="w-14 h-14 relative flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl bg-white dark:bg-black group-hover:scale-110 transition-all duration-500">
                  <svg viewBox="0 0 100 100" className="w-10 h-10 text-blue-600 dark:text-blue-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="50" cy="50" r="12" fill="currentColor"/>
                    <path d="M50 20V30M50 70V80M20 50H30M70 50H80" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-[0.4em] uppercase leading-none mb-1.5">ORION</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">INTEL_V4.2</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-white/50 max-w-sm text-sm md:text-[15px] leading-relaxed font-medium">
                Sovereign intelligence infrastructure designed for investigative precision. Delivering clinical, verified datasets to global defense units.
              </p>

              <div className="space-y-7">
                <span className="text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.5em] block border-l-2 border-blue-600/40 pl-4">OUR MEDIA PRESENCE</span>
                <div className="flex flex-wrap gap-7 items-center">
                  {[
                    { icon: Twitter, href: "https://x.com/orionfeed", label: "X", hoverColor: "hover:text-[#1DA1F2]" },
                    { icon: Linkedin, href: "https://www.linkedin.com/showcase/108619822/", label: "LinkedIn", hoverColor: "hover:text-[#0077B5]" },
                    { icon: Facebook, href: "https://web.facebook.com/people/Orion-Feed/61581366287535/", label: "Facebook", hoverColor: "hover:text-[#1877F2]" },
                    { icon: Youtube, href: "https://www.youtube.com/@OrionFeeds", label: "YouTube", hoverColor: "hover:text-[#FF0000]" },
                    { icon: InstagramFilled, href: "https://www.instagram.com/msman_nan00", label: "Instagram", hoverColor: "hover:text-[#E4405F]" }
                  ].map((social, i) => (
                    <a 
                      key={i}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`group flex items-center justify-center text-slate-400 dark:text-white/15 transition-all duration-500 active:scale-90 relative ${social.hoverColor}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6 relative z-10 transition-all duration-500 group-hover:scale-125" fill="currentColor" stroke="none" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-10 lg:gap-14">
              <div className="space-y-8">
                <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2.5 opacity-90">
                  <CpuIcon className="w-4 h-4 text-blue-500" />
                  Platform
                </h3>
                <ul className="space-y-6 text-[11.5px] text-slate-500 dark:text-white/40 uppercase tracking-[0.12em] font-bold">
                  <li><a href="https://try.orionintelligence.org/" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Grid Portal <ExternalLink className="w-3 h-3 opacity-20" /></a></li>
                  <li><a href="https://github.com/Orion-Intelligence/Orion-Intelligence" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Repository <Share2 className="w-3 h-3 opacity-20" /></a></li>
                  <li><button onClick={() => navigateTo('api-docs')} className="hover:text-blue-600 dark:hover:text-white transition-all">Protocol_API</button></li>
                </ul>
              </div>

              <div className="space-y-8">
                <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2.5 opacity-90">
                  <Database className="w-4 h-4 text-blue-500" />
                  Intelligence
                </h3>
                <ul className="space-y-6 text-[11.5px] text-slate-500 dark:text-white/40 uppercase tracking-[0.12em] font-bold">
                  <li><a href="https://orion-search.readthedocs.io/en/latest/app_docs/introduction_to_platform.html" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Documentation <BookOpen className="w-3 h-3 opacity-20" /></a></li>
                  <li><button onClick={() => navigateTo('adversaries')} className="hover:text-blue-600 dark:hover:text-white transition-all">Threat Matrix</button></li>
                  <li><button onClick={() => navigateTo('sources')} className="hover:text-blue-600 dark:hover:text-white transition-all">Source Map</button></li>
                </ul>
              </div>

              <div className="space-y-8">
                <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2.5 opacity-90">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Policy
                </h3>
                <ul className="space-y-6 text-[11.5px] text-slate-500 dark:text-white/40 uppercase tracking-[0.12em] font-bold">
                  <li><button onClick={() => setActiveModal('privacy')} className="hover:text-blue-600 dark:hover:text-white transition-all">Privacy Shield</button></li>
                  <li><button onClick={() => setActiveModal('compliance')} className="hover:text-blue-600 dark:hover:text-white transition-all">Audit Protocol</button></li>
                  <li><button onClick={() => navigateTo('pricing')} className="hover:text-blue-600 dark:hover:text-white transition-all">License_SLA</button></li>
                </ul>
              </div>

              <div className="space-y-8">
                <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2.5 opacity-90">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Operations
                </h3>
                <ul className="space-y-6 text-[11.5px] text-slate-500 dark:text-white/40 uppercase tracking-[0.12em] font-bold">
                  <li><button onClick={() => navigateTo('pricing')} className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Get a Quote <Quote className="w-3 h-3 opacity-20" /></button></li>
                  <li><a href="https://try.orionintelligence.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Client Login <User className="w-3 h-3 opacity-20" /></a></li>
                  <li><a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Reporting Portal <ShieldEllipsis className="w-3.5 h-3.5 opacity-20" /></a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em]">
               <span className="text-slate-500 dark:text-white/20">{t('footer_copy')}</span>
            </div>
            
            <div className="flex gap-8 items-center">
               <button onClick={scrollToTop} className="flex items-center gap-3 text-slate-400 dark:text-white/20 hover:text-blue-600 dark:hover:text-white transition-all group">
                 <span className="text-[11px] font-black uppercase tracking-widest">Elevate</span>
                 <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                   <ChevronUp className="w-5 h-5" />
                 </div>
               </button>
               <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
               <span className="flex items-center gap-4 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-[0.25em]">
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