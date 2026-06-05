import { useNavigate } from 'react-router-dom';
import type { Store } from '../../types';
import { AffiliationBadge } from './AffiliationBadge';
import { StarRating } from './StarRating';

interface StoreCardProps {
  store: Store;
  variant?: 'horizontal' | 'vertical';
}

export function StoreCard({ store, variant = 'vertical' }: StoreCardProps) {
  const navigate = useNavigate();

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => navigate(`/store/${store.id}`)}
        className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform"
      >
        <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-3xl">{getCategoryEmoji(store.category)}</span>
        </div>
        <div className="p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs font-semibold text-gray-800 truncate">{store.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={store.rating} size="sm" showNumber={false} />
            <span className="text-xs text-gray-500">{store.rating.toFixed(1)}</span>
            {store.isAffiliated && <AffiliationBadge small />}
          </div>
          {store.distance !== undefined && (
            <p className="text-xs text-gray-400 mt-0.5">{store.distance}m</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/store/${store.id}`)}
      className="bg-white rounded-xl shadow-sm p-4 cursor-pointer active:bg-gray-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xl">{getCategoryEmoji(store.category)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-gray-900 truncate">{store.name}</span>
            {store.isAffiliated && <AffiliationBadge small />}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <StarRating rating={store.rating} />
            <span>리뷰 {store.reviewCount}</span>
            {store.distance !== undefined && <span>{store.distance}m</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{store.address}</p>
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    카페: '☕',
    식당: '🍽️',
    주점: '🍺',
    생활: '🛒',
    제휴: '🤝',
    전체: '🏪',
  };
  return map[category] ?? '🏪';
}
