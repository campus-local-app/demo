import { useNavigate } from 'react-router-dom';
import { activityFeed, stores } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';
import type { FeedItemType } from '../../types';

// ── soft photo bg per category (셋로그 감성 — 파스텔, 그라디언트 X) ──────────
function getCategoryBg(category: string): string {
  const map: Record<string, string> = {
    카페: 'bg-sky-50',
    식당: 'bg-orange-50',
    주점: 'bg-amber-50',
    생활: 'bg-emerald-50',
  };
  return map[category] ?? 'bg-gray-50';
}

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
            {/* ── "photo" slot — 셀로판지처럼 부드러운 파스텔 박스 ── */}
            <div
              className={`w-full h-48 rounded-2xl mb-3 flex items-center justify-center ${getCategoryBg(store.category)}`}
            >
              <span className="text-6xl select-none">{getCategoryEmoji(store.category)}</span>
            </div>

            {/* ── store info ── */}
            <p className="font-bold text-gray-900 text-base leading-tight">
              {store.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 mb-2">
              {store.category}
              {store.distance !== undefined && ` · ${store.distance}m`}
              {' · '}{store.address.replace('서울 동대문구 ', '')}
            </p>

            {/* ── note (diary caption) ── */}
            {item.note && (
              <p className="text-sm text-gray-600 italic leading-relaxed mb-3">
                &ldquo;{item.note}&rdquo;
              </p>
            )}

            {/* ── attribution — 사진 하단 메타처럼 ── */}
            <div className="flex items-center gap-2">
              <Avatar name={item.userName} size="sm" />
              <span className="text-xs font-medium text-gray-700">{item.userName}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{actionLabel(item.type)}</span>
              <span className="text-xs text-gray-300 ml-auto">{item.timeAgo}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
