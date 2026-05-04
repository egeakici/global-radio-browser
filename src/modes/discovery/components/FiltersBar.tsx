import { useStore } from '../../../core/store/useStore';

const POPULAR_TAGS = [
  { label: 'Pop', value: 'pop' },
  { label: 'Rock', value: 'rock' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'Classical', value: 'classical' },
  { label: 'Electronic', value: 'electronic' },
  { label: 'Hip-Hop', value: 'hiphop' },
  { label: 'News', value: 'news' },
  { label: 'Talk', value: 'talk' },
  { label: 'Folk', value: 'folk' },
  { label: 'Dance', value: 'dance' },
  { label: 'Metal', value: 'metal' },
  { label: 'R&B', value: 'rnb' },
];

export function FiltersBar() {
  const { activeTag, setActiveTag } = useStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {POPULAR_TAGS.map(tag => (
        <button
          key={tag.value}
          onClick={() => setActiveTag(activeTag === tag.value ? null : tag.value)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeTag === tag.value
              ? 'bg-accent text-white'
              : 'bg-surface-card text-muted hover:text-white border border-surface-border'
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
