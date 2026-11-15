import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, Mail } from 'lucide-react';
import { InfoPage, InfoView, PageHeader, cardClass, eyebrowClass } from './InfoPageLayout';
import { COMPANY } from '../company';

export const linkClass =
  'font-bold text-blue-600 dark:text-blue-400 underline decoration-blue-500/30 underline-offset-2 hover:decoration-blue-500 transition-colors';

export const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-[15px] md:text-base leading-[1.8] text-slate-600 dark:text-white/55 font-medium ${className}`}>{children}</p>
);

export const Item: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.02] p-5 md:p-6">
    <p className="mb-1.5 text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</p>
    <p className="text-sm md:text-[15px] leading-[1.75] text-slate-600 dark:text-white/50 font-medium">{children}</p>
  </div>
);

export const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3 text-[15px] md:text-base leading-[1.7] text-slate-600 dark:text-white/55 font-medium">
        <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/60"></span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const Checks: React.FC<{ items: { title: string; text: React.ReactNode }[] }> = ({ items }) => (
  <ul className="space-y-4">
    {items.map((item) => (
      <li key={item.title} className="flex gap-3">
        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <span className="text-[15px] md:text-base leading-[1.7] text-slate-600 dark:text-white/55 font-medium">
          <strong className="font-extrabold text-slate-900 dark:text-white">{item.title}.</strong> {item.text}
        </span>
      </li>
    ))}
  </ul>
);

export const Callout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5 md:p-6">
    <p className="text-sm md:text-[15px] leading-[1.75] text-slate-600 dark:text-white/55 font-medium">
      <strong className="font-extrabold text-slate-900 dark:text-white">{title}</strong> {children}
    </p>
  </div>
);

export const Table: React.FC<{ head: string[]; rows: React.ReactNode[][]; emphasizeLast?: boolean }> = ({ head, rows, emphasizeLast = false }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.02] overflow-hidden">
    <table className="hidden sm:table w-full text-left">
      <thead>
        <tr className="border-b border-slate-200 dark:border-white/[0.07]">
          {head.map((h) => (
            <th key={h} scope="col" className="px-5 md:px-6 py-3.5 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/35">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200/70 dark:divide-white/[0.06]">
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td
                key={c}
                className={`px-5 md:px-6 py-4 align-top text-sm md:text-[15px] leading-[1.65] font-medium ${
                  c === 0
                    ? 'font-extrabold text-slate-900 dark:text-white whitespace-nowrap'
                    : emphasizeLast && c === row.length - 1
                      ? 'font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap'
                      : 'text-slate-600 dark:text-white/55'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <ul className="sm:hidden divide-y divide-slate-200/70 dark:divide-white/[0.06]">
      {rows.map((row, r) => {
        const middle = emphasizeLast ? row.slice(1, -1) : row.slice(1);
        return (
          <li key={r} className="px-5 py-4 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[15px] font-extrabold text-slate-900 dark:text-white">{row[0]}</span>
              {emphasizeLast && row.length > 1 && (
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{row[row.length - 1]}</span>
              )}
            </div>
            {middle.map((cell, c) => (
              <p key={c} className="text-sm leading-[1.65] text-slate-600 dark:text-white/55 font-medium">
                {cell}
              </p>
            ))}
          </li>
        );
      })}
    </ul>
  </div>
);

export const ContactCard: React.FC<{ intro: React.ReactNode; email: string; note?: React.ReactNode }> = ({ intro, email, note }) => (
  <div className={`${cardClass} !rounded-3xl p-6 md:p-8 space-y-6`}>
    <P>{intro}</P>
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[12px] tracking-[0.04em] transition-all active:scale-95 shadow-xl shadow-blue-500/20 border-t border-white/20"
      >
        <Mail className="w-4 h-4" />
        {email}
      </a>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-white/40 font-medium">
        {COMPANY.legalName}
        <br />
        {COMPANY.headquarters}, {COMPANY.country}
      </p>
    </div>
    {note && <p className="text-sm text-slate-500 dark:text-white/40 font-medium border-t border-slate-200 dark:border-white/[0.07] pt-5">{note}</p>}
  </div>
);

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalDocumentProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  lastUpdated: string;
  glance: string[];
  sections: LegalSection[];
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({ eyebrow, title, description, lastUpdated, glance, sections }) => {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const num = (i: number) => String(i + 1).padStart(2, '0');

  const toc = (
    <ul className="border-l border-slate-200 dark:border-white/[0.07]">
      {sections.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={jumpTo(item.id)}
            className={`-ml-px block border-l-2 py-[7px] pl-4 text-[13px] leading-snug transition-colors ${
              activeId === item.id
                ? 'border-blue-500 font-bold text-slate-900 dark:text-white'
                : 'border-transparent font-medium text-slate-500 dark:text-white/40 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="font-mono tabular-nums text-slate-400 dark:text-white/25">{num(i)}</span>&nbsp;&nbsp;{item.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <InfoPage>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        aside={
          <div className={`${cardClass} !rounded-3xl p-7 md:p-8 space-y-6`}>
            <div className="flex items-center justify-between gap-4">
              <p className={eyebrowClass}>At a glance</p>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">Updated {lastUpdated}</span>
            </div>
            <ul className="space-y-4">
              {glance.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-white/55 font-medium">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="home-flow-divider mb-12 md:mb-16"></div>

        <div className="flex gap-14 xl:gap-20">
          <aside className="hidden lg:block w-[260px] shrink-0">
            <nav className="sticky top-28" aria-label="On this page">
              <p className="mb-4 pl-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">On this page</p>
              {toc}
            </nav>
          </aside>

          <article className="min-w-0 flex-1 max-w-[780px]">
            <details className="lg:hidden mb-12 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.02] group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-white/40 [&::-webkit-details-marker]:hidden">
                On this page
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5">{toc}</div>
            </details>

            <div className="space-y-14 md:space-y-16">
              {sections.map((section, i) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="mb-5 flex items-baseline gap-3 text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">{num(i)}</span>
                    {section.title}
                  </h2>
                  {section.body}
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </InfoPage>
  );
};

export type { InfoView };
