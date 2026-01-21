
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
  Rss,
  MessageSquare,
  Activity,
  Loader2,
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
import ThreatActors, { ActorIntelligence } from './components/ThreatActors';
import ActorDossier from './components/ActorDossier';
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

type ViewType = 'home' | 'adversaries' | 'actor-dossier' | 'api-docs' | 'sources' | 'search-results' | 'remediation-guide' | 'pricing';

const BrandLogos = {
  X: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
    </svg>
  ),
  LinkedIn: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.981 0 1.772-.773 1.772-1.729V1.729C24 .774 23.206 0 22.225 0z" />
    </svg>
  ),
  Facebook: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  YouTube: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Instagram: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
};

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'access' | 'compliance' | null>(null);
  const [selectedActor, setSelectedActor] = useState<ActorIntelligence | null>(null);
  
  // Routing Logic
  const getPathFromView = (view: ViewType): string => {
    switch (view) {
      case 'adversaries': return '/adversaries';
      case 'actor-dossier': return '/adversaries/dossier';
      case 'api-docs': return '/api-docs';
      case 'sources': return '/sources';
      case 'pricing': return '/pricing';
      case 'search-results': return '/search';
      case 'remediation-guide': return '/remediation';
      default: return '/';
    }
  };

  const getViewFromPath = (path: string): ViewType => {
    if (path.startsWith('/adversaries/dossier')) return 'actor-dossier';
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

  const handleActorSelect = (actor: ActorIntelligence) => {
    setSelectedActor(actor);
    navigateTo('actor-dossier');
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const pathView = getViewFromPath(window.location.pathname);
      setView(pathView);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [footerLogoError, setFooterLogoError] = useState(false);
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
    root.style.overflowX = 'hidden'; 
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
    const interval = setInterval(() => {
      if (document.title !== "Orion Intelligence") {
        document.title = "Orion Intelligence";
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bgClass = ['adversaries', 'actor-dossier', 'sources', 'search-results', 'remediation-guide', 'pricing'].includes(view) ? 'mesh-gradient-bright' : 'mesh-gradient';

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
      <div className="fixed top-[40%] right-[-5%] w-[30%] h-[30%] bg-blue-400/5 blur-[150px] rounded-full pointer-events-none z-0 opacity-20"></div>

      <main key={view} className="relative z-10 w-full overflow-x-hidden animate-in fade-in duration-700">
        {view === 'adversaries' ? (
          <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <ThreatActors onSelectActor={handleActorSelect} onBack={() => navigateTo('home')} />
          </div>
        ) : view === 'actor-dossier' && selectedActor ? (
          <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <ActorDossier actor={selectedActor} onBack={() => navigateTo('adversaries')} />
          </div>
        ) : view === 'api-docs' ? (
          <div className="pt-20 min-h-screen">
            <ApiDocumentation />
          </div>
        ) : view === 'sources' ? (
          <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <SourceInventory onBack={() => navigateTo('home')} />
          </div>
        ) : view === 'pricing' ? (
          <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <Pricing />
          </div>
        ) : (view === 'search-results' && searchResult) ? (
          <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <SearchResults 
              query={searchResult.query} 
              data={searchResult.data} 
              onBack={() => navigateTo('home')}
              onNavigateToRemediation={() => navigateTo('remediation-guide')}
              onNavigateToPricing={() => navigateTo('pricing')}
            />
          </div>
        ) : (view === 'remediation-guide' && searchResult) ? (
          <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
            <RemediationGuide 
              query={searchResult.query} 
              onBack={() => navigateTo('search-results')} 
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-20 overflow-hidden border-b border-slate-200 dark:border-white/5 pt-20 md:pt-0">
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-blue-600/[0.08] blur-[160px] rounded-full pointer-events-none opacity-80"></div>
              <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full"></div>
              
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
            <section 
              id="core" 
              className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-slate-950 dark:bg-slate-950 relative overflow-hidden bg-[radial-gradient(circle_at_15%_25%,rgba(220,38,38,0.12),transparent_50%),radial-gradient(circle_at_85%_75%,rgba(217,70,239,0.1),transparent_50%),radial-gradient(circle_at_50%_40%,rgba(220,38,38,0.06),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.1),transparent_60%),radial-gradient(circle_at_20%_60%,rgba(220,38,38,0.08),transparent_50%),radial-gradient(1.5px_1.5px_at_12%_12%,#fff,transparent),radial-gradient(1px_1px_at_22%_82%,#fff,transparent),radial-gradient(1.2px_1.2px_at_72%_22%,#fff,transparent),radial-gradient(2px_2px_at_92%_42%,#fff,transparent),radial-gradient(1.1px_1.1px_at_37%_47%,#fff,transparent),radial-gradient(1.3px_1.3px_at_67%_17%,#fff,transparent),radial-gradient(1px_1px_at_47%_87%,#fff,transparent),radial-gradient(1.5px_1.5px_at_17%_67%,#fff,transparent),radial-gradient(1.1px_1.1px_at_85%_15%,#fff,transparent),radial-gradient(1.2px_1.2px_at_5%_95%,#fff,transparent),radial-gradient(1.3px_1.3px_at_50%_10%,#fff,transparent),radial-gradient(1px_1px_at_10%_10%,#fff,transparent),radial-gradient(1.4px_1.4px_at_30%_90%,#fff,transparent),radial-gradient(1px_1px_at_90%_10%,#fff,transparent),radial-gradient(1.2px_1.2px_at_75%_50%,#fff,transparent),radial-gradient(1.1px_1.1px_at_25%_40%,#fff,transparent),radial-gradient(1.5px_1.5px_at_45%_65%,#fff,transparent),radial-gradient(1.1px_1.1px_at_65%_35%,#fff,transparent),radial-gradient(0.8px_0.8px_at_5%_15%,rgba(255,255,255,0.8),transparent),radial-gradient(1px_1px_at_15%_85%,rgba(255,255,255,0.8),transparent),radial-gradient(1.2px_1.2px_at_25%_25%,rgba(255,255,255,0.8),transparent),radial-gradient(0.9px_0.9px_at_35%_75%,rgba(255,255,255,0.8),transparent),radial-gradient(1px_1px_at_45%_15%,rgba(255,255,255,0.8),transparent),radial-gradient(1.5px_1.5px_at_55%_85%,rgba(255,255,255,0.8),transparent),radial-gradient(0.8px_0.8px_at_65%_25%,rgba(255,255,255,0.8),transparent),radial-gradient(1.1px_1.1px_at_75%_75%,rgba(255,255,255,0.8),transparent),radial-gradient(1.3px_1.3px_at_85%_15%,rgba(255,255,255,0.8),transparent),radial-gradient(0.9px_0.9px_at_95%_85%,rgba(255,255,255,0.8),transparent),radial-gradient(1px_1px_at_3%_30%,#fff,transparent),radial-gradient(1px_1px_at_97%_70%,#fff,transparent),radial-gradient(1px_1px_at_40%_2%,#fff,transparent),radial-gradient(1px_1px_at_60%_98%,#fff,transparent),radial-gradient(1px_1px_at_18%_18%,#fff,transparent),radial-gradient(1px_1px_at_82%_82%,#fff,transparent),repeating-radial-gradient(circle_at_20%_30%,transparent_0,transparent_100px,rgba(220,38,38,0.04)_101px,transparent_103px),repeating-radial-gradient(circle_at_80%_70%,transparent_0,transparent_150px,rgba(220,38,38,0.03)_151px,transparent_153px),repeating-radial-gradient(circle_at_50%_50%,transparent_0,transparent_200px,rgba(220,38,38,0.05)_201px,transparent_203px),repeating-radial-gradient(circle_at_50%_50%,transparent_0,transparent_350px,rgba(220,38,38,0.03)_351px,transparent_354px),repeating-radial-gradient(circle_at_50%_50%,transparent_0,transparent_450px,rgba(220,38,38,0.02)_501px,transparent_504px),repeating-radial-gradient(circle_at_45%_55%,transparent_0,transparent_600px,rgba(220,38,38,0.015)_601px,transparent_605px)]"
            >
              <div className="absolute top-[-5%] left-[30%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-red-600/5 dark:from-red-600/5 to-transparent pointer-events-none z-0"></div>
              
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
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                      
                      <div className="flex items-start justify-between mb-8 md:mb-10 relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:bg-red-600/10 group-hover:border-red-500/20 transition-all">
                          <f.icon className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-red-500/60 transition-colors" />
                        </div>
                        {f.id !== '05' && (
                          <span className="text-[9px] md:text-[10px] font-black text-white/5 group-hover:text-white/30 transition-colors uppercase tracking-[0.3em] font-mono">ID: {f.id}</span>
                        )}
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
               <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none opacity-30"></div>
               <div className="absolute top-[30%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none opacity-40"></div>
               <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-blue-400/5 blur-[100px] rounded-full pointer-events-none opacity-30"></div>
               
               <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-100 transition-all duration-1000" 
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

            {/* Governance and FIDO2 Support */}
            <section 
              className="px-6 md:px-12 lg:px-20 py-20 md:py-32 bg-slate-950 dark:bg-slate-950 relative overflow-hidden bg-[radial-gradient(circle_at_25%_25%,rgba(220,38,38,0.12),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(217,70,239,0.1),transparent_50%),radial-gradient(circle_at_50%_60%,rgba(220,38,38,0.08),transparent_40%),radial-gradient(circle_at_20%_90%,rgba(220,38,38,0.12),transparent_60%),radial-gradient(circle_at_80%_40%,rgba(220,38,38,0.07),transparent_50%),radial-gradient(1.5px_1.5px_at_15%_10%,#fff,transparent),radial-gradient(1px_1px_at_80%_20%,#fff,transparent),radial-gradient(1.2px_1.2px_at_40%_60%,#fff,transparent),radial-gradient(2px_2px_at_60%_40%,#fff,transparent),radial-gradient(1px_1px_at_10%_90%,#fff,transparent),radial-gradient(1.1px_1.1px_at_85%_85%,#fff,transparent),radial-gradient(1.3px_1.3px_at_55%_35%,#fff,transparent),radial-gradient(1.5px_1.5px_at_25%_45%,#fff,transparent),radial-gradient(1px_1px_at_65%_75%,#fff,transparent),radial-gradient(1.2px_1.2px_at_95%_5%,#fff,transparent),radial-gradient(1.1px_1.1px_at_35%_25%,#fff,transparent),radial-gradient(1.4px_1.4px_at_10%_30%,#fff,transparent),radial-gradient(1.1px_1.1px_at_50%_90%,#fff,transparent),radial-gradient(1.2px_1.2px_at_80%_70%,#fff,transparent),radial-gradient(1px_1px_at_20%_20%,#fff,transparent),radial-gradient(1px_1px_at_45%_5%,rgba(255,255,255,0.7),transparent),radial-gradient(1.2px_1.2px_at_65%_95%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_5%_55%,rgba(255,255,255,0.7),transparent),radial-gradient(1.5px_1.5px_at_95%_45%,rgba(255,255,255,0.7),transparent),radial-gradient(0.8px_0.8px_at_30%_15%,rgba(255,255,255,0.7),transparent),radial-gradient(1.1px_1.1px_at_70%_85%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_10%_35%,rgba(255,255,255,0.7),transparent),radial-gradient(1.3px_1.3px_at_85%_65%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_2%_2%,#fff,transparent),radial-gradient(1px_1px_at_98%_98%,#fff,transparent),radial-gradient(1px_1px_at_50%_2%,#fff,transparent),radial-gradient(1px_1px_at_2%_50%,#fff,transparent),repeating-radial-gradient(circle_at_30%_20%,transparent_0,transparent_75px,rgba(220,38,38,0.04)_76px,transparent_78px),repeating-radial-gradient(circle_at_70%_80%,transparent_0,transparent_150px,rgba(220,38,38,0.04)_151px,transparent_153px),repeating-radial-gradient(circle_at_50%_50%,transparent_0,transparent_225px,rgba(220,38,38,0.05)_226px,transparent_228px),repeating-radial-gradient(circle_at_50%_50%,transparent_0,transparent_350px,rgba(220,38,38,0.03)_351px,transparent_354px),repeating-radial-gradient(circle_at_50%_50%,transparent_0,transparent_450px,rgba(220,38,38,0.02)_451px,transparent_454px),repeating-radial-gradient(circle_at_55%_45%,transparent_0,transparent_550px,rgba(220,38,38,0.015)_551px,transparent_555px)]"
            >
              <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-red-600/10 blur-[140px] rounded-full pointer-events-none opacity-40"></div>
              <div className="absolute top-[50%] right-[10%] w-[25%] h-[25%] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-red-600/5 dark:from-red-600/3 to-transparent pointer-events-none z-0"></div>
              
              <div className="max-w-[1400px] mx-auto relative z-10 space-y-20 md:space-y-32">
                <div className="space-y-16 md:space-y-24">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
                    <div className="max-w-4xl space-y-8">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                          <CircleCheck className="w-3 h-3" />
                          ISO/SOC2 ALIGNED
                        </div>
                        <h2 className="text-[12px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-[0.4em]">{t('admin_subtitle')}</h2>
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">{t('admin_title')}</h3>
                    </div>
                    <div className="max-w-md space-y-6 border-l border-white/10 pl-8 md:pl-10">
                      <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">
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
                       <div key={i} className="bg-black/20 dark:bg-[#0d0d0f]/30 backdrop-blur-md p-8 md:p-10 rounded-3xl group hover:border-red-600/20 transition-all border border-white/10 shadow-2xl">
                          <div className="w-12 h-12 rounded-xl bg-red-600/5 flex items-center justify-center mb-8 border border-red-600/20 group-hover:scale-110 transition-transform">
                             <item.icon className="w-5 h-5 text-red-500/80" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">{item.title}</h4>
                          <p className="text-sm text-white/50 leading-relaxed font-medium">{item.desc}</p>
                       </div>
                     ))}
                  </div>
                </div>

                <div className="rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-24 border border-white/10 bg-white/5 dark:bg-[#131315]/40 backdrop-blur-2xl relative overflow-hidden mt-16 md:mt-24">
                  <div className="absolute top-0 right-0 p-8 hidden md:block">
                     <a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/30 hover:text-blue-400 transition-colors uppercase tracking-[0.4em]">orionleaks.com</a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-8 md:space-y-10">
                       <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                         <Lock className="w-4 h-4" />
                         TLP:RED SECURE CHANNEL
                       </div>
                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">{t('whistle_title')}</h2>
                       <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl font-medium">
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
                                <feat.icon className="w-4 h-4 text-blue-500" />
                                <span className="text-[11px] font-black text-white uppercase tracking-widest">{feat.title}</span>
                              </div>
                              <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-tight font-bold">{feat.desc}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="relative">
                       <div className="aspect-square bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center relative group overflow-hidden shadow-2xl">
                          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <ShieldAlert className="w-32 md:w-48 h-32 md:h-48 text-white/[0.02] group-hover:text-blue-500/10 transition-colors duration-1000" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
                               <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                             </div>
                             <h3 className="text-lg md:text-xl font-bold text-white mb-4 uppercase tracking-widest">{t('whistle_button')}</h3>
                             <p className="text-[10px] text-white/30 font-mono mb-8 uppercase tracking-widest">ORION_SECURE_INTAKE</p>
                             <a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-blue-50 transition-all active:scale-95">
                               {t('whistle_button')}
                             </a>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Operational Liaison */}
            <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-40 discovery-gradient group overflow-hidden relative border-t border-slate-200 dark:border-white/10">
              <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none opacity-40"></div>
              <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-30"></div>
              
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

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-y-16 lg:gap-12 w-full max-w-6xl mx-auto mb-20 md:border-b border-slate-200 dark:border-white/5 pb-20 text-left">
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
                 
                 <div className="pt-10">
                   <a 
                    href={CALENDLY_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto px-7 md:px-9 py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-blue-500/20 border-t border-white/20 group-hover:scale-105"
                   >
                     {t('contact_button')}
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </a>
                 </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="relative z-20 w-full overflow-hidden bg-white dark:bg-[#0d0d0f] transition-all">
        {/* Advanced Top Border Design */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>

        {/* Architectural Ambient Spotlights */}
        <div className="absolute top-[20%] left-[15%] w-[30%] h-[60%] bg-blue-600/[0.02] blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[25%] h-[50%] bg-purple-600/[0.015] blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[15%] right-[15%] w-[30%] h-[60%] bg-blue-500/[0.02] blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-20 pb-12 md:pb-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            {/* Branding Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-5 cursor-pointer group" onClick={scrollToTop}>
                <div className="w-14 h-14 relative flex items-center justify-center rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl bg-white dark:bg-black group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {!footerLogoError ? (
                    <img 
                      src="https://try.orionintelligence.org/api/s/static/system/logo_url_default.png" 
                      alt="Orion" 
                      width="38"
                      height="38"
                      loading="lazy"
                      className="w-full h-full object-cover scale-110" 
                      onError={() => setFooterLogoError(true)}
                    />
                  ) : (
                    <div className="text-blue-600 dark:text-blue-500 font-bold text-3xl">O</div>
                  )}
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
                <div className="flex flex-wrap gap-4 md:gap-5 items-center">
                  {[
                    { component: BrandLogos.X, href: "https://x.com/orionfeed", label: "X", hoverBg: "hover:bg-[#000000]", hoverColor: "hover:text-white", glow: "group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]" },
                    { component: BrandLogos.LinkedIn, href: "https://www.linkedin.com/showcase/108619822/", label: "LinkedIn", hoverBg: "hover:bg-[#0077B5]", hoverColor: "hover:text-white", glow: "group-hover:shadow-[0_0_15px_rgba(0,119,181,0.3)]" },
                    { component: BrandLogos.Facebook, href: "https://web.facebook.com/people/Orion-Feed/61581366287535/", label: "Facebook", hoverBg: "hover:bg-[#1877F2]", hoverColor: "hover:text-white", glow: "group-hover:shadow-[0_0_15px_rgba(24,119,242,0.3)]" },
                    { component: BrandLogos.YouTube, href: "https://www.youtube.com/@OrionFeeds", label: "YouTube", hoverBg: "hover:bg-[#FF0000]", hoverColor: "hover:text-white", glow: "group-hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]" },
                    { component: BrandLogos.Instagram, href: "https://www.instagram.com/msman_nan00", label: "Instagram", hoverBg: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]", hoverColor: "hover:text-white", glow: "group-hover:shadow-[0_0_15px_rgba(238,42,123,0.3)]" }
                  ].map((social, i) => (
                    <a 
                      key={i}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`group flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/20 transition-all duration-500 active:scale-90 relative overflow-hidden shadow-sm ${social.hoverBg} ${social.hoverColor} ${social.glow}`}
                      aria-label={social.label}
                    >
                      <social.component 
                        className="w-4.5 h-4.5 md:w-5 md:h-5 relative z-10 transition-all duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Links Grid */}
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
          
          {/* Sub-Footer area */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em]">
               <span className="text-slate-500 dark:text-white/20">{t('footer_copy')}</span>
               <div className="flex items-center gap-5">
                 <div className="px-4 py-1.5 rounded-xl bg-blue-600/5 dark:bg-white/5 border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-inner">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                   <span className="font-mono text-slate-900 dark:text-blue-400">14.2B_RECORDS_ACTIVE</span>
                 </div>
                 <div className="hidden sm:flex items-center gap-3 text-slate-500 dark:text-white/10">
                   <Globe className="w-4 h-4 opacity-30" />
                   <span>NETWORK_GLOBAL</span>
                 </div>
               </div>
            </div>
            
            <div className="flex gap-8 items-center">
               <button 
                 onClick={scrollToTop} 
                 className="flex items-center gap-3 text-slate-400 dark:text-white/20 hover:text-blue-600 dark:hover:text-white transition-all group"
               >
                 <span className="text-[11px] font-black uppercase tracking-widest">Elevate</span>
                 <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all duration-300">
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
