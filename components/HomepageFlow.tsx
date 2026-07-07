import React from 'react';
import {
  Anchor,
  ArrowRight,
  Database,
  FileJson,
  Fingerprint,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  MonitorCheck,
  Phone,
  Search,
  ShieldAlert,
  ShieldHalf,
  UserCheck,
  Workflow
} from 'lucide-react';
import { translations } from '../translations';

type HomeView = 'home' | 'adversaries' | 'actor-dossier' | 'api-docs' | 'sources' | 'search-results' | 'remediation-guide' | 'pricing' | 'collaboration' | '404';
type TranslationKey = keyof typeof translations['en'];

interface HomepageFlowProps {
  t: (key: TranslationKey) => string;
  heroSearch: string;
  setHeroSearch: React.Dispatch<React.SetStateAction<string>>;
  searchError: boolean;
  setSearchError: React.Dispatch<React.SetStateAction<boolean>>;
  isSearching: boolean;
  onHeroSearch: (e: React.FormEvent) => void;
  onNavigate: (view: HomeView) => void;
  calendlyUrl: string;
}

const sourceSignals = [
  'Leaked data',
  'Ransomware sites',
  'Telegram posts',
  'Forum posts',
  'Exploit chatter',
  'Exposed accounts'
];

const workflow = [
  {
    id: '01',
    title: 'Gather threat signals.',
    body: 'Orion brings leak posts, ransomware activity, exploit records, forum posts, and exposed accounts into one searchable place.',
    icon: Database,
    meta: ['leak posts', 'forum posts', 'exploit records', 'exposed accounts']
  },
  {
    id: '02',
    title: 'Connect related evidence.',
    body: 'Analysts can follow source history, channel context, related domains, actor profiles, and observables without switching tools.',
    icon: Workflow,
    meta: ['source history', 'actor profiles', 'case timeline', 'related domains']
  },
  {
    id: '03',
    title: 'Create clear next steps.',
    body: 'Search results can become remediation guidance, evidence bundles, assignments, and STIX 2.1 exports for SIEM, SOAR, and partner workflows.',
    icon: FileJson,
    meta: ['STIX 2.1', 'remediation', 'case sharing', 'API']
  },
  {
    id: '04',
    title: 'Keep work accountable.',
    body: 'Roles, case controls, secure intake, and activity logs help teams coordinate work without losing accountability.',
    icon: Fingerprint,
    meta: ['roles', 'audit logs', 'secure intake', 'case controls']
  }
];

const capabilityRows = [
  { icon: ShieldHalf, title: 'Track ransomware activity', desc: 'See actor pages, victim claims, leak-site details, impact notes, and status changes.' },
  { icon: MessageSquare, title: 'Monitor forums and channels', desc: 'Review posts, channels, profiles, translations, archived threads, and source confidence.' },
  { icon: MonitorCheck, title: 'Understand exposed assets', desc: 'Connect domains, services, certificates, ports, vulnerabilities, and forgotten infrastructure.' },
  { icon: UserCheck, title: 'Manage investigations', desc: 'Assign work, collect artifacts, share cases, build timelines, and track remediation.' }
];

const contextLayers = [
  { label: 'Resolved identities', detail: 'aliases, domains, services, accounts' },
  { label: 'Source history', detail: 'origin, freshness, confidence, past activity' },
  { label: 'Actor profiles', detail: 'known names, relationships, campaign notes' },
  { label: 'Case timeline', detail: 'evidence, notes, owners, decisions' },
  { label: 'Recommended actions', detail: 'priority, exposure path, next step' },
  { label: 'Exports and API', detail: 'reports, STIX 2.1, partner systems' }
];

const investigationActions = [
  { icon: Search, label: 'Search', detail: 'Start with an email, domain, actor, source, or exposed service.' },
  { icon: Workflow, label: 'Link evidence', detail: 'Connect source details with actors, infrastructure, victims, and confidence.' },
  { icon: UserCheck, label: 'Build case', detail: 'Create a case with actor profiles, timelines, notes, and evidence.' },
  { icon: MonitorCheck, label: 'Remediate', detail: 'Prioritize what needs attention and assign it to the right team.' },
  { icon: FileJson, label: 'Export STIX 2.1', detail: 'Share structured intelligence with SIEM, SOAR, and partner systems.' }
];

const HomepageFlow: React.FC<HomepageFlowProps> = ({
  t,
  heroSearch,
  setHeroSearch,
  searchError,
  setSearchError,
  isSearching,
  onHeroSearch,
  onNavigate,
  calendlyUrl
}) => {
  return (
    <div className="home-story-bg">
      <section className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-20 overflow-hidden pt-20 md:pt-0">
        <div className="max-w-[1400px] mx-auto relative w-full flex-1 flex flex-col items-center justify-center text-center py-12 md:py-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/[0.035] border border-slate-200/80 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            ORION INTELLIGENCE PLATFORM
          </div>

          <h1 className="hero-heading whitespace-nowrap [font-size:clamp(0.9rem,4.2vw,4.5rem)] font-extrabold text-slate-900 dark:text-white mb-6 md:mb-10 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 max-w-full relative z-10">
            {t('hero_title')}
          </h1>

          <p className="text-base md:text-xl text-slate-500 dark:text-white/50 leading-relaxed font-medium mb-10 md:mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 relative z-10">
            {t('hero_desc')}
          </p>

          <form onSubmit={onHeroSearch} className="relative group w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 z-20">
            <div className="relative flex items-center shadow-2xl rounded-full">
              <Mail className={`absolute left-5 w-[18px] h-[18px] transition-colors ${searchError ? 'text-red-500' : 'text-blue-500/60 dark:text-blue-300/40'}`} />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => {
                  setHeroSearch(e.target.value);
                  if (searchError) setSearchError(false);
                }}
                placeholder="Search email identifier..."
                className={`w-full py-5 pl-14 pr-28 sm:pr-36 rounded-full text-[13px] font-bold transition-all tracking-wider outline-none border ring-1 focus:ring-1 ${
                  searchError
                    ? 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200 border-red-500/20 ring-red-500/20'
                    : 'bg-blue-50/70 dark:bg-blue-950/[0.12] text-slate-900 dark:text-white border-blue-200/70 dark:border-blue-400/10 ring-blue-100/70 dark:ring-blue-400/10 focus:ring-blue-500/40'
                }`}
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-3 bg-slate-900 dark:bg-white text-white dark:text-black px-5 sm:px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Audit <Search className="w-3.5 h-3.5" /></>}
              </button>
            </div>
            {searchError && (
              <div className="mt-4 flex justify-end pr-2">
                <div className="flex items-center gap-2 text-red-500 animate-in fade-in slide-in-from-top-1">
                  <span className="text-[10px] font-black uppercase tracking-widest">Please enter a valid email address.</span>
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="max-w-[1400px] mx-auto w-full pb-12 flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8 font-mono border-t border-slate-200/80 dark:border-white/5 pt-10 animate-in fade-in duration-1000 delay-500">
          {[
            { label: t('stats_records'), val: '14.2B+', color: 'text-blue-600 dark:text-blue-500' },
            { label: t('stats_groups'), val: '240+', color: 'text-slate-900 dark:text-white' },
            { label: t('stats_throughput'), val: '1.4TB', color: 'text-slate-900 dark:text-white' },
            { label: t('stats_uptime'), val: '99.98%', color: 'text-green-600 dark:text-green-500' }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 text-center md:text-left min-w-[120px]">
              <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              <span className={`text-lg md:text-xl font-black tracking-tight ${stat.color}`}>{stat.val}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
        <div className="max-w-[1420px] mx-auto">
          <div className="home-flow-divider"></div>

          <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-20 items-start py-14 md:py-20">
            <aside className="lg:sticky lg:top-28 space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mb-5">Orion investigation flow</p>
                <h2 className="whitespace-nowrap text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-none mb-6">
                  Raw signal to action.
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/52 font-medium">
                  Orion helps teams collect threat data, connect related evidence, create cases, and share results in formats security tools can use.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => onNavigate('sources')} className="px-4 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:opacity-90 transition-all">
                  Source Map <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onNavigate('adversaries')} className="px-4 py-3 rounded-lg bg-white/[0.14] dark:bg-transparent border border-slate-200/45 dark:border-white/[0.055] text-slate-700 dark:text-white/58 text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:border-blue-500/30 transition-all">
                  Threat Matrix <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>

            <div className="space-y-8 md:space-y-10">
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.07] bg-white/45 dark:bg-white/[0.024] overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between gap-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400 dark:text-white/30 mb-5">Source coverage</p>
                      <h3 className="whitespace-nowrap text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-5">One searchable threat.</h3>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-white/52 font-medium">
                        Orion gathers leak posts, ransomware activity, forum chatter, exploit records, and exposed accounts so analysts can search across them from one workspace.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {sourceSignals.map((signal) => (
                        <span key={signal} className="px-2.5 py-1.5 rounded-md bg-white/[0.12] dark:bg-transparent border border-slate-200/40 dark:border-white/[0.045] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-white/34">
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="min-h-[320px] bg-white dark:bg-slate-950 relative overflow-hidden p-6 md:p-8 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-0">
                    <div className="absolute inset-0 opacity-28" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    <div className="relative h-full rounded-xl bg-slate-50/80 dark:bg-black/20 p-5 flex flex-col justify-between border border-slate-200/70 dark:border-0 shadow-sm dark:shadow-none">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-5 text-slate-900 dark:text-white">
                          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-white/45">source coverage</span>
                          <span className="text-[10px] font-mono text-emerald-400">live</span>
                        </div>
                        {[
                          ['Telegram', '18.4k records', '78%'],
                          ['Forums', '8.9k threads', '62%'],
                          ['Ransomware', '240+ groups', '91%'],
                          ['Stealer logs', '14.2B records', '83%']
                        ].map(([label, detail, width]) => (
                          <div key={label} className="space-y-2">
                            <div className="flex items-center justify-between gap-4 text-[11px] font-bold text-slate-700 dark:text-white/70">
                              <span>{label}</span>
                              <span className="font-mono text-slate-400 dark:text-white/35">{detail}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-3 text-center text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-white/46">
                        <span className="border-t border-slate-200 dark:border-white/[0.08] px-2 py-2">Pull</span>
                        <span className="border-t border-slate-200 dark:border-white/[0.08] px-2 py-2">Clean</span>
                        <span className="border-t border-slate-200 dark:border-white/[0.08] px-2 py-2">Search</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {workflow.map((item) => (
                <article key={item.id} className="home-flow-step grid md:grid-cols-[72px_minmax(0,1fr)] gap-6 md:gap-9">
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-50/90 via-white/55 to-slate-100/45 dark:from-blue-500/[0.12] dark:via-white/[0.045] dark:to-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_24px_rgba(37,99,235,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.16)] flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-blue-600/80 dark:text-blue-400/72" />
                    </div>
                  </div>
                  <div className="pb-8 md:pb-10">
                    <h3 className="whitespace-nowrap text-2xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-4 leading-tight">{item.title}</h3>
                    <p className="text-sm md:text-base text-slate-600 dark:text-white/52 leading-relaxed font-medium max-w-3xl mb-6">{item.body}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {item.meta.map((meta) => (
                        <span key={meta} className="px-2.5 py-1.5 rounded-md bg-white/[0.12] dark:bg-transparent border border-slate-200/40 dark:border-white/[0.045] text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-white/32">
                          {meta}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}

              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                {capabilityRows.map((item) => (
                  <div key={item.title} className="border-t border-slate-200/50 dark:border-white/[0.055] pt-5 md:pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <item.icon className="w-[18px] h-[18px] shrink-0 text-blue-600/80 dark:text-blue-400/68" />
                      <h4 className="whitespace-nowrap text-sm sm:text-base font-extrabold text-slate-950 dark:text-white tracking-tight">{item.title}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-white/48 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="home-flow-divider"></div>

          <div className="py-14 md:py-24 space-y-16 md:space-y-24">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mb-5">Case context</p>
                <h2 className="whitespace-nowrap text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-none mb-6">
                  Context behind each finding.
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/52 font-medium max-w-2xl">
                  After data is collected, Orion links identities, sources, evidence, and recommended actions so analysts can understand what happened and what to do next.
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-16 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                  {contextLayers.map((layer) => (
                    <div key={layer.label} className="relative border-t border-slate-200/55 dark:border-white/[0.06] py-4 pl-10">
                      <span className="absolute left-[11px] top-5 h-2.5 w-2.5 rounded-full bg-blue-500/70 shadow-[0_0_16px_rgba(59,130,246,0.35)]"></span>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-800 dark:text-white/70">{layer.label}</p>
                      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-white/38">{layer.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-blue-500/20 pt-6">
                  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                    <Workflow className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">Orion case context</span>
                  </div>
                  <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-white/28">identify {'->'} prioritize {'->'} assign {'->'} export</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute left-[21px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/10 via-blue-500/35 to-blue-500/10"></div>
                <div className="space-y-7">
                  {investigationActions.map((action) => (
                    <div key={action.label} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-5">
                      <div className="relative z-10 w-11 h-11 rounded-lg bg-gradient-to-br from-blue-50/90 via-white/55 to-slate-100/45 dark:from-blue-500/[0.12] dark:via-white/[0.045] dark:to-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_24px_rgba(37,99,235,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.16)] flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-blue-600/80 dark:text-blue-400/72" />
                      </div>
                      <div className="border-t border-slate-200/50 dark:border-white/[0.055] pt-3">
                        <div className="flex flex-wrap items-baseline gap-3 mb-2">
                          <h3 className="whitespace-nowrap text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{action.label}</h3>
                        </div>
                        <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-white/45 font-medium">{action.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mb-5">Analyst workflow</p>
                <h2 className="whitespace-nowrap text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-none mb-6">
                  Search to remediation.
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/52 font-medium max-w-2xl">
                  A query can lead to source confidence, actor context, related infrastructure, remediation guidance, and a STIX 2.1 export.
                </p>
              </div>
            </div>
          </div>

          <div className="py-16 md:py-24 text-center">
            <div className="max-w-3xl mx-auto mb-14 md:mb-16">
              <h2 className="whitespace-nowrap text-2xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-6">
                {t('contact_title')}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-slate-500 dark:text-white/42 leading-relaxed font-medium">
                {t('contact_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-left mb-14 md:mb-16">
              {[
                { icon: Globe, label: t('contact_hq'), value: <>75 H2 Wapda Town <br />Lahore, Pakistan</> },
                { icon: Anchor, label: t('contact_hub'), value: <>PO Box 65 Minto <br />Sydney, Australia, 2566</> },
                { icon: Phone, label: t('contact_call'), value: '(+92) 332 4935230' },
                { icon: Mail, label: t('contact_email'), value: 'msmannan00@gmail.com' }
              ].map((item) => (
                <div key={item.label} className="space-y-5 border-t border-slate-200/55 dark:border-white/[0.06] pt-5">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-white/48 uppercase tracking-[0.2em]">
                    <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                    {item.label}
                  </div>
                  <p className="text-sm md:text-base text-slate-600 dark:text-white/42 leading-relaxed font-medium">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-7 md:px-9 py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-blue-500/20 border-t border-white/20">
                {t('contact_button')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageFlow;
