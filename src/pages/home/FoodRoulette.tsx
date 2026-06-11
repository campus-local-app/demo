import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dices, Star, MapPin, ChevronRight, Plus, Check, X } from 'lucide-react';
import { stores } from '../../data/mock';
import type { Store } from '../../types';

type Filter = '전체' | '식당' | '카페' | '주점';
const filters: Filter[] = ['전체', '식당', '카페', '주점'];

const categoryEmoji: Record<string, string> = {
  식당: '🍽️',
  카페: '☕',
  주점: '🍺',
};

function getStoreEmoji(store: Store) {
  return categoryEmoji[store.category] ?? '🏪';
}

interface RouletteResult {
  storeName: string;
  storeId: string;
  menu: string;
  price: number;
  rating: number;
  distance: number;
  emoji: string;
}

const candidateStores = stores.filter((s) =>
  ['식당', '카페', '주점'].includes(s.category),
);

// 릴에 표시할 아이템 목록 생성 (선택된 가게를 반복해서 긴 리스트 만들기)
function buildReelItems(pool: Store[], totalSlots: number) {
  const items: { store: Store; menu: Store['menuItems'][number] }[] = [];
  for (let i = 0; i < totalSlots; i++) {
    const store = pool[i % pool.length];
    const menu = store.menuItems[Math.floor(Math.random() * store.menuItems.length)];
    items.push({ store, menu });
  }
  return items;
}

const ITEM_HEIGHT = 64; // px per reel item
const VISIBLE_ITEMS = 3; // 창에 보이는 항목 수 (위·가운데·아래)
const REEL_SLOTS = 40; // 릴 총 슬롯 수

export function FoodRoulette() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('전체');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<'picking' | 'spinning' | 'result'>('picking');
  const [result, setResult] = useState<RouletteResult | null>(null);

  // Reel animation state
  const [reelItems, setReelItems] = useState<
    { store: Store; menu: Store['menuItems'][number] }[]
  >([]);
  const [reelOffset, setReelOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<number>(0);

  const visibleStores = useMemo(
    () =>
      candidateStores.filter(
        (s) => filter === '전체' || s.category === filter,
      ),
    [filter],
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

  const handleSpin = useCallback(() => {
    if (selected.size < 2) return;
    const pool = selectedStores;
    const items = buildReelItems(pool, REEL_SLOTS);

    // 당첨 아이템은 릴 끝에서 가운데 위치
    const winIndex = REEL_SLOTS - 2;
    const winStore = pool[Math.floor(Math.random() * pool.length)];
    const winMenu = winStore.menuItems[Math.floor(Math.random() * winStore.menuItems.length)];
    items[winIndex] = { store: winStore, menu: winMenu };

    setReelItems(items);
    setReelOffset(0);
    setPhase('spinning');
    setIsAnimating(true);

    setResult({
      storeName: winStore.name,
      storeId: winStore.id,
      menu: winMenu.name,
      price: winMenu.price,
      rating: winStore.rating,
      distance: winStore.distance ?? 0,
      emoji: getStoreEmoji(winStore),
    });

    // 목표 offset: winIndex를 창 가운데에 맞추기
    const targetOffset = (winIndex - 1) * ITEM_HEIGHT;

    // easeOutCubic으로 약 3초간 스크롤
    const duration = 3500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart — 끝에서 자연스럽게 감속
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

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleReset = () => {
    setPhase('picking');
    setResult(null);
    setReelItems([]);
    setReelOffset(0);
  };

  return (
    <section className="px-4">
      <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Dices size={18} className="text-violet-500" />
            <h2 className="font-bold text-gray-900 text-[15px]">오늘 뭐먹지?</h2>
          </div>
          {selected.size > 0 && phase === 'picking' && (
            <button
              onClick={() => setSelected(new Set())}
              className="text-[11px] text-gray-400 flex items-center gap-0.5"
            >
              초기화
              <X size={12} />
            </button>
          )}
        </div>

        {/* Picking 단계 */}
        {phase === 'picking' && (
          <>
            <div className="flex gap-1.5 mb-3">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === f
                      ? 'bg-violet-500 text-white'
                      : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto mb-3">
              {visibleStores.map((store) => {
                const isSelected = selected.has(store.id);
                return (
                  <button
                    key={store.id}
                    onClick={() => toggleStore(store.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-violet-100 border border-violet-300'
                        : 'bg-white/70 border border-transparent'
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
                        isSelected ? 'bg-violet-500' : 'border border-gray-300'
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

            {selected.size > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedStores.map((store) => (
                  <span
                    key={store.id}
                    className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {getStoreEmoji(store)} {store.name}
                    <button onClick={() => toggleStore(store.id)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleSpin}
              disabled={selected.size < 2}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                selected.size >= 2
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed active:scale-100'
              }`}
            >
              {selected.size < 2
                ? `가게를 ${2 - selected.size}개 더 골라주세요`
                : `${selected.size}개 중 룰렛 돌리기`}
            </button>
          </>
        )}

        {/* Spinning — 세로 릴 */}
        {phase === 'spinning' && reelItems.length > 0 && (
          <div className="flex flex-col items-center py-4">
            {/* 슬롯머신 프레임 */}
            <div className="relative w-full rounded-xl bg-white border-2 border-violet-200 overflow-hidden"
              style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
            >
              {/* 위아래 그라데이션 페이드 */}
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

              {/* 가운데 하이라이트 바 */}
              <div
                className="absolute inset-x-0 z-10 border-y-2 border-violet-400 bg-violet-50/50 pointer-events-none"
                style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
              />

              {/* 릴 스트립 */}
              <div
                className="absolute inset-x-0"
                style={{
                  transform: `translateY(-${reelOffset}px)`,
                }}
              >
                {reelItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4"
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <span className="text-2xl">{getStoreEmoji(item.store)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {item.store.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{item.menu.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isAnimating && (
              <p className="text-xs text-violet-400 mt-3 animate-pulse">두구두구...</p>
            )}
          </div>
        )}

        {/* Result */}
        {phase === 'result' && result && (
          <div className="space-y-3">
            <div className="flex flex-col items-center py-3">
              <span className="text-4xl mb-1">{result.emoji}</span>
              <p className="text-xs text-violet-400 font-medium mb-1">오늘의 추천!</p>
              <p className="text-xl font-bold text-gray-900">{result.storeName}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {result.menu} · {result.price.toLocaleString()}원
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-0.5">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                {result.rating}
              </span>
              <span className="flex items-center gap-0.5">
                <MapPin size={12} />
                {result.distance}m
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl border border-violet-200 text-violet-500 text-sm font-medium active:scale-95 transition-transform"
              >
                다시 고르기
              </button>
              <button
                onClick={() => navigate(`/store/${result.storeId}`)}
                className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                가게 보기
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
