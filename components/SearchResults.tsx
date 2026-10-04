
import React, { useState } from 'react';
import {
  ArrowLeft, Mail, User, CheckCircle2, History, Radar, Activity, X, AlertTriangle, Globe, ChevronRight, Send, Loader2, CalendarClock, Radio
} from 'lucide-react';
import { StealerLogResponse, StealerLogRecord } from '../App';

interface SearchResultsProps {
  query: string;
  data: StealerLogResponse;
  onBack: () => void;
  onNavigateToRemediation: () => void;
  onNavigateToPricing: () => void;
  onSendReport: (email: string) => Promise<string | null>;
}

const DETAIL_EXCLUDED_KEYS = new Set([
  '_id', 'raw', 'type', 'file_type', 'fileType', 'date', 'channel', 'm_channel', 'm_sub_host',
  'source_channel', 'm_source_channel', 'ip', 'password', 'hash', 'index', 'mapping', 'delimiter',
  'domain', 'source_domain', 'service_domain', 'domains', 'email', 'dismissed', 'dismiss_id'
]);

const toList = (value: unknown): string[] =>
  (Array.isArray(value) ? value : [value])
    .filter((v) => v !== null && v !== undefined && v !== '')
    .map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v).trim()))
    .filter(Boolean);

const unique = (values: string[]) => Array.from(new Set(values));

const prettyLabel = (key: string) => {
  const cleaned = key.replace(/^m_/, '').replace(/[_-]+/g, ' ').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  if (!cleaned) return key;
  if (cleaned.length < 4) return cleaned.toUpperCase();
  return cleaned.toLowerCase().replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));
};

const urlHost = (value: string) => {
  try {
    return new URL(value.includes('://') ? value : `https://${value}`).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const breachedSitesOf = (record: StealerLogRecord) =>
  unique([
    ...toList(record.source_domain),
    ...toList(record.service_domain),
    ...toList(record.domains),
    ...toList(record.url).map(urlHost)
  ].filter(Boolean).map((v) => v.toLowerCase().replace(/^www\./, '')));

const recordDomains = (record: StealerLogRecord) => {
  if (record.type === 'bin') return toList(record.Type);
  const domains = unique([
    ...toList(record.service_domain),
    ...toList(record.domain),
    ...toList(record.source_domain),
    ...toList(record.domains)
  ]);
  if (domains.length) return domains;
  const ips = toList(record.ip);
  return ips.length ? ips : toList(record.channel);
};

const recordIdentity = (record: StealerLogRecord) => {
  if (record.type === 'bin') return toList(record.bin)[0] || '';
  return toList(record.email)[0]
    ?? toList(record.username)[0]
    ?? toList(record.phone)[0]
    ?? toList(record.identifier)[0]
    ?? unique([...toList(record.ipv4), ...toList(record.ip)])[0]
    ?? '';
};

const recordDetails = (record: StealerLogRecord) => {
  const groups: { key: string; label: string; values: string[] }[] = [];
  const emails = unique(toList(record.email));
  if (emails.length) groups.push({ key: 'email', label: 'Email', values: emails });
  const sourceDomains = unique([...toList(record.source_domain), ...toList(record.service_domain), ...toList(record.domains)]);
  const domains = unique([...toList(record.domain), ...sourceDomains]);
  if (domains.length) groups.push({ key: 'domain', label: sourceDomains.length ? 'Domain / Source Domain' : 'Domain', values: domains });
  const ips = unique(toList(record.ip));
  if (ips.length) groups.push({ key: 'ip', label: 'IP', values: ips });
  const rest = Object.keys(record)
    .filter((key) => !DETAIL_EXCLUDED_KEYS.has(key) && !/pass|pwd|secret|token|cvv|cvc/i.test(key))
    .map((key) => ({ key, label: prettyLabel(key), values: toList(record[key]) }))
    .filter((g) => g.values.length > 0)
    .filter((g) => !/hash|index/i.test(g.key) && !/hash|index/i.test(g.label))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [...groups, ...rest];
};

const formatDate = (value: unknown) => {
  const raw = toList(value)[0];
  if (!raw) return '—';
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TYPE_BADGE: Record<string, string> = {
  combo: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  sql: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  cookie: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  card: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  bin: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
};

const typeBadge = (type: unknown) =>
  TYPE_BADGE[String(type ?? '').toLowerCase()] ?? 'bg-slate-500/10 text-slate-600 dark:text-white/60 border-slate-500/20';

const timeOf = (value: unknown) => {
  const time = new Date(toList(value)[0] ?? '').getTime();
  return Number.isNaN(time) ? 0 : time;
};

const PRIORITY_RECORD_LIMIT = 10;

const SearchResults: React.FC<SearchResultsProps> = ({ query, data, onBack, onNavigateToRemediation, onNavigateToPricing, onSendReport }) => {
  const [showApiPopup, setShowApiPopup] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [sendError, setSendError] = useState<string | null>(null);

  const records = data.records ?? [];
  const isEmailQuery = query.includes('@');
  const siteStats = new Map<string, { count: number; latest: number }>();
  records.forEach((record) => breachedSitesOf(record).forEach((site) => {
    const current = siteStats.get(site) ?? { count: 0, latest: 0 };
    siteStats.set(site, { count: current.count + 1, latest: Math.max(current.latest, timeOf(record.date)) });
  }));
  const breachedSites = Array.from(siteStats.entries()).sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
  const maxSiteCount = Math.max(1, ...breachedSites.map(([, stat]) => stat.count));
  const emailCounts = new Map<string, number>();
  records.forEach((record) => unique(toList(record.email).map((email) => email.toLowerCase())).forEach((email) => emailCounts.set(email, (emailCounts.get(email) ?? 0) + 1)));
  const associatedEmails = Array.from(emailCounts.entries()).sort((a, b) => Number(b[0] === query.toLowerCase()) - Number(a[0] === query.toLowerCase()) || b[1] - a[1]);
  const sources = unique(records.flatMap((record) => toList(record.channel)));
  const latestSeen = Math.max(0, ...records.map((record) => timeOf(record.date)));
  const visibleRecords = [...records].sort((a, b) => timeOf(b.date) - timeOf(a.date)).slice(0, PRIORITY_RECORD_LIMIT);

  const handleSendReport = async () => {
    setSendState('sending');
    setSendError(null);
    const error = await onSendReport(query);
    if (error) {
      setSendError(error);
      setSendState('idle');
    } else {
      setSendState('sent');
    }
  };

  const getRiskBg = (score: number) => {
    if (score > 80) return 'bg-red-500';
    if (score > 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const cardStyle = "bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm backdrop-blur-md transition-all duration-300";

  // Unified High-Fidelity Galaxy Background
  const Background = ({ type }: { type: 'breach' | 'clearance' }) => (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
      <div className="absolute inset-0 opacity-40 dark:opacity-100 transition-all duration-1000" 
           style={{ 
             backgroundImage: `
               radial-gradient(circle at 15% 25%, ${type === 'breach' ? 'rgba(220,38,38,0.12)' : 'rgba(59,130,246,0.12)'}, transparent 50%),
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
               repeating-radial-gradient(circle at center, transparent 0, transparent 200px, ${type === 'breach' ? 'rgba(220,38,38,0.03)' : 'rgba(59,130,246,0.03)'} 201px, transparent 203px)
             `
           }}>
      </div>
      <div className="absolute inset-0 opacity-70 dark:opacity-0 transition-opacity duration-700 light-galaxy-detail"></div>
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] ${type === 'breach' ? 'bg-red-500/10' : 'bg-blue-500/10'} blur-[150px] rounded-full`}></div>
      <div className={`absolute bottom-0 left-0 w-[1000px] h-[1000px] ${type === 'breach' ? 'bg-red-900/5' : 'bg-blue-900/5'} blur-[180px] rounded-full`}></div>
    </div>
  );

  if (!data.breach_found) {
    return (
      <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 overflow-visible animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
        <Background type="clearance" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <button 
            onClick={onBack}
            className="mb-12 inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-blue-600 dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Return to Core Node
          </button>

          <div className={`${cardStyle} p-10 md:p-16 text-center space-y-10`}>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl">
                <Radar className="w-8 h-8 animate-spin-slow" strokeWidth={1.5} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-500/60 uppercase tracking-[0.3em]">Investigative Status</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">Security Clearance</h2>
                </div>
                
                <p className="text-sm md:text-base text-slate-600 dark:text-white/60 max-w-lg mx-auto leading-relaxed font-medium">
                  Identifier <code className="text-blue-600 dark:text-blue-400 font-bold">{query}</code> has been verified.
                  No exposures detected in monitored stealer log clusters.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-sm border-t border-slate-200 dark:border-white/5 pt-8">
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Integrity</span>
                   <div className="text-[11px] font-black text-blue-600">100%</div>
                </div>
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Freshness</span>
                   <div className="text-[11px] font-black text-blue-600">LIVE</div>
                </div>
                <div className="space-y-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                   <div className="text-[11px] font-black text-blue-600">HIGH</div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setShowApiPopup(true)}
                  className="px-7 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg flex items-center gap-3 active:scale-95"
                >
                  Raw Audit Log <Activity className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {showApiPopup && <ApiAccessPopup onClose={() => setShowApiPopup(false)} onContact={onNavigateToPricing} />}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 overflow-visible animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
      <Background type="breach" />
      <div className="relative z-10 space-y-8 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-6">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Return to Core Node
            </button>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none uppercase">Security Audit Report</h2>
                <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${data.breach_found ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-green-500/10 border-green-600/20 text-green-600'}`}>
                  <div className={`w-1 h-1 rounded-full ${data.breach_found ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  {data.breach_found ? 'Exposure' : 'Clearance'}
                </div>
              </div>
              <div className="flex items-center gap-3 py-4 bg-transparent max-w-xl">
                <div className="p-2.5 rounded-lg bg-blue-600/5 text-blue-600">
                  {isEmailQuery ? <Mail className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>
                <div className="flex flex-col">
                  <code className="text-lg md:text-xl font-mono text-slate-900 dark:text-white font-bold tracking-tight">{query}</code>
                  <span className="text-[9px] text-slate-400 dark:text-white/30 uppercase font-black tracking-widest">Investigative Identifier</span>
                </div>
              </div>
            </div>
          </div>

          {records.length > 0 && isEmailQuery && (
            <div className="flex flex-col items-stretch md:items-end gap-2 md:pb-4">
              <button
                type="button"
                onClick={handleSendReport}
                disabled={sendState !== 'idle'}
                className="px-5 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-80 disabled:cursor-default disabled:hover:bg-blue-600"
              >
                {sendState === 'sending' && <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>}
                {sendState === 'sent' && <><CheckCircle2 className="w-3.5 h-3.5" /> Report Sent</>}
                {sendState === 'idle' && <><Send className="w-3.5 h-3.5" /> Email Full Report</>}
              </button>
              <p className="text-[11px] text-slate-500 dark:text-white/40 md:text-right">
                {sendState === 'sent'
                  ? <>Sent to <span className="font-mono">{query}</span>. Check the inbox shortly.</>
                  : <>All {records.length} {records.length === 1 ? 'record' : 'records'} to this inbox · passwords never included</>}
              </p>
              {sendError && (
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 md:justify-end">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {sendError}
                </p>
              )}
            </div>
          )}
        </div>

        {records.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Breached Sites', val: breachedSites.length, color: 'text-red-500', icon: Globe, meta: 'Sites' },
            { label: 'Associated Emails', val: associatedEmails.length, color: 'text-slate-900 dark:text-white', icon: Mail, meta: 'Emails' },
            { label: 'Sources', val: sources.length, color: 'text-slate-900 dark:text-white', icon: Radio, meta: 'Channels' },
            {
              label: 'Last Seen',
              val: latestSeen ? new Date(latestSeen).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—',
              color: 'text-slate-900 dark:text-white',
              icon: CalendarClock,
              meta: latestSeen ? String(new Date(latestSeen).getFullYear()) : ''
            }
          ].map((stat, i) => (
            <div key={i} className={`${cardStyle} p-6 space-y-3`}>
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <stat.icon className="w-3.5 h-3.5 text-blue-500/50" />
                {stat.label}
              </div>
              <div className="flex flex-wrap items-end gap-x-2">
                <span className={`text-3xl font-black tracking-tighter whitespace-nowrap ${stat.color}`}>{stat.val}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{stat.meta}</span>
              </div>
            </div>
          ))}
        </div>
        )}

        {records.length > 0 && (
          <section className={`${cardStyle} overflow-hidden`}>
            <div className="p-6 md:p-10 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Records</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {visibleRecords.length < records.length ? `Showing ${visibleRecords.length} of ${records.length} · ` : ''}most recent first
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="hidden md:grid grid-cols-[44px_1.3fr_1.2fr_1fr_110px_32px] gap-3 items-center px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <div>#</div>
                    <div>Domain / Host</div>
                    <div>Credential Identifier</div>
                    <div>Source</div>
                    <div>Date</div>
                    <div></div>
                  </div>
                  {visibleRecords.map((record, i) => {
                    const domains = recordDomains(record);
                    const identity = recordIdentity(record);
                    const isOpen = expandedRecord === i;
                    return (
                      <div key={i} className="border-b last:border-b-0 border-slate-200 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() => setExpandedRecord(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          className={`w-full text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03] ${isOpen ? 'bg-slate-50 dark:bg-white/[0.03]' : ''}`}
                        >
                          <div className="hidden md:grid grid-cols-[44px_1.3fr_1.2fr_1fr_110px_32px] gap-3 items-center px-4 py-3.5 text-[12px]">
                            <span className="font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                            <span className="flex min-w-0 items-center gap-1.5 overflow-hidden" title={domains.join(', ')}>
                              {domains.length ? (
                                <>
                                  {domains.slice(0, 2).map((domain) => (
                                    <span key={domain} className="shrink-0 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:text-white/70">{domain}</span>
                                  ))}
                                  {domains.length > 2 && <span className="shrink-0 font-mono text-[11px] text-slate-400">+{domains.length - 2}</span>}
                                </>
                              ) : (
                                <span className="text-slate-400">Not available</span>
                              )}
                            </span>
                            <span className="truncate font-mono text-slate-900 dark:text-white" title={identity}>{identity || 'Not available'}</span>
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="truncate text-slate-600 dark:text-white/60" title={toList(record.channel).join(', ')}>{toList(record.channel)[0] || '—'}</span>
                              {record.type ? <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${typeBadge(record.type)}`}>{String(record.type)}</span> : null}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-white/40">{formatDate(record.date)}</span>
                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                          </div>
                          <div className="md:hidden px-4 py-4 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-mono text-[12px] font-bold text-slate-900 dark:text-white truncate">{identity || 'Not available'}</span>
                              <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {domains.slice(0, 3).map((domain) => (
                                <span key={domain} className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:text-white/70 break-all">{domain}</span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/40">
                              {record.type ? <span className={`rounded-md border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${typeBadge(record.type)}`}>{String(record.type)}</span> : null}
                              <span className="truncate">{toList(record.channel)[0] || '—'}</span>
                              <span>·</span>
                              <span className="shrink-0">{formatDate(record.date)}</span>
                            </div>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-200">
                            {recordDetails(record).map((group) => (
                              <div key={group.key} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-black/30 p-3 space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{group.label}</span>
                                <div className="space-y-0.5">
                                  {group.values.map((value, j) => (
                                    <div key={j} className="font-mono text-[11px] text-slate-800 dark:text-white/80 break-all">{value}</div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2.5 text-red-500">
                      <Globe className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Where it was breached</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{breachedSites.length}</span>
                  </div>
                  {breachedSites.length ? (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-slate-200 dark:divide-white/5">
                      {breachedSites.map(([site, stat]) => (
                        <li key={site} className="px-5 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-black uppercase shrink-0">{site[0]}</div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-mono text-[12px] text-slate-800 dark:text-white/80 break-all">{site}</span>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">{stat.count} {stat.count === 1 ? 'hit' : 'hits'}</span>
                            </div>
                            <div className="h-1 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full bg-red-500/70" style={{ width: `${(stat.count / maxSiteCount) * 100}%` }}></div>
                            </div>
                          </div>
                          <span className="hidden sm:block text-[10px] text-slate-400 shrink-0 w-20 text-right">{stat.latest ? formatDate(new Date(stat.latest).toISOString()) : '—'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-5 py-6 text-[12px] text-slate-400 dark:text-white/30">No site recorded for these entries.</p>
                  )}
                </div>

                <div className="rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2.5 text-blue-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Associated emails</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{associatedEmails.length}</span>
                  </div>
                  {associatedEmails.length ? (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-slate-200 dark:divide-white/5">
                      {associatedEmails.map(([email, count]) => {
                        const isQuery = email === query.toLowerCase();
                        return (
                          <li key={email} className="px-5 py-3 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isQuery ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                              <Mail className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`font-mono text-[12px] break-all ${isQuery ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-800 dark:text-white/80'}`}>{email}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {isQuery && <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-600 dark:text-blue-400">Searched</span>}
                                <span className="text-[10px] font-mono text-slate-400">{count} {count === 1 ? 'record' : 'records'}</span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="px-5 py-6 text-[12px] text-slate-400 dark:text-white/30">No email recorded for these entries.</p>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}
      </div>
      {showApiPopup && <ApiAccessPopup onClose={() => setShowApiPopup(false)} onContact={onNavigateToPricing} />}
    </div>
  );
};

const ApiAccessPopup: React.FC<{ onClose: () => void, onContact: () => void }> = ({ onClose, onContact }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="w-full max-w-md bg-white dark:bg-[#131315] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-8">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Paid API Access Required</h3>
          <p className="text-sm text-slate-600 dark:text-white/40 leading-relaxed font-medium">
            Full raw log access is restricted to Professional and Business tiers. Please contact support to provision your dedicated intelligence node.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 py-3 px-6 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={() => { onClose(); onContact(); }}
          className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg"
        >
          Contact Support
        </button>
      </div>
    </div>
  </div>
);

export default SearchResults;
