import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { tagLabel } from '../data/prototypes';

// Controls above the prototype grid:
//   • "Organize by" — switches the grouping dimension (default: use scenario)
//   • "Filter by function" — narrows the visible set by what the AI does;
//     each chip carries the number of cards it matches.
export default function PrototypeControls({
  groupings,
  groupBy,
  onGroupByChange,
  tags,
  tagCounts = {},
  totalCount = 0,
  activeTags,
  onToggleTag,
  onClearTags,
}) {
  const { t } = useLanguage();

  // min-h-[44px] on phones meets the 44px touch-target guidance; from `sm:` up
  // the pointer is a mouse and the original compact sizing returns.
  const segment = (active) =>
    `inline-flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:min-h-0 sm:py-1.5 ${
      active ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-800'
    }`;

  const chip = (active) =>
    `inline-flex min-h-[44px] items-center rounded-full border px-3.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:min-h-0 sm:py-1 ${
      active
        ? 'border-brand-600 bg-brand-600 text-white'
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-black'
    }`;

  return (
    <div className="mb-10 space-y-4">
      {/* Organize by */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-500">
          {t(content.prototypes.organizeBy)}
        </span>
        <div className="inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-0.5">
          {groupings.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onGroupByChange(g.id)}
              aria-pressed={groupBy === g.id}
              className={segment(groupBy === g.id)}
            >
              {t(g.label)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onGroupByChange('none')}
            aria-pressed={groupBy === 'none'}
            className={segment(groupBy === 'none')}
          >
            {t(content.prototypes.ungrouped)}
          </button>
        </div>
      </div>

      {/* Filter by function — each chip shows how many cards it matches */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-slate-500">
            {t(content.prototypes.filterByTag)}
          </span>
          <button
            type="button"
            onClick={onClearTags}
            aria-pressed={activeTags.length === 0}
            className={chip(activeTags.length === 0)}
          >
            {t(content.prototypes.allTags)}
            <span className="ml-1.5 tabular-nums opacity-50">{totalCount}</span>
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              aria-pressed={activeTags.includes(tag)}
              className={chip(activeTags.includes(tag))}
            >
              {t(tagLabel(tag))}
              <span className="ml-1.5 tabular-nums opacity-50">{tagCounts[tag] ?? 0}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
