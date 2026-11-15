import React from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  Compass,
  Crosshair,
  Database,
  FileJson,
  Fingerprint,
  Layers,
  Lock,
  Microscope,
  Network,
  Radar,
  Scale,
  Search,
  Server,
  ShieldCheck,
  Target,
  Users,
  Workflow,
} from 'lucide-react';
import { DEEPINTEL_URL } from './Navbar';
import { useLanguage } from './LanguageContext';
import {
  CtaPanel,
  IconTile,
  InfoPage,
  InfoView,
  PageHeader,
  PageSection,
  SectionIntro,
  cardClass,
  ctaPrimaryClass,
  ctaSecondaryClass,
  eyebrowClass,
  labelClass,
} from './InfoPageLayout';
import { COMPANY, GITHUB_URL } from '../company';

interface AboutProps {
  onNavigate: (view: InfoView) => void;
}

const pipeline = [
  {
    id: '01',
    icon: Radar,
    title: 'Collection',
    body: 'Crawlers monitor clearnet sites, Tor and I2P services, forums, Telegram channels, and ransomware leak sites.',
  },
  {
    id: '02',
    icon: Workflow,
    title: 'Processing',
    body: 'Collected records are normalized and enriched, indicators are extracted, and related entities are linked.',
  },
  {
    id: '03',
    icon: Database,
    title: 'Orion Platform',
    body: 'Indexed data becomes searchable, filterable, and correlated in one analyst workspace with cases and reports.',
  },
  {
    id: '04',
    icon: FileJson,
    title: 'Access',
    body: 'Teams work in the web app, call the API, and export STIX 2.1 to SIEM, SOAR, and partner systems.',
  },
];

const components = [
  { icon: Layers, name: 'Orion Platform', purpose: 'Analyst-facing investigation workspace.' },
  { icon: Radar, name: 'Orion Crawler', purpose: 'Hidden-web and monitored-source crawling engine.' },
  { icon: Server, name: 'Orion Micros', purpose: 'Supporting backend service modules.' },
  { icon: Compass, name: 'Orion Browser', purpose: 'Browser-assisted private collection workflows.' },
  { icon: Users, name: 'Orion Social', purpose: 'Social intelligence data workflows.' },
  { icon: Database, name: 'Orion Leaks', purpose: 'Leak-focused ingestion and handling.' },
  { icon: Network, name: 'Orion Tor2Web', purpose: 'Tor-to-web access support component.' },
];

const audiences = [
  { icon: Search, title: 'OSINT analysts', desc: 'Search leak posts, forums, channels, and exposed accounts from one place.' },
  { icon: Crosshair, title: 'Threat investigators', desc: 'Follow actors, victims, infrastructure, and source history across cases.' },
  { icon: Activity, title: 'SOC and MDR teams', desc: 'Feed validated indicators and STIX 2.1 records into existing tooling.' },
  { icon: Microscope, title: 'DFIR and incident response', desc: 'Check what leaked, where it surfaced, and which accounts are exposed.' },
  { icon: Building2, title: 'Enterprise security', desc: 'Monitor your organization, brands, and credentials for exposure.' },
  { icon: Boxes, title: 'Research teams', desc: 'Work with large investigative datasets through search and the API.' },
];

const principles = [
  {
    icon: Scale,
    title: 'Lawful, authorized use',
    body: 'Orion is for teams with a lawful purpose and the authority to investigate. Active scans run only against owned, lab, or explicitly authorized targets.',
  },
  {
    icon: Target,
    title: 'Evidence before action',
    body: 'Every result opens into a report with source context and metadata. Intelligence can be incomplete or outdated, so it is verified before anyone acts on it.',
  },
  {
    icon: Fingerprint,
    title: 'Governed by default',
    body: 'Tenant separation, role-aware access, FIDO2 support, and audit history keep investigations accountable across a team.',
  },
  {
    icon: ShieldCheck,
    title: 'Open standards',
    body: 'Records export as STIX 2.1 and map to MITRE ATT&CK where relevant, so findings move cleanly into the tools teams already run.',
  },
];

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const stats = [
    { label: t('stats_records'), val: '14.2B+', color: 'text-blue-600 dark:text-blue-500' },
    { label: t('stats_groups'), val: '240+', color: 'text-slate-900 dark:text-white' },
    { label: t('stats_throughput'), val: '1.4TB', color: 'text-slate-900 dark:text-white' },
    { label: 'Founded', val: COMPANY.founded, color: 'text-slate-900 dark:text-white' },
  ];

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: 'Company', value: COMPANY.legalName },
    { label: 'Headquarters', value: COMPANY.headquarters },
    { label: 'Founded', value: COMPANY.founded },
    { label: 'Team size', value: COMPANY.size },
    { label: 'Industry', value: COMPANY.industry },
    {
      label: 'Service levels',
      value: (
        <button onClick={() => onNavigate('sla')} className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Published SLA <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <InfoPage>
      <PageHeader
        eyebrow="About Orion"
        title={
          <>
            Intelligence for teams that <span className="text-blue-600 dark:text-blue-500">act on it.</span>
          </>
        }
        description={`Orion Intelligence is a cybersecurity intelligence platform for OSINT, exposure discovery, ransomware tracking, monitored-source analysis, and investigative workflows, built by ${COMPANY.legalName}.`}
      />

      <PageSection className="!mb-20 md:!mb-28">
        <div className="flex flex-wrap items-center justify-between gap-8 font-mono border-y border-slate-200/80 dark:border-white/5 py-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              <span className={`text-lg md:text-xl font-black tracking-tight ${stat.color}`}>{stat.val}</span>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
          <SectionIntro eyebrow="Why Orion exists" title="One place for the whole investigation." />
          <div className="space-y-6 text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/50 font-medium">
            <p>
              Security teams usually chase evidence across leak sites, forums, Telegram channels, breach dumps, and exploit feeds, each with its own
              tool, format, and gaps. By the time the pieces line up, the exposure is old news.
            </p>
            <p>
              Orion is built as an operational intelligence environment rather than a single search page. Collection, processing, indexing, and
              analyst workflows live together, so a finding can move from raw signal to a case, remediation guidance, and a STIX 2.1 export without
              leaving the platform.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => onNavigate('sources')} className="px-4 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:opacity-90 transition-all">
                Source Map <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onNavigate('adversaries')} className="px-4 py-3 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/60 text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:border-blue-500/30 transition-all">
                Threat Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="home-flow-divider mb-14 md:mb-20"></div>
        <SectionIntro eyebrow="How it works" title="Collection to access." className="mb-12 md:mb-16">
          Orion runs as a connected flow. Each stage hands clean, linked data to the next, so analysts start from context instead of raw dumps.
        </SectionIntro>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pipeline.map((step) => (
            <div key={step.id} className={`${cardClass} !rounded-2xl p-7 flex flex-col gap-6 group hover:-translate-y-1 transition-all duration-500`}>
              <div className="flex items-center justify-between">
                <IconTile icon={step.icon} />
                <span className="font-mono text-[11px] font-bold text-slate-300 dark:text-white/15">{step.id}</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/50 font-medium">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28 space-y-8">
            <SectionIntro eyebrow="Ecosystem" title="Modular by design.">
              Orion is made of connected components. Some handle collection, some storage and services, others the analyst experience and
              specialized workflows. New modules slot in as investigative needs change.
            </SectionIntro>
            <div className="flex flex-wrap gap-3">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:opacity-90 transition-all">
                View on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href={DEEPINTEL_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/60 text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:border-blue-500/30 transition-all">
                DeepIntel.si <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8">
            {components.map((item) => (
              <div key={item.name} className="flex items-start gap-4 border-t border-slate-200/60 dark:border-white/[0.06] py-6">
                <item.icon className="w-[18px] h-[18px] mt-0.5 shrink-0 text-blue-600/80 dark:text-blue-400/70" />
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold tracking-tight text-slate-950 dark:text-white">{item.name}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-white/45 font-medium">{item.purpose}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4 border-t border-blue-500/25 py-6">
              <Radar className="w-[18px] h-[18px] mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold tracking-tight text-slate-950 dark:text-white">DeepIntel.si</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/45 font-medium">Autonomous AI analyst that watches your attack surface.</p>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="home-flow-divider mb-14 md:mb-20"></div>
        <SectionIntro eyebrow="Who it's for" title="Built for the people doing the work." className="mb-12 md:mb-16">
          Orion is for teams and individuals who need one investigation environment across collection, search, enrichment, and review.
        </SectionIntro>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2">
          {audiences.map((item) => (
            <div key={item.title} className="border-t border-slate-200/60 dark:border-white/[0.06] pt-6 pb-8">
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-[18px] h-[18px] shrink-0 text-blue-600/80 dark:text-blue-400/70" />
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-white/50 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
          <SectionIntro eyebrow="How we work" title="Principles behind the platform.">
            Intelligence about people and organizations carries responsibility. These commitments shape what Orion does and how it is used.
          </SectionIntro>
          <div className="space-y-8">
            {principles.map((item) => (
              <article key={item.title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-5">
                <IconTile icon={item.icon} />
                <div className="border-t border-slate-200/50 dark:border-white/[0.055] pt-3">
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-white/45 font-medium">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className={`${cardClass} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 md:p-12 lg:p-14 space-y-6">
              <p className={eyebrowClass}>The company</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
                Built by {COMPANY.legalName}.
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/50 font-medium max-w-2xl">
                {COMPANY.legalName} is a computer and network security company headquartered in {COMPANY.headquarters}. Its engineers and analysts
                build and operate Orion Intelligence, from source collection and crawling infrastructure to the analyst platform and API.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={COMPANY.linkedInUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:opacity-90 transition-all">
                  Meet the team <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => onNavigate('contact')} className="px-4 py-3 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/60 text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2 hover:border-blue-500/30 transition-all">
                  Contact <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <dl className="p-8 md:p-12 lg:p-14 bg-slate-50/80 dark:bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/[0.06] divide-y divide-slate-200/70 dark:divide-white/[0.06]">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                  <dt className={labelClass}>{fact.label}</dt>
                  <dd className="text-sm font-bold text-slate-900 dark:text-white/80 text-right">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </PageSection>

      <CtaPanel
        badge="Get started"
        badgeIcon={Lock}
        title={
          <>
            See Orion on <br className="hidden md:block" /> your own data
          </>
        }
        description="Tell us what you need to monitor and we will set up a walkthrough with the Orion team."
        actions={
          <>
            <a href={COMPANY.platformUrl} target="_blank" rel="noopener noreferrer" className={ctaSecondaryClass}>
              Open Platform <ArrowUpRight className="w-4 h-4" />
            </a>
            <button onClick={() => onNavigate('contact')} className={ctaPrimaryClass}>
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </>
        }
      />
    </InfoPage>
  );
};

export default About;
