

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
import HomepageFlow from './components/HomepageFlow';
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
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
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

type ViewType = 'home' | 'adversaries' | 'actor-dossier' | 'api-docs' | 'sources' | 'search-results' | 'remediation-guide' | 'pricing' | 'collaboration' | '404';

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
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6273 3.568z" />
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
  const getEnvironmentBasePath = (): string => {
    try {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const isProxyUUID = (s: string) =>
        (s.length === 36 && s.includes('-')) ||
        (s.length > 30 && /^[0-9a-f-]+$/.test(s));

      return parts.length > 0 && isProxyUUID(parts[0]) ? `/${parts[0]}` : '';
    } catch {
      return '';
    }
  };
  
  const getSegmentFromView = (view: ViewType): string => {
    switch (view) {
      case 'adversaries': return 'adversaries';
      case 'actor-dossier': return 'adversaries/dossier';
      case 'api-docs': return 'api-docs';
      case 'sources': return 'sources';
      case 'pricing': return 'pricing';
      case 'collaboration': return 'collaboration';
      case 'search-results': return 'search';
      case 'remediation-guide': return 'remediation';
      case 'home': return '';
      default: return '';
    }
  };

  /**
   * REFACTORED: Keyword-First Inclusion Strategy
   * This is much more resilient for proxy environments because it defaults to 'home'
   * if no specific clinical keywords are found in the URL.
   */
  const getViewFromPath = (pathOrUrl: string): ViewType => {
    let pathname = '/';
    try {
      const u = new URL(pathOrUrl, window.location.origin);
      pathname = u.pathname || '/';
    } catch {
      pathname = pathOrUrl || '/';
    }

    const parts = pathname.toLowerCase().split('/').filter(Boolean);

    const isProxyUUID = (s: string) =>
      (s.length === 36 && s.includes('-')) ||
      (s.length > 30 && /^[0-9a-f-]+$/.test(s));

    const effectiveParts = parts.length > 0 && isProxyUUID(parts[0]) ? parts.slice(1) : parts;
    const effectivePath = '/' + effectiveParts.join('/');

    if (effectiveParts.length === 0) return 'home';
    if (effectivePath.startsWith('/adversaries/dossier')) return 'actor-dossier';
    if (effectivePath.startsWith('/adversaries')) return 'adversaries';
    if (effectivePath.startsWith('/api-docs')) return 'api-docs';
    if (effectivePath.startsWith('/sources')) return 'sources';
    if (effectivePath.startsWith('/pricing')) return 'pricing';
    if (effectivePath.startsWith('/collaboration')) return 'collaboration';
    if (effectivePath.startsWith('/search')) return 'search-results';
    if (effectivePath.startsWith('/remediation')) return 'remediation-guide';

    return '404';
  };

  // State initialization
  const [view, setView] = useState<ViewType>(() => getViewFromPath(window.location.href));

  const navigateTo = useCallback((newView: ViewType) => {
    if (newView === 'collaboration') {
      window.open(`${getEnvironmentBasePath()}/collaboration.html`, '_blank', 'noopener,noreferrer');
      return;
    }

    setView(newView);
    const targetSegment = getSegmentFromView(newView);
    
    try {
      const base = `${getEnvironmentBasePath()}/`;
      
      // Construct the absolute path relative to the environment root
      const fullTargetPath = targetSegment === '' ? base : `${base}${targetSegment}`;
      
      window.history.pushState({ view: newView }, '', fullTargetPath);
    } catch (e) {
      console.warn('History synchronization deferred.', e);
    }
  }, []);

  const handleActorSelect = (actor: ActorIntelligence) => {
    setSelectedActor(actor);
    navigateTo('actor-dossier');
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathView = getViewFromPath(window.location.href);
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
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bgClass = ['adversaries', 'actor-dossier', 'sources', 'search-results', 'remediation-guide', 'pricing', 'collaboration'].includes(view) ? 'mesh-gradient-bright' : 'mesh-gradient';

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${bgClass} selection:bg-blue-500/30 overflow-x-hidden transition-all duration-700`}>
        <div className="grain"></div>
        {view !== '404' && <Navbar onNavigate={navigateTo} currentView={view as any} theme={theme} onToggleTheme={toggleTheme} />}
        
        <LegalModals 
          isOpen={!!activeModal} 
          onClose={() => setActiveModal(null)} 
          type={activeModal || 'privacy'} 
        />

        {view === 'api-docs' && (
          <div className="fixed top-[-5%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[180px] rounded-full pointer-events-none z-0 opacity-40"></div>
        )}

        <main key={view} className="relative z-10 w-full overflow-x-hidden animate-in fade-in duration-700">
          {view === '404' ? (
            <NotFound onBack={() => navigateTo('home')} />
          ) : view === 'adversaries' ? (
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
          ) : view === 'collaboration' ? (
            <div className="pt-[90px] px-4 md:px-10 max-w-[1700px] mx-auto min-h-screen">
              <div className="h-[calc(100vh-120px)] min-h-[780px] overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-black/20 shadow-2xl backdrop-blur-xl">
                <iframe
                  src={`${getEnvironmentBasePath()}/collaboration.html`}
                  title="Orion Collaboration Deck"
                  className="h-full w-full border-0 bg-white"
                  loading="lazy"
                />
              </div>
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
            <HomepageFlow
              t={t}
              heroSearch={heroSearch}
              setHeroSearch={setHeroSearch}
              searchError={searchError}
              setSearchError={setSearchError}
              isSearching={isSearching}
              onHeroSearch={handleHeroSearch}
              onNavigate={navigateTo}
              calendlyUrl={CALENDLY_URL}
            />
          )}
        </main>

        {view !== '404' && (
          <footer className="relative z-20 w-full overflow-hidden home-footer-bg transition-all">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-20 pb-12 md:pb-16 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
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
                    Orion helps teams find exposed data, track threat activity, and turn evidence into action.
                  </p>

                  <div className="flex items-center gap-2.5 pt-1" aria-label="Social links">
                    <span className="h-px w-8 bg-slate-200 dark:bg-white/10"></span>
                    {[
                      { component: BrandLogos.X, href: "https://x.com/orionfeed", label: "X" },
                      { component: BrandLogos.LinkedIn, href: "https://www.linkedin.com/showcase/108619822/", label: "LinkedIn" },
                      { component: BrandLogos.Facebook, href: "https://web.facebook.com/people/Orion-Feed/61581366287535/", label: "Facebook" },
                      { component: BrandLogos.YouTube, href: "https://www.youtube.com/@OrionFeeds", label: "YouTube" },
                      { component: BrandLogos.Instagram, href: "https://www.instagram.com/msman_nan00", label: "Instagram" }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social -m-1 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 dark:text-white/24 transition-all duration-300 hover:bg-slate-100/80 hover:text-blue-600 dark:hover:bg-white/[0.045] dark:hover:text-white"
                        aria-label={social.label}
                      >
                        <social.component className="w-3.5 h-3.5 transition-transform duration-300 group-hover/social:scale-105" />
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-10 lg:gap-14">
                  <div className="space-y-8">
                    <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2.5 opacity-90">
                      <CpuIcon className="w-4 h-4 text-blue-500" />
                      Platform
                    </h3>
                    <ul className="space-y-6 text-[11.5px] text-slate-500 dark:text-white/40 uppercase tracking-[0.12em] font-bold">
                      <li><a href="https://try.orionintelligence.org/" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">Open Platform <ExternalLink className="w-3 h-3 opacity-20" /></a></li>
                      <li><a href="https://github.com/Orion-Intelligence/Orion-Intelligence" className="hover:text-blue-600 dark:hover:text-white transition-all flex items-center gap-2">GitHub <Share2 className="w-3 h-3 opacity-20" /></a></li>
                      <li><button onClick={() => navigateTo('api-docs')} className="hover:text-blue-600 dark:hover:text-white transition-all">API Docs</button></li>
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
                      <li><button onClick={() => setActiveModal('privacy')} className="hover:text-blue-600 dark:hover:text-white transition-all">Privacy</button></li>
                      <li><button onClick={() => setActiveModal('compliance')} className="hover:text-blue-600 dark:hover:text-white transition-all">Compliance</button></li>
                      <li><button onClick={() => navigateTo('pricing')} className="hover:text-blue-600 dark:hover:text-white transition-all">Pricing</button></li>
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
              
              <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em]">
                   <span className="text-slate-500 dark:text-white/20">{t('footer_copy')}</span>
                   <div className="flex items-center gap-5">
                     <div className="px-4 py-1.5 rounded-xl bg-blue-600/5 dark:bg-white/5 border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-inner">
                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                       <span className="font-mono text-slate-900 dark:text-blue-400">14.2B_RECORDS_ACTIVE</span>
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
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
