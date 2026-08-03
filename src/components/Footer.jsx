import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-center sm:flex-row sm:text-left">
        <div className="flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}assets/brand/aimpower-logo.png`}
            alt={t(content.brand)}
            className="h-8 w-auto"
          />
        </div>
        <p className="text-sm text-slate-500">{t(content.footer.tagline)}</p>
        <p className="text-sm text-slate-400">{t(content.footer.rights)}</p>
      </div>
    </footer>
  );
}
