import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center" aria-label={t(content.brand)}>
          <img
            src={`${import.meta.env.BASE_URL}assets/brand/aimpower-logo.png`}
            alt={t(content.brand)}
            className="h-9 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#prototypes"
            className="text-sm font-medium text-slate-600 transition hover:text-black"
          >
            {t(content.nav.prototypes)}
          </a>
          <a
            href="#team"
            className="text-sm font-medium text-slate-600 transition hover:text-black"
          >
            {t(content.nav.team)}
          </a>
          <a
            href="#/workshop"
            className="text-sm font-medium text-slate-600 transition hover:text-black"
          >
            {t(content.nav.workshop)}
          </a>
        </nav>

        <LanguageToggle />
      </div>
    </header>
  );
}
