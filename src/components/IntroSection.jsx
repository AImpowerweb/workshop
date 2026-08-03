import { useLanguage } from '../context/LanguageContext';

// A simple centered "eyebrow + title + paragraph" section, used for the
// home-page Workshop and Team intros. `section` is a content block shaped
// { eyebrow, title, body } (each { en, zh }); `alt` gives it the tinted
// background so consecutive sections alternate.
//
// A section may also carry `groups: [{ label, members: [{ name, org?, note? }] }]`
// — rendered below the body as a credits roster (used by the Team section).
// Names/affiliations are proper nouns; only `label` and `note` are translated.
export default function IntroSection({ id, section, alt = false }) {
  const { t } = useLanguage();

  return (
    <section
      id={id}
      className={`border-t border-slate-100 ${alt ? 'bg-[#FDF5F4]' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
        {section.eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-600">
            {t(section.eyebrow)}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-black">
          {t(section.title)}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
          {t(section.body)}
        </p>

        {section.cta && (
          <a
            href={section.cta.href}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {t(section.cta.label)}
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
              <path d="M4 10h12M10 4l6 6-6 6" />
            </svg>
          </a>
        )}

        {section.groups?.length > 0 && (
          <div className="mt-12 space-y-10">
            {section.groups.map((group) => (
              <div key={group.label.en}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {t(group.label)}
                </p>
                <ul
                  className={`mt-4 gap-x-10 gap-y-4 ${
                    group.members.length > 1 ? 'grid sm:grid-cols-2' : 'space-y-4'
                  }`}
                >
                  {group.members.map((m) => (
                    <li key={m.name}>
                      <span className="font-medium text-black">{m.name}</span>
                      {m.org && (
                        <span className="mt-0.5 block text-sm text-slate-600">{m.org}</span>
                      )}
                      {m.note && (
                        <span className="mt-0.5 block text-sm text-slate-600">
                          ({t(m.note)})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
