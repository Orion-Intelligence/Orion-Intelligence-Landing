import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bug,
  ChevronDown,
  Inbox,
  LifeBuoy,
  Mail,
  MapPin,
  Send,
  Shield,
} from 'lucide-react';
import { InfoPage, InfoView, PageHeader, PageSection, cardClass, eyebrowClass, labelClass } from './InfoPageLayout';
import { COMPANY, SECURITY_REPORT_URL, SLA } from '../company';

interface ContactProps {
  onNavigate: (view: InfoView) => void;
}

const TOPICS = ['Platform access', 'Pricing and licensing', 'Technical evaluation', 'Partnership', 'Privacy request', 'Something else'];

const inputClass =
  'w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15';

const channels = [
  {
    icon: Shield,
    title: 'Privacy requests',
    body: 'Access, correction, or deletion requests and questions about how we handle data.',
    cta: COMPANY.privacyEmail,
    href: `mailto:${COMPANY.privacyEmail}`,
  },
  {
    icon: Bug,
    title: 'Security vulnerabilities',
    body: 'Report privately through GitHub, never in a public issue. We aim to acknowledge new reports within 8 hours.',
    cta: 'Report a vulnerability',
    href: SECURITY_REPORT_URL,
    external: true,
  },
  {
    icon: Inbox,
    title: 'Leak and incident reporting',
    body: 'Submit leaked data or sensitive reports through the Orion reporting portal.',
    cta: 'orionleaks.com',
    href: COMPANY.reportingPortalUrl,
    external: true,
  },
  {
    icon: LifeBuoy,
    title: 'Existing customers',
    body: 'Use Help & Support inside the platform for account and operational questions.',
    cta: 'Client login',
    href: COMPANY.platformUrl,
    external: true,
  },
];

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({ name: '', email: '', organization: '', topic: TOPICS[0], message: '' });
  const [sentTo, setSentTo] = useState<string | null>(null);

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // No backend here: compose the message in the visitor's own email app, as the Pricing quote buttons do.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = form.topic === 'Privacy request' ? COMPANY.privacyEmail : COMPANY.supportEmail;
    const organization = form.organization.trim();
    const subject = organization ? `${form.topic} · ${organization}` : form.topic;
    const lines = [form.message.trim(), '', `Name: ${form.name.trim()}`, `Email: ${form.email.trim()}`];
    if (organization) lines.push(`Organization: ${organization}`);
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSentTo(to);
  };

  const details = [
    {
      icon: MapPin,
      label: 'Headquarters',
      value: (
        <>
          {COMPANY.headquarters} <br />
          {COMPANY.country}
        </>
      ),
    },
    { icon: Mail, label: 'Email', value: <a href={`mailto:${COMPANY.supportEmail}`} className="hover:text-blue-600 dark:hover:text-white transition-colors">{COMPANY.supportEmail}</a> },
    {
      icon: BookOpen,
      label: 'Documentation',
      value: (
        <a href={COMPANY.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-white transition-colors">
          orion-search.readthedocs.io <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </a>
      ),
    },
    {
      icon: Activity,
      label: 'Service status',
      value: (
        <>
          <a href={COMPANY.statusUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-white transition-colors">
            Live uptime <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
          </a>
          <br />
          <button onClick={() => onNavigate('sla')} className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-white transition-colors">
            {SLA.uptime} uptime SLA <ArrowRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        </>
      ),
    },
  ];

  return (
    <InfoPage>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Talk to the <span className="text-blue-600 dark:text-blue-500">Orion team.</span>
          </>
        }
        description="Tell us what you need to monitor or investigate. We can set up a walkthrough, scope a deployment, or answer technical questions about the platform and API."
      />

      <PageSection>
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className={`${cardClass} p-7 sm:p-10 lg:p-12 space-y-7`}>
            <div className="space-y-2">
              <p className={eyebrowClass}>Send a message</p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">How can we help?</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <label htmlFor="contact-name" className={labelClass}>Name</label>
                <input id="contact-name" type="text" required autoComplete="name" value={form.name} onChange={update('name')} placeholder="Jane Analyst" className={inputClass} />
              </div>
              <div className="space-y-2.5">
                <label htmlFor="contact-email" className={labelClass}>Work email</label>
                <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} placeholder="jane@company.com" className={inputClass} />
              </div>
              <div className="space-y-2.5">
                <label htmlFor="contact-org" className={labelClass}>Organization</label>
                <input id="contact-org" type="text" autoComplete="organization" value={form.organization} onChange={update('organization')} placeholder="Optional" className={inputClass} />
              </div>
              <div className="space-y-2.5">
                <label htmlFor="contact-topic" className={labelClass}>Topic</label>
                <div className="relative">
                  <select id="contact-topic" value={form.topic} onChange={update('topic')} className={`${inputClass} appearance-none pr-10 cursor-pointer dark:[color-scheme:dark]`}>
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label htmlFor="contact-message" className={labelClass}>Message</label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={form.message}
                onChange={update('message')}
                placeholder="What are you trying to monitor, investigate, or integrate?"
                className={`${inputClass} resize-y min-h-[150px] leading-relaxed`}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-1">
              <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-500/20 border-t border-white/20 shrink-0">
                Compose Email <Send className="w-4 h-4" />
              </button>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-white/35 font-medium" aria-live="polite">
                {sentTo ? (
                  <>
                    Your email app should now have the message ready. Nothing is sent until you press send there. If nothing opened, write to{' '}
                    <a href={`mailto:${sentTo}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">{sentTo}</a>.
                  </>
                ) : (
                  'Opens your email app with this message filled in, so you can review it before sending.'
                )}
              </p>
            </div>
          </form>

          {/* Other channels */}
          <aside className="space-y-8 lg:pt-4">
            <div>
              <p className={`${eyebrowClass} mb-4`}>Other channels</p>
              <p className="text-base leading-relaxed text-slate-600 dark:text-white/50 font-medium">
                Some requests have a dedicated route so they reach the right people faster.
              </p>
            </div>
            <ul>
              {channels.map((c) => (
                <li key={c.title} className="border-t border-slate-200/70 dark:border-white/[0.06] py-6 first:pt-6">
                  <div className="flex items-start gap-4">
                    <c.icon className="w-[18px] h-[18px] mt-0.5 shrink-0 text-blue-600/80 dark:text-blue-400/70" />
                    <div className="space-y-2 min-w-0">
                      <h3 className="text-base font-extrabold tracking-tight text-slate-950 dark:text-white">{c.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-white/45 font-medium">{c.body}</p>
                      <a
                        href={c.href}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-white transition-colors break-all"
                      >
                        {c.cta}
                        {c.external ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowRight className="w-3.5 h-3.5 shrink-0" />}
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-white/35 font-medium border-t border-slate-200/70 dark:border-white/[0.06] pt-6">
              Before writing in, see how we handle what you send in our{' '}
              <button onClick={() => onNavigate('privacy')} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">privacy policy</button>.
            </p>
          </aside>
        </div>
      </PageSection>

      {/* Company details */}
      <PageSection className="!mb-0">
        <div className="home-flow-divider mb-12 md:mb-16"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {details.map((item) => (
            <div key={item.label} className="space-y-5 border-t border-slate-200/55 dark:border-white/[0.06] pt-5">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-white/50 uppercase tracking-[0.2em]">
                <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                {item.label}
              </div>
              <p className="text-sm md:text-base text-slate-600 dark:text-white/40 leading-relaxed font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </InfoPage>
  );
};

export default Contact;
