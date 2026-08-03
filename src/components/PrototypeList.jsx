import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { prototypes, groupings } from '../data/prototypes';
import PrototypeCard from './PrototypeCard';
import PrototypeControls from './PrototypeControls';
import PrototypeModal from './PrototypeModal';

export default function PrototypeList() {
  const { t } = useLanguage();
  const [groupBy, setGroupBy] = useState(groupings[0]?.id ?? 'none'); // default: use scenario
  const [activeTags, setActiveTags] = useState([]);
  const [activePrototype, setActivePrototype] = useState(null); // opened in modal

  // Cards to show (some prototypes are embedded in another prototype's page
  // rather than shown as their own card — those are marked `hidden`).
  const visible = useMemo(() => prototypes.filter((p) => !p.hidden), []);

  // Stable card number/gradient regardless of grouping or filtering.
  const indexById = useMemo(
    () => Object.fromEntries(visible.map((p, i) => [p.id, i])),
    [visible],
  );

  // All tags across visible prototypes, in first-seen order.
  const allTags = useMemo(() => {
    const set = new Set();
    visible.forEach((p) => (p.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [visible]);

  // How many cards each tag matches — shown on the filter chips.
  const tagCounts = useMemo(() => {
    const counts = {};
    visible.forEach((p) => (p.tags || []).forEach((tag) => {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }));
    return counts;
  }, [visible]);

  // Tag filter (OR semantics: keep prototypes matching any active tag).
  const filtered = useMemo(() => {
    if (activeTags.length === 0) return visible;
    return visible.filter((p) =>
      (p.tags || []).some((tag) => activeTags.includes(tag)),
    );
  }, [activeTags, visible]);

  // Group the filtered prototypes by the selected dimension.
  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ key: 'all', label: null, items: filtered }];
    const map = new Map();
    filtered.forEach((p) => {
      const facet = p[groupBy];
      const key = facet?.key ?? 'unsorted';
      if (!map.has(key)) map.set(key, { key, label: facet ?? null, items: [] });
      map.get(key).items.push(p);
    });
    return Array.from(map.values());
  }, [groupBy, filtered]);

  const toggleTag = (tag) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
    );
  const clearTags = () => setActiveTags([]);

  return (
    <section id="prototypes" className="border-t border-slate-100 bg-[#F6F2F2]/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            {t(content.prototypes.sectionTitle)}
          </h2>
          <p className="mt-3 text-slate-600">
            {t(content.prototypes.sectionSubtitle)}
          </p>
        </div>

        <PrototypeControls
          groupings={groupings}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          tags={allTags}
          tagCounts={tagCounts}
          totalCount={visible.length}
          activeTags={activeTags}
          onToggleTag={toggleTag}
          onClearTags={clearTags}
        />

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-slate-500">
            {t(content.prototypes.emptyState)}
          </p>
        ) : (
          <div className="space-y-12">
            {groups.map((group) => (
              <div key={group.key}>
                {group.label && (
                  <div className="mb-5 flex items-baseline gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-black">
                      {t(group.label)}
                    </h3>
                    <span className="text-sm text-slate-400">
                      {group.items.length} {t(content.prototypes.countLabel)}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((prototype) => (
                    <PrototypeCard
                      key={prototype.id}
                      prototype={prototype}
                      index={indexById[prototype.id]}
                      onOpen={setActivePrototype}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activePrototype && (
        <PrototypeModal
          prototype={activePrototype}
          onClose={() => setActivePrototype(null)}
        />
      )}
    </section>
  );
}
