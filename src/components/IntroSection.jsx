import { useLanguage } from '../context/LanguageContext';

/**
 * Lettermark for the placeholder circle: first + last initial, so
 * "Norman Makoto Su" → "NS" rather than "NMS". Organisations don't follow that
 * pattern, so they set an explicit `lettermark` in the data instead.
 */
function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * One person: a portrait circle above their name. Photos aren't available yet,
 * so the circle carries their initials — a deliberate placeholder rather than an
 * empty hole. Give a member a `photo` and it renders instead, no layout change.
 */
function Person({ member, note }) {
  const src = member.photo ? `${import.meta.env.BASE_URL}${member.photo}` : null;
  return (
    <li className="flex w-[120px] max-w-[190px] flex-col items-center" style={{ width: member.note ? 190 : undefined }}>
      {src ? (
        <img
          src={src}
          alt=""
          className="h-20 w-20 rounded-full object-cover shadow-sm ring-1 ring-black/5"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-lg font-semibold tracking-wide text-brand-700 ring-1 ring-black/5"
        >
          {member.lettermark || initials(member.name)}
        </span>
      )}
      <span className="mt-3 text-sm font-medium leading-snug text-black">{member.name}</span>
      {member.note && note && (
        <span className="mt-1 text-xs leading-snug text-slate-500">({note(member.note)})</span>
      )}
    </li>
  );
}

function PeopleRow({ members, note, className = 'mt-4' }) {
  return (
    <ul className={`flex flex-wrap justify-center gap-x-8 gap-y-7 ${className}`}>
      {members.map((m) => (
        <Person key={m.name} member={m} note={note} />
      ))}
    </ul>
  );
}

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
          <div className="mt-12 space-y-12">
            {section.groups.map((group) => (
              <div key={group.label.en}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {t(group.label)}
                </p>

                {/* Researchers are nested by institution; other groups are flat. */}
                {group.orgs ? (
                  <div className="mt-6 space-y-8">
                    {group.orgs.map((entry) => (
                      <div key={entry.org}>
                        <p className="text-sm font-semibold text-slate-500">{entry.org}</p>
                        <PeopleRow members={entry.members} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <PeopleRow members={group.members} note={t} className="mt-6" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
