import { useRef, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Store } from '../../types';
import { StoreCard } from '../../components/ui/StoreCard';
import { MiniCard } from './MiniCard';

interface MapBottomSheetProps {
  stores: Store[];
  selectedStore: Store | null;
}

const HEIGHTS = {
  collapsed: 32,
  preview: 300,
  expanded: 'calc(70vh)',
} as const;

export function MapBottomSheet({ stores, selectedStore }: MapBottomSheetProps) {
  const { bottomSheetState, setBottomSheetState } = useAppStore();
  const startY = useRef(0);
  const startHeight = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const getHeightPx = useCallback(() => {
    if (bottomSheetState === 'collapsed') return HEIGHTS.collapsed;
    if (bottomSheetState === 'preview') return HEIGHTS.preview;
    return window.innerHeight * 0.7;
  }, [bottomSheetState]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      startY.current = e.touches[0].clientY;
      startHeight.current = getHeightPx();
    },
    [getHeightPx],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaY = startY.current - e.changedTouches[0].clientY;
      const threshold = 50;

      if (deltaY > threshold) {
        if (bottomSheetState === 'collapsed') setBottomSheetState('preview');
        else if (bottomSheetState === 'preview') setBottomSheetState('expanded');
      } else if (deltaY < -threshold) {
        if (bottomSheetState === 'expanded') setBottomSheetState('preview');
        else if (bottomSheetState === 'preview') setBottomSheetState('collapsed');
      }
    },
    [bottomSheetState, setBottomSheetState],
  );

  const handleClick = () => {
    if (bottomSheetState === 'collapsed') {
      setBottomSheetState('preview');
    } else if (bottomSheetState === 'preview') {
      setBottomSheetState('expanded');
    } else {
      setBottomSheetState('preview');
    }
  };

  const heightStyle =
    bottomSheetState === 'expanded'
      ? HEIGHTS.expanded
      : `${bottomSheetState === 'collapsed' ? HEIGHTS.collapsed : HEIGHTS.preview}px`;

  return (
    <div
      ref={sheetRef}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 z-[999] flex flex-col"
      style={{ height: heightStyle }}
    >
      {/* Handle area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className="flex flex-col items-center pt-2 pb-1 w-full flex-shrink-0 cursor-pointer"
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mb-1" />
        {bottomSheetState === 'collapsed' && (
          <div className="text-xs text-gray-400">위로 스와이프</div>
        )}
      </div>

      {/* Content - only visible when not collapsed */}
      {bottomSheetState !== 'collapsed' && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {selectedStore ? (
            /* Selected store detail view — replaces list */
            <MiniCard store={selectedStore} />
          ) : (
            /* Default store list view */
            <>
              <div className="py-2 flex-shrink-0">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {stores.length}개 가게 · 거리순
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {stores.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <p className="text-sm">검색 결과가 없어요</p>
                  </div>
                ) : (
                  stores.map((store) => (
                    <StoreCard key={store.id} store={store} variant="vertical" />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
