import { useNavigate } from 'react-router-dom';
import { Gift, Zap } from 'lucide-react';
import { activeStampTour, stores } from '../../data/mock';

function dday(dateStr: string): string {
  const today = new Date('2025-05-31');
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `D-${diff}` : 'D-DAY';
}

export function StampTourBanner() {
  const navigate = useNavigate();
  const tour = activeStampTour;
  const visited = tour.visitedStoreIds.length;
  const total = tour.storeIds.length;
  const remaining = total - visited;

  return (
    <section className="px-4">
      {/* Section label */}
      <div className="flex items-center gap-1.5 mb-2">
        <Zap size={13} className="text-violet-500" />
        <span className="text-xs font-bold text-violet-500 uppercase tracking-wide">행사</span>
        <span className="text-xs text-gray-400">· 지금 참여하세요</span>
      </div>

      <div
        className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-5 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => navigate('/school')}
      >
        {/* Background circles */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute right-4 -bottom-10 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />

        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tour.emoji}</span>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">{tour.title}</h3>
              <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                <Gift size={10} />
                {tour.prize}
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
            {dday(tour.endDate)}
          </span>
        </div>

        {/* Stamp dots */}
        <div className="flex gap-2 mb-3">
          {tour.storeIds.map((storeId, i) => {
            const store = stores.find((s) => s.id === storeId);
            const isVisited = tour.visitedStoreIds.includes(storeId);
            return (
              <div key={storeId} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base border-2 transition-all ${
                    isVisited
                      ? 'bg-white border-white shadow-md'
                      : 'bg-white/20 border-white/40'
                  }`}
                >
                  {isVisited ? (
                    <span>{getStoreEmoji(store?.category ?? '')}</span>
                  ) : (
                    <span className="text-white/50 text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                <span className={`text-[9px] leading-tight text-center w-10 truncate ${isVisited ? 'text-white' : 'text-white/40'}`}>
                  {store?.name.replace('이문동 ', '').replace('외대 ', '').replace('회기 ', '') ?? ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(visited / total) * 100}%` }}
          />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <p className="text-white/80 text-xs">
            {visited}/{total} 방문 완료
            {remaining > 0 && (
              <span className="text-white font-semibold"> · {remaining}곳 남았어요</span>
            )}
          </p>
          <p className="text-white/60 text-[10px]">
            방문 시 단골 스탬프 동시 적립 ↗
          </p>
        </div>
      </div>
    </section>
  );
}

function getStoreEmoji(category: string): string {
  const map: Record<string, string> = { 카페: '☕', 식당: '🍽️', 주점: '🍺', 생활: '🛒' };
  return map[category] ?? '🏪';
}
