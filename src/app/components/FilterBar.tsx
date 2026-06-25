import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  flavorFilter: string;
  setFlavorFilter: (v: string) => void;
  stateFilter: string;
  setStateFilter: (v: string) => void;
  tagFilter: string;
  setTagFilter: (v: string) => void;
  flavors: string[];
  states: string[];
  tags: string[];
}

export function FilterBar({
  search, setSearch,
  flavorFilter, setFlavorFilter,
  stateFilter, setStateFilter,
  tagFilter, setTagFilter,
  flavors, states, tags,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = !!(flavorFilter || stateFilter);
  const activeCount = [flavorFilter, stateFilter].filter(Boolean).length;

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B6558' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search shops, flavors, cities…"
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border outline-none transition-colors text-sm"
          style={{
            background: '#FDF0E8',
            color: '#1C0E0A',
            fontFamily: 'var(--font-body)',
            borderColor: search ? '#C1415A' : 'rgba(139,101,88,0.2)',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} color="#8B6558" />
          </button>
        )}
      </div>

      {/* Filter toggle + clear */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
          style={{
            background: showFilters || hasActiveFilters ? '#C1415A' : '#F5EAE0',
            color: showFilters || hasActiveFilters ? '#fff' : '#8B6558',
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.3)' }}>
              {activeCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={() => { setFlavorFilter(''); setStateFilter(''); }}
            className="text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{ background: '#FDE8EF', color: '#C1415A' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Expandable dropdowns */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8B6558' }}>Flavor</label>
            <CustomSelect
              value={flavorFilter}
              onChange={setFlavorFilter}
              placeholder="All flavors"
              options={flavors.map(f => ({ value: f, label: f }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8B6558' }}>State</label>
            <CustomSelect
              value={stateFilter}
              onChange={setStateFilter}
              placeholder="All states"
              options={states.map(s => ({ value: s, label: s }))}
            />
          </div>
        </div>
      )}

      {/* Hashtag chips — always visible, horizontally scrollable */}
      {tags.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          <HashChip label="All" active={!tagFilter} onClick={() => setTagFilter('')} />
          {tags.map(t => (
            <HashChip
              key={t}
              label={`#${t}`}
              active={tagFilter === t}
              onClick={() => setTagFilter(tagFilter === t ? '' : t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HashChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? '#1C0E0A' : '#F5EAE0',
        color: active ? '#FFF8F2' : '#8B6558',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
