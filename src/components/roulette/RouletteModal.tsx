import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dices, Star, MapPin, ChevronRight, Plus, Check, X, Share2 } from 'lucide-react';
import { stores, myFavorites } from '../../data/mock';
import type { Store } from '../../types';

interface RouletteModalProps {
  open: boolean;
  onClose: () => void;
}

type Filter = '전체' | '식당' | '카페' | '주점' | '내 맛집';
const filters: Filter[] = ['전체', '식당', '카페', '주점', '내 맛집'];

const categoryEmoji: Record<string, string> = {
  식당: '🍽️',
  카페: '☕',
  주점: '🍺',
};

function getStoreEmoji(store: Store) {
  return categoryEmoji[store.category] ?? '🏪';
}

const candidateStores = stores.filter((s) =>
  ['식당', '카페', '주점'].includes(s.category),
);

const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 3;
const REEL_SLOTS = 40;

/** 각 가게의 첫 번째 메뉴를 대표 메뉴로 사용 */
function getSignatureMenu(store: Store) {
  return store.menuItems[0];
}

function buildReelItems(pool: Store[], totalSlots: number) {
  const items: Store[] = [];
  for (let i = 0; i < totalSlots; i++) {
    items.push(pool[i % pool.length]);
  }
  return items;
}

export function RouletteModal({ open, onClose }: RouletteModalProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'picking' | 'spinning' | 'result'>('picking');
  const [filter, setFilter] = useState<Filter>('전체');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reelItems, setReelItems] = useState<Store[]>([]);
  const [reelOffset, setReelOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<number>(0);

  const [resultStore, setResultStore] = useState<Store | null>(null);
  const [copied, setCopied] = useState(false);

  // Drag-to-dismiss state
  const [dragDeltaY, setDragDeltaY] = useState(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  const handleDragStart = (e: React.TouchEvent | React.PointerEvent) => {
    if (phase === 'spinning') return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = y;
    isDragging.current = true;
    setDragDeltaY(0);
  };

  const handleDragMove = (e: React.TouchEvent | React.PointerEvent) => {
    if (!isDragging.current) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = y - dragStartY.current;
    setDragDeltaY(Math.max(0, delta));
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragDeltaY > 80) {
      onClose();
    }
    setDragDeltaY(0);
  };

  const myFavoriteIds = useMemo(
    () => new Set(myFavorites.map((f) => f.storeId)),
    [],
  );

  const visibleStores = useMemo(
    () =>
      candidateStores.filter((s) =>
        filter === '전체'
          ? true
          : filter === '내 맛집'
            ? myFavoriteIds.has(s.id)
            : s.category === filter,
      ),
    [filter, myFavoriteIds],
  );

  const selectedStores = useMemo(
    () => candidateStores.filter((s) => selected.has(s.id)),
    [selected],
  );

  const toggleStore = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleSelected = visibleStores.length > 0 && visibleStores.every((s) => selected.has(s.id));

  const toggleSelectAll = () => {
    const allVisible = visibleStores.map((s) => s.id);
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        allVisible.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        allVisible.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleShare = async () => {
    if (!resultStore) return;
    const text = `🎲 오늘 뭐먹지? 룰렛 결과!\n👉 ${resultStore.name}\n⭐ ${resultStore.rating} · 📍 ${resultStore.distance}m`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setPhase('picking');
      setFilter('전체');
      setSelected(new Set());
      setReelItems([]);
      setReelOffset(0);
      setResultStore(null);
      setDragDeltaY(0);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [open]);

  const handleSpin = useCallback(() => {
    if (selected.size < 2) return;
    const pool = selectedStores;

    const items = buildReelItems(pool, REEL_SLOTS);
    const winIndex = REEL_SLOTS - 2;
    const winStore = pool[Math.floor(Math.random() * pool.length)];
    items[winIndex] = winStore;

    setReelItems(items);
    setReelOffset(0);
    setPhase('spinning');
    setIsAnimating(true);
    setResultStore(winStore);

    const targetOffset = (winIndex - 1) * ITEM_HEIGHT;
    const duration = 3500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setReelOffset(eased * targetOffset);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setTimeout(() => setPhase('result'), 400);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [selected, selectedStores]);

  const handleGoToStore = () => {
    if (resultStore) {
      onClose();
      navigate(`/store/${resultStore.id}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={phase !== 'spinning' ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[430px] max-h-[85vh] bg-white rounded-t-3xl p-5 pb-8 animate-slideUp overflow-y-auto"
        style={{
          transform: dragDeltaY > 0 ? `translateY(${dragDeltaY}px)` : undefined,
          transition: dragDeltaY > 0 ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Drag handle */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-center pt-2 pb-4 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
        >
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={phase === 'spinning'}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-40 z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-5 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              <Dices size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">오늘 뭐먹지?</h2>
              <p className="text-xs text-gray-400">
                {candidateStores.length}개 가게 중 골라서 돌리기
              </p>
            </div>
          </div>
          {selected.size > 0 && phase === 'picking' && (
            <button
              onClick={() => setSelected(new Set())}
              className="text-[11px] text-gray-400 flex items-center gap-0.5 mr-10"
            >
              초기화
              <X size={12} />
            </button>
          )}
        </div>

        {/* Picking */}
        {phase === 'picking' && (
          <div className="space-y-3">
            {/* Category filter pills */}
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Select all toggle */}
            <div className="flex justify-end">
              <button
                onClick={toggleSelectAll}
                className="text-xs text-primary-500 font-medium"
              >
                {allVisibleSelected ? '선택 해제' : '전체 선택'}
              </button>
            </div>

            {/* Store list */}
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
              {visibleStores.map((store) => {
                const isSelected = selected.has(store.id);
                return (
                  <button
                    key={store.id}
                    onClick={() => toggleStore(store.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-primary-50 border border-primary-300'
                        : 'bg-gray-50 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{getStoreEmoji(store)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {store.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {store.category} · {store.distance}m
                      </p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary-500' : 'border border-gray-300'
                      }`}
                    >
                      {isSelected ? (
                        <Check size={12} className="text-white" />
                      ) : (
                        <Plus size={12} className="text-gray-400" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected store chips */}
            {selected.size > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedStores.map((store) => (
                  <span
                    key={store.id}
                    className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {getStoreEmoji(store)} {store.name}
                    <button onClick={() => toggleStore(store.id)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Spin button */}
            <button
              onClick={handleSpin}
              disabled={selected.size < 2}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.97] ${
                selected.size >= 2
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed active:scale-100'
              }`}
            >
              {selected.size < 2
                ? `가게를 ${2 - selected.size}개 더 골라주세요`
                : `🎲 ${selected.size}개 중 룰렛 돌리기!`}
            </button>
          </div>
        )}

        {/* Spinning */}
        {phase === 'spinning' && reelItems.length > 0 && (
          <div className="flex flex-col items-center justify-center min-h-[360px]">
            <div
              className="relative w-full rounded-xl bg-gray-50 border-2 border-primary-200 overflow-hidden"
              style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
            >
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
              <div
                className="absolute inset-x-0 z-10 border-y-2 border-primary-400 bg-primary-50/50 pointer-events-none"
                style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
              />
              <div
                className="absolute inset-x-0"
                style={{ transform: `translateY(-${reelOffset}px)` }}
              >
                {reelItems.map((store, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4"
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <span className="text-2xl">{getStoreEmoji(store)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {store.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{store.category} · {store.distance}m</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {isAnimating && (
              <p className="text-sm text-primary-400 mt-4 animate-pulse font-medium">
                두구두구...🥁
              </p>
            )}
          </div>
        )}

        {/* Result */}
        {phase === 'result' && resultStore && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-4">
              <span className="text-5xl mb-2">{getStoreEmoji(resultStore)}</span>
              <p className="text-xs text-primary-500 font-semibold mb-1">🎉 오늘의 추천!</p>
              <p className="text-2xl font-bold text-gray-900">{resultStore.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-0.5">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  {resultStore.rating}
                </span>
                {resultStore.distance && (
                  <span className="flex items-center gap-0.5">
                    <MapPin size={12} />
                    {resultStore.distance}m
                  </span>
                )}
              </div>
            </div>

            {/* 대표 메뉴 참고 */}
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-[11px] font-semibold text-gray-400 mb-1.5">대표 메뉴</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{getSignatureMenu(resultStore).name}</span>
                <span className="text-sm font-medium text-gray-500">{getSignatureMenu(resultStore).price.toLocaleString()}원</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPhase('picking');
                  setReelItems([]);
                  setReelOffset(0);
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold active:scale-95 transition-transform"
              >
                다시 돌리기
              </button>
              <button
                onClick={handleGoToStore}
                className="flex-1 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                가게 보기
                <ChevronRight size={14} />
              </button>
            </div>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              {copied ? (
                <>✅ 복사 완료!</>
              ) : (
                <><Share2 size={14} /> 친구에게 공유하기</>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
