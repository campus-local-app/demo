import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Store } from '../../types';
import { StoreCard } from '../../components/ui/StoreCard';

interface MapBottomSheetProps {
  stores: Store[];
}

export function MapBottomSheet({ stores }: MapBottomSheetProps) {
  const { isBottomSheetExpanded, setBottomSheetExpanded } = useAppStore();

  const heightClass = isBottomSheetExpanded ? 'h-[70vh]' : 'h-44';

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ${heightClass} z-[999] flex flex-col`}
    >
      {/* Handle */}
      <button
        onClick={() => setBottomSheetExpanded(!isBottomSheetExpanded)}
        className="flex flex-col items-center pt-2 pb-1 w-full flex-shrink-0"
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mb-1" />
        <div className="flex items-center gap-1 text-xs text-gray-400">
          {isBottomSheetExpanded ? (
            <>
              <ChevronDown size={14} />
              <span>접기</span>
            </>
          ) : (
            <>
              <ChevronUp size={14} />
              <span>{stores.length}개 가게 보기</span>
            </>
          )}
        </div>
      </button>

      {/* Header */}
      <div className="px-4 py-2 flex-shrink-0">
        <h3 className="font-semibold text-gray-800 text-sm">
          {stores.length}개 가게 · 거리순
        </h3>
      </div>

      {/* Store list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} variant="vertical" />
        ))}
      </div>
    </div>
  );
}
