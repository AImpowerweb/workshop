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
 * One roster entry: a mark above the name.
 *
 * Everyone gets the same 80px circle — a `photo` if one exists, a `logo` for an
 * organisation, otherwise initials as a deliberate placeholder rather than an
 * empty hole. A group marked `nameOnly` skips the circle entirely. `url` makes
 * the whole entry a link out.
 */
function Person({ member, note, nameOnly }) {
  const asset = (p) => `${import.meta.env.BASE_URL}${p}`;

  const mark = nameOnly ? null : member.logo ? (
    // Same circle as the portraits, white behind so the mark reads on the
    // tinted section background.
    <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-2.5 shadow-sm ring-1 ring-black/5">
      <img src={asset(member.logo)} alt="" className="max-h-full max-w-full object-contain" />
    </span>
  ) : member.photo ? (
    <img
      src={asset(member.photo)}
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
  );

  const body = (
    <>
      {mark}
      <span
        className={`text-sm font-medium leading-snug ${nameOnly ? '' : 'mt-3'} ${
          member.url ? 'text-brand-700 underline decoration-brand-300 underline-offset-2' : 'text-black'
        }`}
      >
        {member.name}
      </span>
      {member.note && note && (
        <span className="mt-1 text-xs leading-snug text-slate-500">({note(member.note)})</span>
      )}
    </>
  );

  // From `sm:` up the mark sits at the cell's leading edge, so cells of
  // differing width still line up down the column. On phones the rows stack and
  // are centred, so the cell centres its contents instead.
  const cell = 'flex w-[112px] flex-col items-center text-center sm:items-start sm:text-left';
  const width = member.note ? 200 : undefined;

  return (
    <li className={cell} style={{ width }}>
      {member.url ? (
        <a
          href={member.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center transition hover:opacity-90 sm:items-start"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

function PeopleRow({ members, note, nameOnly }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-7 gap-y-6 sm:justify-start">
      {members.map((m) => (
        <Person key={m.name} member={m} note={note} nameOnly={nameOnly} />
      ))}
    </ul>
  );
}

/**
 * One roster line: the label on the left — an affiliation, or a flat group's own
 * heading — with that row's marks beside it. A shared column width keeps every
 * row of circles starting at the same x.
 *
 * `sm:pt-6` drops the label to the circle's vertical middle; a `nameOnly` row has
 * no circle to centre against, so it skips the padding.
 */
function RosterRow({ label, members, note, nameOnly }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-3 sm:grid-cols-[13rem_1fr]">
      <p className={`text-center text-sm font-semibold leading-snug text-slate-600 sm:text-left ${nameOnly ? '' : 'sm:pt-6'}`}>
        {label}
      </p>
      <PeopleRow members={members} note={note} nameOnly={nameOnly} />
    </div>
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
        {/* Optional: the Team section is its roster, with no intro paragraph. */}
        {section.body && (
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
            {t(section.body)}
          </p>
        )}

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

        {/* Roster reads left-to-right — affiliation, then that group's people —
            so it is left-aligned inside the otherwise centred section. */}
        {section.groups?.length > 0 && (
          <div className="mx-auto mt-12 max-w-2xl space-y-10 text-center sm:text-left">
            {section.groups.map((group) =>
              /* Only a group split by institution needs a heading on a line of
                 its own, above its affiliation rows. A flat group has nothing to
                 put in the affiliation column, so its heading goes there instead
                 — level with its own mark rather than stranded above it. */
              group.orgs ? (
                <div key={group.label.en}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {t(group.label)}
                  </p>
                  <div className="mt-4 space-y-6">
                    {group.orgs.map((entry) => (
                      <RosterRow key={entry.org} label={entry.org} members={entry.members} />
                    ))}
                  </div>
                </div>
              ) : (
                <RosterRow
                  key={group.label.en}
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {t(group.label)}
                    </span>
                  }
                  members={group.members}
                  note={t}
                  nameOnly={group.nameOnly}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
