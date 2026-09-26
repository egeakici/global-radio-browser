import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Plus } from 'lucide-react';
import { useStore } from '../../../core/store/useStore';
import type { Station } from '../../../core/types';

interface Props {
  station: Station;
  anchor: HTMLElement;
  onClose: () => void;
}

const MENU_WIDTH = 224;

// Rendered in a portal so the scrolling station list and card don't clip it
export function AddToListMenu({ station, anchor, onClose }: Props) {
  const { lists, toggleInList, createList } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const isInside = (target: EventTarget | null) =>
      target instanceof Node && (menuRef.current?.contains(target) || anchor.contains(target));

    const onPointerDown = (e: PointerEvent) => { if (!isInside(e.target)) onClose(); };
    const onScroll = (e: Event) => { if (!isInside(e.target)) onClose(); };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onClose);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onClose);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchor, onClose]);

  const rect = anchor.getBoundingClientRect();
  const openUpward = rect.bottom > window.innerHeight * 0.6;
  const left = Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8));
  const position = openUpward
    ? { bottom: window.innerHeight - rect.top + 6, left }
    : { top: rect.bottom + 6, left };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const id = createList(name);
    toggleInList(id, station);
    setNewName('');
  };

  return createPortal(
    <div
      ref={menuRef}
      // Portal events still bubble through the React tree, so keep them away from the card's play handler
      onClick={e => e.stopPropagation()}
      className="fixed z-50 bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden"
      style={{ ...position, width: MENU_WIDTH }}
    >
      <p className="px-3 pt-3 pb-2 text-xs font-semibold text-muted uppercase tracking-wide">Add to list</p>

      {lists.length > 0 && (
        <div className="max-h-56 overflow-y-auto">
          {lists.map(list => {
            const inList = list.stations.some(st => st.stationuuid === station.stationuuid);
            return (
              <button
                key={list.id}
                onClick={() => toggleInList(list.id, station)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-surface-hover transition-colors text-left"
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                    inList ? 'bg-accent border-accent text-white' : 'border-surface-border'
                  }`}
                >
                  {inList && <Check size={12} strokeWidth={3} />}
                </span>
                <span className="text-sm text-white truncate flex-1">{list.name}</span>
                <span className="text-xs text-muted">{list.stations.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="p-2 border-t border-surface-border">
        <div className="flex items-center gap-2 bg-surface rounded-lg px-2.5 py-1.5">
          <Plus size={14} className="text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="New list..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
            className="bg-transparent text-sm text-white placeholder-muted outline-none w-full"
            autoFocus={lists.length === 0}
            maxLength={40}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
