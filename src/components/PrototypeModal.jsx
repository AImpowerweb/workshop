import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { prototypeComponents } from './prototypes/registry';
import ScaledPrototype from './ScaledPrototype';

// In-site modal. Renders, in priority order:
//   1. a coded interactive component (if the prototype id is in the registry)
//   2. the local design screenshot (fallback) — never loads the Figma canvas
export default function PrototypeModal({ prototype, onClose }) {
  const { t } = useLanguage();
  const CodedPrototype = prototypeComponents[prototype.id];

  // Close on Escape; lock background scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t(prototype.title)}
    >
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-black">
              {t(prototype.title)}
            </h3>
            <p className="truncate text-xs text-slate-500">
              {t(prototype.description)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label={t(content.prototypes.close)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body — coded interactive component, else the local design screenshot */}
        <div className="relative min-h-0 flex-1 overflow-auto bg-slate-100">
          {CodedPrototype ? (
            <ScaledPrototype
              designWidth={prototype.canvas?.w}
              designHeight={prototype.canvas?.h}
              fillHeight="82vh"
            >
              <CodedPrototype onClose={onClose} />
            </ScaledPrototype>
          ) : (
            <img
              src={prototype.thumbnail}
              alt={t(prototype.title)}
              className="mx-auto h-auto w-full max-w-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
