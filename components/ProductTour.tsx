import React, { useEffect, useRef, useState } from 'react';
import search960 from '../assets/product-tour/search-960.webp';
import search1600 from '../assets/product-tour/search-1600.webp';
import satelliteIntel960 from '../assets/product-tour/satellite-intel-960.webp';
import satelliteIntel1600 from '../assets/product-tour/satellite-intel-1600.webp';
import ctiGraph960 from '../assets/product-tour/cti-graph-960.webp';
import ctiGraph1600 from '../assets/product-tour/cti-graph-1600.webp';
import monitoring960 from '../assets/product-tour/monitoring-960.webp';
import monitoring1600 from '../assets/product-tour/monitoring-1600.webp';
import networkIntel960 from '../assets/product-tour/network-intel-960.webp';
import networkIntel1600 from '../assets/product-tour/network-intel-1600.webp';
import dataBreach960 from '../assets/product-tour/data-breach-960.webp';
import dataBreach1600 from '../assets/product-tour/data-breach-1600.webp';
import cases960 from '../assets/product-tour/case-management-960.webp';
import cases1600 from '../assets/product-tour/case-management-1600.webp';

// Screens come from the Orion user manual (docs/screenshots in the platform repo) plus current
// Dashboard, Network Intel, and Data Breach captures, cropped to drop burned-in captions and frames. Copy is adapted from the manual.
interface Slide {
  label: string;
  title: string;
  body: string;
  alt: string;
  src: [string, string]; // 960w, 1600w
}

const SLIDES: Slide[] = [
  {
    label: 'Dashboard',
    title: 'Start from the global threat map.',
    body: 'The strategic heatmap shows where threat activity concentrates over the selected dates. Click a country to open its report, or search emails, domains, IPs, and IOCs from the bar above.',
    alt: 'Orion homepage with the strategic threat heatmap across the world map',
    src: [search960, search1600],
  },
  {
    label: 'Satellite Intel',
    title: 'Put infrastructure on the map.',
    body: 'Satellite Intel plots indexed facilities such as airports, ports, and industrial and military sites, with live aircraft and ship tracking and imagery comparison.',
    alt: 'Satellite Intel world map with facility markers and the facility dashboard',
    src: [satelliteIntel960, satelliteIntel1600],
  },
  {
    label: 'CTI Graph',
    title: 'Map how threats connect.',
    body: 'CTI Graph lays results out as clusters and documents you can filter by category, search, expand, and export, with session tabs for parallel investigations.',
    alt: 'CTI graph workspace with cluster nodes linked to leak, exploit, and social reports',
    src: [ctiGraph960, ctiGraph1600],
  },
  {
    label: 'Monitoring',
    title: 'Watch your own exposure.',
    body: 'Tenant monitoring tracks your IOCs across stealer logs, breaches, exploits, defacements, and scans, and rolls every alert up into critical, high, medium, and low risk.',
    alt: 'Tenant monitoring dashboard with risk summary cards and alert categories',
    src: [monitoring960, monitoring1600],
  },
  {
    label: 'Network Intel',
    title: 'Recon any domain or IP.',
    body: 'Vulnerability Scan expands a domain into its subdomains and scans each one at its own depth, from quick probes to ZAP spidering and CVE lookup. Host Recon and IP Scan cover DNS, ports, and services.',
    alt: 'Network Intel vulnerability scan listing a primary domain and its subdomains with scan depth controls',
    src: [networkIntel960, networkIntel1600],
  },
  {
    label: 'Data Breach',
    title: 'Check any company against leak sites.',
    body: 'Search leak-site postings by company, domain, email, or country. Each result carries its source onion URL, publish and last-checked dates, and a recent or archived status.',
    alt: 'Data Breach search with the domain filter open above a matching leak-site posting',
    src: [dataBreach960, dataBreach1600],
  },
  {
    label: 'Cases',
    title: 'Turn findings into tracked cases.',
    body: 'Cases carry status, severity, priority, owners, tasks, and evidence. Analytics shows the workload at a glance, and the tracking board moves work from intake to closure.',
    alt: 'Case management analytics with status, severity, and priority distributions',
    src: [cases960, cases1600],
  },
];

const SLIDE_MS = 5000;
const pad = (n: number) => String(n).padStart(2, '0');

const ProductTour: React.FC = () => {
  const count = SLIDES.length;
  const [active, setActive] = useState(0);
  // The slide being covered, kept fully opaque underneath so the change never dips through a half-transparent mix.
  const [prev, setPrev] = useState<number | null>(null);
  // 1 = forward, -1 = backward; sets which way the incoming screen drifts in.
  const [dir, setDir] = useState<1 | -1>(1);
  // Mount every screenshot once the tour is on screen, so jumping to any tab never animates an image that is still loading.
  const [mountAll, setMountAll] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = (index: number, direction?: 1 | -1) => {
    const next = (index + count) % count;
    if (next === active) return;
    setPrev(active);
    setDir(direction ?? (next > active ? 1 : -1));
    setActive(next);
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView) setMountAll(true);
  }, [inView]);

  // Keep the active tab visible when the tab row scrolls sideways (small screens), without moving the page.
  useEffect(() => {
    const list = tabListRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    list.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [active, reducedMotion]);

  // Reduced motion turns autoplay off; hover, focus, scrolling away, or a hidden tab hold the progress bar where it is.
  const autoplay = !reducedMotion;
  const running = autoplay && inView && pageVisible && !hovering && !focusWithin;

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    let direction: 1 | -1 | undefined;
    if (e.key === 'ArrowRight') [next, direction] = [active + 1, 1];
    else if (e.key === 'ArrowLeft') [next, direction] = [active - 1, -1];
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    if (next === null) return;
    e.preventDefault();
    const target = (next + count) % count;
    goTo(target, direction);
    tabRefs.current[target]?.focus();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) dx < 0 ? goTo(active + 1, 1) : goTo(active - 1, -1);
  };

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Orion platform tour"
      className="py-14 md:py-24"
      style={{ '--tour-dir': dir } as React.CSSProperties}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      {/* Header */}
      <div className="mb-10 md:mb-14">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mb-5">Inside the platform</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-none mb-6">See Orion at work.</h2>
        <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/50 font-medium max-w-2xl">
          Real screens from the Orion user manual, one workspace at a time.
        </p>
      </div>

      <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        {/* Screen */}
        <div className="relative">
          <div
            id="product-tour-panel"
            role="tabpanel"
            aria-labelledby={`product-tour-tab-${active}`}
            className="relative rounded-[1.25rem] md:rounded-[1.75rem] border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.025] p-1.5 md:p-2 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.25)] dark:shadow-none"
          >
            <div className="flex items-center gap-1.5 px-2.5 md:px-3.5 h-6 md:h-8" aria-hidden="true">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-300 dark:bg-white/15"></span>
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-300 dark:bg-white/15"></span>
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-300 dark:bg-white/15"></span>
            </div>

            <div
              className="relative overflow-hidden rounded-[0.9rem] md:rounded-[1.25rem] bg-[#0b1322] aspect-[1908/1000] touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {SLIDES.map((s, i) =>
                mountAll || i === active || i === (active + 1) % count ? (
                  <img
                    key={s.label}
                    src={s.src[1]}
                    srcSet={`${s.src[0]} 960w, ${s.src[1]} 1600w`}
                    sizes="(min-width: 1440px) 1380px, 96vw"
                    alt={i === active ? s.alt : ''}
                    aria-hidden={i !== active}
                    width={1600}
                    height={839}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-cover object-top select-none ${
                      i === active
                        ? `z-[2] opacity-100 ${prev !== null ? (dir === 1 ? 'tour-wipe-in-fwd' : 'tour-wipe-in-back') : ''}`
                        : i === prev
                          ? `z-[1] opacity-100 ${dir === 1 ? 'tour-wipe-out-fwd' : 'tour-wipe-out-back'}`
                          : 'z-0 opacity-0'
                    }`}
                  />
                ) : null
              )}
              {/* Light line riding the leading edge of the wipe; remounts on every change so it replays. */}
              {prev !== null && (
                <span
                  key={active}
                  aria-hidden="true"
                  className={`tour-edge ${dir === 1 ? 'tour-edge-fwd' : 'tour-edge-back'} absolute inset-0 z-[3] pointer-events-none`}
                ></span>
              )}
              <div className="absolute inset-0 z-[4] rounded-[inherit] ring-1 ring-inset ring-white/[0.06] pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Platform screens"
          className="mt-8 md:mt-10 flex xl:grid xl:grid-cols-7 gap-x-4 xl:gap-x-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`product-tour-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="product-tour-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => goTo(i)}
                onKeyDown={onTabKeyDown}
                className="group relative shrink-0 min-w-[132px] xl:min-w-0 snap-start text-left pt-4 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm"
              >
                <span className={`absolute top-0 inset-x-0 h-[2px] rounded-full transition-colors ${isActive ? 'bg-blue-500/25' : 'bg-slate-200 dark:bg-white/[0.08] group-hover:bg-slate-300 dark:group-hover:bg-white/15'}`}></span>
                {isActive && (
                  <span
                    key={active}
                    className={`absolute top-0 inset-x-0 h-[2px] rounded-full bg-blue-500 ${autoplay ? 'tour-progress' : ''}`}
                    style={autoplay ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: running ? 'running' : 'paused' } : undefined}
                    onAnimationEnd={() => goTo(active + 1, 1)}
                  ></span>
                )}
                <span className={`block font-mono text-[10px] tracking-[0.18em] mb-1.5 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-white/25'}`}>{pad(i + 1)}</span>
                <span className={`block whitespace-nowrap text-[11px] font-black uppercase tracking-[0.16em] transition-colors ${isActive ? 'text-slate-950 dark:text-white' : 'text-slate-500 dark:text-white/40 group-hover:text-slate-800 dark:group-hover:text-white/70'}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Captions share one grid cell, so the block always takes the tallest one's height and the page never jumps. */}
        <div className="mt-8 md:mt-10 grid" aria-live={running ? 'off' : 'polite'}>
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            // The outgoing caption fades out fast; the incoming title and text then rise in, slightly staggered.
            const textIn = isActive && prev !== null ? 'tour-text-in' : '';
            return (
              <div
                key={s.label}
                aria-hidden={!isActive}
                className={`[grid-area:1/1] grid content-start md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 md:gap-12 transition-[opacity,visibility] duration-150 ease-out motion-reduce:transition-none ${
                  isActive ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight ${textIn}`} style={{ animationDelay: '90ms' }}>
                  {s.title}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed text-slate-600 dark:text-white/50 font-medium ${textIn}`} style={{ animationDelay: '150ms' }}>
                  {s.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductTour;
