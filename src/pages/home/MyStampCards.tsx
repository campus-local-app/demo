import { useNavigate } from 'react-router-dom';
import { Stamp } from 'lucide-react';
import { stores, activeStampTour } from '../../data/mock';
import { useAppStore } from '../../store/useAppStore';

export function MyStampCards() {
  const navigate = useNavigate();
  const myStampCards = useAppStore((s) => s.stampCards);
  const tourStoreIds = new Set(activeStampTour.storeIds);

  return (
    <section>
      {/* Section label */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-1.5">
          <Stamp size={13} className="text-emerald-500" />
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">단골</span>
          <span className="text-xs text-gray-400">· 리뷰 쓰면 적립돼요</span>
        </div>
        <button className="text-xs text-primary-500 font-medium">전체보기</button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {myStampCards.map((card) => {
          const store = stores.find((s) => s.id === card.storeId);
          if (!store) return null;
          const remaining = card.goal - card.current;
          const isInTour = tourStoreIds.has(card.storeId);
          const isNearComplete = remaining <= 3;

          return (
            <div
              key={card.id}
              onClick={() => navigate(`/store/${store.id}`)}
              className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-sm p-4 cursor-pointer active:scale-95 transition-transform"
            >
              {/* Store name + tour badge */}
              <div className="flex items-start justify-between gap-1 mb-3">
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight truncate w-28">
                    {store.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{store.category}</p>
                </div>
                {isInTour && (
                  <span className="flex-shrink-0 text-[9px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">
                    투어
                  </span>
                )}
              </div>

              {/* Stamp grid — 5 per row */}
              <div className="grid grid-cols-5 gap-1 mb-3">
                {Array.from({ length: card.goal }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      i < card.current
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-300'
                    }`}
                  >
                    {i < card.current ? '✓' : ''}
                  </div>
                ))}
              </div>

              {/* Progress label */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold ${isNearComplete ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {isNearComplete
                    ? `${remaining}개만 더!`
                    : `${card.current}/${card.goal}`}
                </span>
                <span className="text-[10px] text-gray-400 truncate ml-1 max-w-[80px] text-right">
                  {card.reward}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add new card CTA */}
        <div
          onClick={() => navigate('/map')}
          className="flex-shrink-0 w-36 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer active:bg-gray-100 transition-colors p-4"
        >
          <span className="text-2xl">+</span>
          <span className="text-xs text-gray-400 text-center leading-tight">
            제휴 가게<br />방문하기
          </span>
        </div>
      </div>
    </section>
  );
}
