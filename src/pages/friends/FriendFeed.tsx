import { useNavigate } from 'react-router-dom';
import { activityFeed, stores } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';
import type { FeedItemType } from '../../types';

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    카페: '☕', 식당: '🍽️', 주점: '🍺', 생활: '🛒',
  };
  return map[category] ?? '🏪';
}

function actionLabel(type: FeedItemType): string {
  if (type === 'visited') return '다녀왔어요';
  if (type === 'saved') return '저장했어요';
  return '평가했어요';
}

// ── FEED ──────────────────────────────────────────────────────────────────────
export function FriendFeed() {
  const navigate = useNavigate();

  return (
    <div className="bg-white divide-y divide-gray-100">
      {activityFeed.map((item) => {
        const store = stores.find((s) => s.id === item.storeId);
        if (!store) return null;

        return (
          <article
            key={item.id}
            onClick={() => navigate(`/store/${store.id}`)}
            className="p-4 active:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* ── 유저 정보 (상단) ── */}
            <div className="flex items-center gap-2 mb-2.5">
              <Avatar name={item.userName} size="sm" />
              <span className="text-sm font-semibold text-gray-800">{item.userName}</span>
              <span className="text-xs text-gray-400">{actionLabel(item.type)}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{item.timeAgo}</span>
            </div>

            {/* ── 사진 (있을 경우) ── */}
            {item.photoUrl && (
              <div className="mb-2.5 rounded-xl overflow-hidden">
                <img
                  src={item.photoUrl}
                  alt={store.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* ── 가게 정보 카드 ── */}
            <div className="border border-gray-200 rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">{getCategoryEmoji(store.category)}</span>
                <span className="font-bold text-gray-900 text-[15px] leading-tight">{store.name}</span>
                <span className="ml-auto text-xs text-gray-400">{store.category}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-7">
                {store.distance !== undefined && `${store.distance}m · `}
                {store.address.replace('서울 동대문구 ', '')}
              </p>
            </div>

            {/* ── 메모 (있을 경우) ── */}
            {item.note && (
              <p className="text-sm text-gray-600 italic leading-relaxed mt-2">
                &ldquo;{item.note}&rdquo;
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
