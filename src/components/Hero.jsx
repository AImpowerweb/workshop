import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';

export default function Hero() {
  const { t } = useLanguage();
  const { hero } = content;

  return (
    <section id="about" className="relative overflow-hidden bg-white">
      {/* soft decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 max-w-3xl rounded-full bg-blush/50 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
          {t(hero.title)}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          {t(hero.subtitle)}
        </p>
        <div className="mx-auto mt-8 max-w-2xl space-y-4 text-left text-slate-600">
          {hero.body.map((paragraph, i) => (
            <p key={i}>{t(paragraph)}</p>
          ))}
        </div>
        <p className="mt-8 text-sm italic text-slate-400">{t(hero.note)}</p>

        <div className="mt-10">
          <a
            href="#prototypes"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {t(content.nav.prototypes)}
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 4v12M4 10l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
