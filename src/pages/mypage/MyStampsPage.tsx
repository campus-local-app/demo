import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stamp } from 'lucide-react';
import { stores, activeStampTour } from '../../data/mock';
import { useAppStore } from '../../store/useAppStore';

export function MyStampsPage() {
  const navigate = useNavigate();
  const myStampCards = useAppStore((s) => s.stampCards);
  const tourStoreIds = new Set(activeStampTour.storeIds);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-900">단골 스탬프</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          {myStampCards.map((card) => {
            const store = stores.find((s) => s.id === card.storeId);
            if (!store) return null;
            const remaining = card.goal - card.current;
            const isInTour = tourStoreIds.has(card.storeId);
            const isNearComplete = remaining <= 3;

            return (
              <button
                key={card.id}
                onClick={() => navigate(`/store/${store.id}`)}
                className="bg-white rounded-2xl shadow-sm p-5 text-left active:bg-gray-50 transition-colors"
              >
                {/* Store name + tour badge */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{store.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{store.category}</p>
                  </div>
                  {isInTour && (
                    <span className="text-[10px] font-bold bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">
                      투어
                    </span>
                  )}
                </div>

                {/* Stamp grid — 5 per row */}
                <div className="grid grid-cols-10 gap-1.5 mb-3">
                  {Array.from({ length: card.goal }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        i < card.current
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-300'
                      }`}
                    >
                      {i < card.current ? '✓' : ''}
                    </div>
                  ))}
                </div>

                {/* Progress + reward */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stamp size={12} className="text-emerald-500" />
                    <span className={`text-xs font-semibold ${isNearComplete ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {isNearComplete ? `${remaining}개만 더!` : `${card.current}/${card.goal}`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{card.reward}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/map')}
          className="w-full mt-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl py-5 flex flex-col items-center gap-1.5 active:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm text-gray-400">제휴 가게 방문하기</span>
        </button>
      </div>
    </div>
  );
}
