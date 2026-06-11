import { useNavigate } from 'react-router-dom';
import type { Store } from '../../types';
import { StarRating } from '../../components/ui/StarRating';
import { AffiliationBadge } from '../../components/ui/AffiliationBadge';
import { benefits } from '../../data/mock';

interface MiniCardProps {
  store: Store;
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    카페: '☕',
    식당: '🍽️',
    주점: '🍺',
    생활: '🛒',
  };
  return map[category] ?? '🏪';
}

export function MiniCard({ store }: MiniCardProps) {
  const navigate = useNavigate();
  const storeBenefit = benefits.find((b) => b.storeId === store.id);

  return (
    <div className="flex flex-col gap-3">
      {/* Store info */}
      <div
        onClick={() => navigate(`/store/${store.id}`)}
        className="bg-white rounded-xl p-3 cursor-pointer active:bg-gray-50 transition-colors border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{getCategoryEmoji(store.category)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-gray-900 text-sm truncate">{store.name}</span>
              <span className="text-xs text-gray-400">{store.category}</span>
              {store.isAffiliated && <AffiliationBadge small />}
            </div>
            <div className="flex items-center gap-1.5">
              <StarRating rating={store.rating} size="sm" showNumber={false} />
              <span className="text-xs text-gray-500">{store.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">리뷰 {store.reviewCount}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{store.address}</p>
          </div>
        </div>

        {/* Benefit */}
        {storeBenefit && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-50">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
              혜택
            </span>
            <span className="text-xs text-emerald-600 truncate">{storeBenefit.title}</span>
          </div>
        )}
      </div>

      {/* Introduction */}
      {store.introduction && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">가게 인사말</p>
          <p className="text-sm text-gray-700 leading-relaxed">{store.introduction}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-gray-500 px-1">{store.description}</p>
    </div>
  );
}
