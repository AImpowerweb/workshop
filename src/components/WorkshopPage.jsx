import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';

// ─────────────────────────────────────────────────────────────────────────────
//  Dedicated workshop write-up (route: #/workshop).
//  Copy lives in src/data/content.js under `content.workshopPage`. Structure:
//    intro[]            → lede paragraphs under the title
//    sections[]         → { heading, paragraphs[], scenario?, afterScenario?,
//                           figure?, closing? }
//    paper              → closing citation + link to the full paper
//  The "Stuttering Planet" scenario is rendered as real text (not the source
//  image) so it is readable by screen readers and translates with the toggle.
// ─────────────────────────────────────────────────────────────────────────────
export default function WorkshopPage() {
  const { t } = useLanguage();
  const page = content.workshopPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="bg-white">
      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-100 bg-[#FDF5F4]">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-8">
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-black"
          >
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
              <path d="M16 10H4M10 4l-6 6 6 6" />
            </svg>
            {t(page.back)}
          </a>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">
            {t(page.eyebrow)}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
            {t(page.title)}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* ── Lede ─────────────────────────────────────────────────────────── */}
        <div className="space-y-5 text-lg leading-relaxed text-slate-700">
          {page.intro.map((p, i) => (
            <p key={i}>{t(p)}</p>
          ))}
        </div>

        {/* ── Body sections ────────────────────────────────────────────────── */}
        {page.sections.map((section, i) => (
          <section key={i} className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              {t(section.heading)}
            </h2>

            <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
              {section.paragraphs.map((p, j) => (
                <p key={j}>{t(p)}</p>
              ))}
            </div>

            {/* Scenario shown to participants — real text, not an image */}
            {section.scenario && (
              <figure className="mt-8">
                <blockquote className="rounded-2xl border border-slate-200 bg-[#F6F2F2]/60 p-6 leading-relaxed text-slate-700">
                  {t(section.scenario.text)}
                </blockquote>
                <figcaption className="mt-3 text-center text-sm text-slate-500">
                  {t(section.scenario.caption)}
                </figcaption>
              </figure>
            )}

            {section.afterScenario && (
              <div className="mt-8 space-y-4 leading-relaxed text-slate-600">
                {section.afterScenario.map((p, j) => (
                  <p key={j}>{t(p)}</p>
                ))}
              </div>
            )}

            {/* Workshop artifact photo */}
            {section.figure && (
              <figure className="mt-8">
                <img
                  src={section.figure.src}
                  alt={t(section.figure.alt)}
                  className="w-full rounded-2xl border border-slate-200"
                />
                <figcaption className="mt-3 text-center text-sm text-slate-500">
                  {t(section.figure.caption)}
                </figcaption>
              </figure>
            )}

            {section.closing && (
              <div className="mt-8 space-y-4 leading-relaxed text-slate-600">
                {section.closing.map((p, j) => (
                  <p key={j}>{t(p)}</p>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* ── Paper ────────────────────────────────────────────────────────── */}
        <section className="mt-12 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            {t(page.paper.heading)}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">{t(page.paper.body)}</p>

          <a
            href={page.paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {t(page.paper.linkLabel)}
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
              <path d="M7 13L13 7M13 7H8M13 7v5" />
            </svg>
          </a>

          <p className="mt-6 border-l-2 border-slate-200 pl-4 text-sm leading-relaxed text-slate-500">
            {page.paper.citation}
          </p>
        </section>
      </div>
    </article>
  );
}
