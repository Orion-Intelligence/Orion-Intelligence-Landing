import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Globe, Lock, Menu, Moon, Sun, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Language } from '../translations';

// The AI analyst product has its own site; the nav and footer send people there.
export const DEEPINTEL_URL = 'https://deepintel.si/';

type View = 'home' | 'adversaries' | 'api-docs' | 'sources' | 'pricing' | 'collaboration';

interface NavbarProps {
  onNavigate: (view: View) => void;
  currentView: View | 'actor-dossier';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
];

// The Orion logo in the same small rounded tile the DeepIntel site uses, with a plain "O" if the image can't load.
const Logo: React.FC = () => {
  const [error, setError] = useState(false);
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a0a0c]">
      {!error ? (
        <img
          src="https://try.orionintelligence.org/api/s/static/system/logo_url_default.png"
          alt=""
          width={36}
          height={36}
          loading="eager"
          fetchPriority="high"
          className="h-full w-full scale-105 object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-lg font-black text-blue-600 dark:text-blue-500">O</span>
      )}
    </span>
  );
};

// Header styled like deepintel.si: a 64px bar, the logo tile and "ORION Intelligence" wordmark,
// plain text links, text "Login" / "Get Access" actions, and a numbered-row menu below xl.
const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, onToggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  // entries with an href leave the site (DeepIntel has its own home) instead of switching views
  const items: { id: View | 'deepintel'; label: string; href?: string }[] = [
    { id: 'home', label: t('nav_intelligence_os') },
    { id: 'adversaries', label: t('nav_adversaries') },
    { id: 'sources', label: t('nav_sources') },
    { id: 'api-docs', label: t('nav_api_docs') },
    { id: 'pricing', label: 'Pricing' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'deepintel', label: 'DeepIntel', href: DEEPINTEL_URL },
  ];

  const isActive = (id: string) => currentView === id || (id === 'adversaries' && currentView === 'actor-dossier');

  const go = (view: View) => {
    onNavigate(view);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const solid = scrolled || open;
  const link = 'text-[14px] font-medium transition-colors';
  const idle = 'text-slate-600 hover:text-slate-900 dark:text-slate-200/85 dark:hover:text-white';
  const active = 'text-slate-900 dark:text-white';
  const row = 'flex w-full items-center justify-between py-5 text-left text-xl font-semibold text-slate-900 dark:text-white';

  const accessLinks = (
    <>
      <a
        href="https://try.orionintelligence.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${link} ${idle} inline-flex items-center gap-1.5`}
      >
        <Lock className="h-3.5 w-3.5 text-blue-500" />
        {t('nav_login')}
      </a>
      <a
        href="https://calendly.com/msmannan/30min"
        target="_blank"
        rel="noopener noreferrer"
        className={`${link} inline-flex items-center gap-1 text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-300`}
      >
        {t('nav_get_access')}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-300 ${
        solid ? 'border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#070a14]/90' : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-6 sm:px-10 md:px-12 lg:px-16" aria-label="Main">
        <button type="button" onClick={() => go('home')} className="flex items-center gap-3" aria-label="Orion Intelligence home">
          <Logo />
          <span className="text-[16px] leading-none text-slate-900 dark:text-white">
            <span className="font-extrabold tracking-[-0.03em]">ORION</span>
            <span className="ml-[0.2em] font-normal text-slate-900/80 dark:text-white/90">Intelligence</span>
          </span>
        </button>

        <div className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {items.map((item) =>
            item.href ? (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className={`${link} ${idle} inline-flex items-center gap-1`}>
                {item.label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            ) : (
              <button key={item.id} type="button" onClick={() => go(item.id as View)} className={`${link} ${isActive(item.id) ? active : idle}`}>
                {item.label}
              </button>
            ),
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLang((s) => !s)}
                className={`${link} ${idle} inline-flex items-center gap-1.5 uppercase`}
                aria-haspopup="listbox"
                aria-expanded={showLang}
                aria-label="Language"
              >
                <Globe className="h-3.5 w-3.5" />
                {language}
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-3 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0a0e1c]" role="listbox">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      role="option"
                      aria-selected={language === l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLang(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                        language === l.code ? `${active} font-semibold` : idle
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={onToggleTheme} className={`${idle} transition-colors`} aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            {accessLinks}
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-md border border-slate-200 p-2 text-slate-900 dark:border-white/10 dark:text-white xl:hidden"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-64px)] overflow-y-auto bg-white px-6 pb-10 pt-2 dark:bg-[#070a14] xl:hidden">
          <ul>
            {items.map((item, i) => {
              const index = <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{String(i + 1).padStart(2, '0')}</span>;
              return (
                <li key={item.id} className="border-b border-slate-200 dark:border-white/[0.08]">
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={row}>
                      <span className="flex items-baseline gap-3">
                        {index}
                        {item.label}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 dark:text-white/40" />
                    </a>
                  ) : (
                    <button type="button" onClick={() => go(item.id as View)} className={row}>
                      <span className="flex items-baseline gap-3">
                        {index}
                        {item.label}
                      </span>
                      <ArrowUpRight className={`h-5 w-5 ${isActive(item.id) ? 'text-blue-500' : 'text-slate-400 dark:text-white/40'}`} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-5">{accessLinks}</div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3">
              <Globe className="h-3.5 w-3.5 text-slate-400 dark:text-white/40" />
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`${link} uppercase ${language === l.code ? active : idle}`}
                >
                  {l.code}
                </button>
              ))}
            </div>
            <button type="button" onClick={onToggleTheme} className={`${link} ${idle} inline-flex items-center gap-1.5`}>
              {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
