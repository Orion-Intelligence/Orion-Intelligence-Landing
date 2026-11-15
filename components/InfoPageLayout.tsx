import React from 'react';
import type { LucideIcon } from 'lucide-react';

// Views the About, Contact, and Privacy pages link to.
export type InfoView = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'sla' | 'pricing' | 'sources' | 'adversaries' | 'api-docs';

export const cardClass =
  'bg-white/80 dark:bg-[#0d0d0f]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm';

export const eyebrowClass = 'text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400';

export const labelClass = 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40';

const STARFIELD = `
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
`;

// Page root with the same fixed starfield the Pricing page sits on.
export const InfoPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="pb-32 animate-in fade-in duration-700 w-full overflow-x-clip relative">
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
      <div className="absolute inset-0 opacity-40 dark:opacity-100 transition-all duration-1000" style={{ backgroundImage: STARFIELD }}></div>
      <div className="absolute inset-0 opacity-70 dark:opacity-0 transition-opacity duration-700 light-galaxy-detail"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-900/5 blur-[180px] rounded-full"></div>
    </div>
    {children}
  </div>
);

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  // optional right-hand column (summary card, quick facts, ...)
  aside?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, aside }) => (
  <header className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-16 mb-16 md:mb-24 relative z-10">
    <div className={`grid gap-12 lg:gap-16 items-end ${aside ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]' : ''}`}>
      <div className="space-y-7 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/[0.035] border border-slate-200/80 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
          {eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">{title}</h1>
        <p className="text-base md:text-xl text-slate-500 dark:text-white/40 font-medium leading-relaxed max-w-2xl">{description}</p>
      </div>
      {aside}
    </div>
  </header>
);

export const PageSection: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => (
  <section id={id} className={`max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-24 md:mb-32 relative z-10 ${className}`}>
    {children}
  </section>
);

interface SectionIntroProps {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const SectionIntro: React.FC<SectionIntroProps> = ({ eyebrow, title, children, className = '' }) => (
  <div className={`max-w-3xl ${className}`}>
    <p className={`${eyebrowClass} mb-5`}>{eyebrow}</p>
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight mb-6">{title}</h2>
    {children && <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/50 font-medium">{children}</p>}
  </div>
);

// The small gradient icon tile used across the homepage flow.
export const IconTile: React.FC<{ icon: LucideIcon }> = ({ icon: Icon }) => (
  <div className="w-11 h-11 shrink-0 rounded-lg bg-gradient-to-br from-blue-50/90 via-white/55 to-slate-100/45 dark:from-blue-500/[0.12] dark:via-white/[0.045] dark:to-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_24px_rgba(37,99,235,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.16)] flex items-center justify-center">
    <Icon className="w-4 h-4 text-blue-600/80 dark:text-blue-400/70" />
  </div>
);

export const ctaPrimaryClass =
  'px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-500/20 border-t border-white/20';

export const ctaSecondaryClass =
  'px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm';

interface CtaPanelProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: React.ReactNode;
  description: string;
  actions: React.ReactNode;
}

// Inverted closing panel, matching the one at the bottom of Pricing.
export const CtaPanel: React.FC<CtaPanelProps> = ({ badge, badgeIcon: BadgeIcon, title, description, actions }) => (
  <PageSection className="!mb-0">
    <div className="relative p-10 sm:p-12 md:p-20 rounded-[3rem] bg-slate-900 dark:bg-white overflow-hidden shadow-2xl">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_2px_2px,#3b82f6_1px,transparent_0)] bg-[size:32px_32px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
            <BadgeIcon className="w-3 h-3" />
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white dark:text-slate-900 tracking-tighter uppercase leading-none">{title}</h2>
          <p className="text-base md:text-xl text-white/60 dark:text-slate-500 font-medium max-w-xl">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">{actions}</div>
      </div>
    </div>
  </PageSection>
);
