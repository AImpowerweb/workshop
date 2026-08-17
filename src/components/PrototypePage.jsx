import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { prototypes, tagLabel } from '../data/prototypes';
import { prototypeComponents } from './prototypes/registry';
import PrototypeStage from './PrototypeStage';

// ─────────────────────────────────────────────────────────────────────────────
//  Dedicated page for one prototype (route: #/prototype/<id>).
//  Sections: title → brief discussion → interactive prototype → further info.
//  Copy lives on the prototype entry in src/data/prototypes.js:
//    discussion:  [{ en, zh }, …]   paragraphs under "About this concept"
//    howToTry:    [{ en, zh }, …]   bullet hints next to the live prototype
//    furtherInfo: [{ en, zh }, …]   paragraphs under "Further information"
//  Entries without these fields fall back to the card description.
// ─────────────────────────────────────────────────────────────────────────────
export default function PrototypePage({ id }) {
  const { t } = useLanguage();
  const page = content.page;
  const prototype = prototypes.find((p) => p.id === id);

  // Fresh page feel: start at the top whenever the id changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!prototype) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-black">{t(page.notFound)}</h1>
        <a
          href="#prototypes"
          className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {t(page.back)}
        </a>
      </section>
    );
  }

  // A page may host more than one prototype (e.g. the Emotion Journal page also
  // embeds Custom Emotion Tagging via `extraPrototypes: [...]`).
  const stages = [
    prototype,
    ...(prototype.extraPrototypes ?? [])
      .map((eid) => prototypes.find((p) => p.id === eid))
      .filter(Boolean),
  ];
  const multi = stages.length > 1;

  // Only show the "About" write-up when there's dedicated copy — otherwise it
  // would just repeat the intro that already sits under the title.
  const discussion = prototype.discussion?.length ? prototype.discussion : null;

  // The three-up strip under "Further information". Status is the same for every
  // prototype, so it comes from the page copy rather than the registry.
  const facts = [
    { label: page.scenario, value: prototype.scenario },
    { label: page.platform, value: prototype.device },
    { label: page.status, value: page.statusValue },
  ];

  return (
    <article className="bg-white">
      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-100 bg-[#FDF5F4]">
        <div className="mx-auto max-w-5xl px-6 pb-10 pt-8">
          <a
            href="#prototypes"
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
            {t(prototype.scenario)}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
            {t(prototype.title)}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            {t(prototype.description)}
          </p>

          {prototype.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {prototype.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                >
                  {t(tagLabel(tag))}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* ── Interactive prototype(s) ─────────────────────────────────────── */}
        <section aria-labelledby="try-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="try-heading" className="text-xl font-semibold tracking-tight text-black">
              {t(multi ? page.tryItMulti : page.tryIt)}
            </h2>
            <p className="text-sm text-slate-400">{t(page.tryItHint)}</p>
          </div>

          <div className="mt-4 space-y-8">
            {stages.map((p, idx) => {
              const Comp = prototypeComponents[p.id];
              return (
                <div key={p.id} className={idx > 0 ? 'border-t border-slate-100 pt-8' : ''}>
                  {/* The main prototype is already named by the page title; only
                      additional embedded prototypes get their own subheading. */}
                  {idx > 0 && (
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-black">{t(p.title)}</h3>
                      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
                        {t(p.description)}
                      </p>
                    </div>
                  )}

                  {Comp ? (
                    <PrototypeStage prototype={p}>
                      <Comp />
                    </PrototypeStage>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                      <img
                        src={p.thumbnail}
                        alt={t(p.title)}
                        className="mx-auto h-auto w-full max-w-full object-contain"
                      />
                    </div>
                  )}

                  {p.howToTry?.length > 0 && (
                    <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      {p.howToTry.map((hint, i) => (
                        <li key={i} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5">
                          <span className="mt-0.5 text-brand-600" aria-hidden="true">
                            ✦
                          </span>
                          {t(hint)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Brief discussion (only when there's a dedicated write-up) ─────── */}
        {discussion && (
          <section aria-labelledby="about-heading" className="mt-12">
            <h2 id="about-heading" className="text-xl font-semibold tracking-tight text-black">
              {t(page.about)}
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-slate-600">
              {discussion.map((paragraph, i) => (
                <p key={i}>{t(paragraph)}</p>
              ))}
            </div>
          </section>
        )}

        {/* ── Further information ──────────────────────────────────────────── */}
        <section aria-labelledby="info-heading" className="mt-12">
          <h2 id="info-heading" className="text-xl font-semibold tracking-tight text-black">
            {t(page.moreInfo)}
          </h2>

          {prototype.furtherInfo?.length > 0 && (
            <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-slate-600">
              {prototype.furtherInfo.map((paragraph, i) => (
                <p key={i}>{t(paragraph)}</p>
              ))}
            </div>
          )}

          {/* The three facts read across rather than down. `flex-1` off a
              min-width floor keeps the columns even while still letting them
              wrap — to two, then one — once the labels stop fitting. */}
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-5 rounded-2xl border border-slate-200 bg-[#F6F2F2]/60 px-6 py-5 text-sm">
            {facts.map((fact) => (
              <div key={fact.label.en} className="min-w-[8rem] flex-1">
                <dt className="font-medium text-stone-500">{t(fact.label)}</dt>
                <dd className="mt-0.5 font-semibold text-black">{t(fact.value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
