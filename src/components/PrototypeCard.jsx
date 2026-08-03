import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { tagLabel } from '../data/prototypes';

// ─────────────────────────────────────────────────────────────────────────────
//  Card behaviour, in priority order:
//    • page: true       → navigates to the dedicated page (#/prototype/<id>)
//    • embedUrl present → clicking opens the in-site modal (onOpen)
//    • else url present → opens that link in a new tab
//    • else             → "Coming soon" (not clickable)
// ─────────────────────────────────────────────────────────────────────────────

// Gradient fallbacks used when a prototype has no thumbnail screenshot yet.
const GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-sky-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-fuchsia-500',
  'from-blue-500 to-indigo-500',
  'from-teal-500 to-green-500',
  'from-orange-500 to-red-500',
  'from-fuchsia-500 to-purple-500',
];

/** Chinese screenshots sit beside the English ones in a `zh/` subfolder. */
function zhVariant(thumbnail) {
  return thumbnail ? thumbnail.replace(/([^/]+)$/, 'zh/$1') : thumbnail;
}

export default function PrototypeCard({ prototype, index, onOpen }) {
  const { t, lang } = useLanguage();
  const [failed, setFailed] = useState({});

  const hasPage = Boolean(prototype.page);
  const canEmbed = Boolean(prototype.embedUrl);
  const hasLink = Boolean(prototype.url) && prototype.url !== '#';
  const interactive = hasPage || canEmbed || hasLink;

  // Show the screenshot that matches the reading language. If a Chinese capture
  // is ever missing we quietly fall back to the English one, and only drop to
  // the gradient placeholder if that is missing too.
  const preferred =
    lang === 'zh' && prototype.thumbnail ? zhVariant(prototype.thumbnail) : prototype.thumbnail;
  const thumbSrc = failed[preferred] ? prototype.thumbnail : preferred;
  const showImage = Boolean(thumbSrc) && !failed[prototype.thumbnail];
  const number = String(index + 1).padStart(2, '0');

  // Pick the wrapper element based on behaviour.
  const Wrapper = hasPage || hasLink ? 'a' : canEmbed ? 'button' : 'div';
  const openAria = `${t(content.prototypes.openLabel)}: ${t(prototype.title)}`;
  const wrapperProps = hasPage
    ? {
        href: `#/prototype/${prototype.id}`,
        'aria-label': openAria,
      }
    : canEmbed
      ? {
          type: 'button',
          onClick: () => onOpen(prototype),
          'aria-label': openAria,
        }
      : hasLink
        ? {
            href: prototype.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': openAria,
          }
        : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        interactive ? 'hover:-translate-y-1 hover:shadow-md' : 'cursor-default'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {showImage ? (
          <img
            src={thumbSrc}
            alt=""
            loading="lazy"
            onError={() => setFailed((f) => ({ ...f, [thumbSrc]: true }))}
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
              GRADIENTS[index % GRADIENTS.length]
            }`}
          >
            <span className="text-5xl font-bold text-white/90">{number}</span>
          </div>
        )}
        {/* Hover overlay cue for openable prototypes */}
        {(hasPage || canEmbed) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/0 transition group-hover:bg-slate-900/30">
            <span className="translate-y-1 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-black opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100">
              {t(content.prototypes.openLabel)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {prototype.tags?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {prototype.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F6F2F2] px-2 py-0.5 text-xs font-medium text-stone-600"
              >
                {t(tagLabel(tag))}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-lg font-semibold text-black">{t(prototype.title)}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          {t(prototype.description)}
        </p>

        {/* Call to action, pinned to the bottom */}
        <div className="mt-auto pt-4">
          {interactive ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
              {t(content.prototypes.openLabel)}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-400">
              {t(content.prototypes.comingSoon)}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
