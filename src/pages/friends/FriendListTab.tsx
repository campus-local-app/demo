import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Lock, MapPin, Search } from 'lucide-react';
import {
  myFavorites,
  friendFavorites,
  stores,
  friends,
  currentUser,
} from '../../data/mock';
import type { FavoritePlace } from '../../types';

// ── view state ──────────────────────────────────────────────────────────────
type View =
  | { kind: 'names' }
  | { kind: 'detail'; userId: string; isMe: boolean };

// ── category color ring ──────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
  식당: { bg: 'bg-orange-100', text: 'text-orange-500' },
  카페: { bg: 'bg-sky-100', text: 'text-sky-500' },
  주점: { bg: 'bg-amber-100', text: 'text-amber-500' },
  생활: { bg: 'bg-emerald-100', text: 'text-emerald-500' },
};

function categoryColor(cat: string) {
  return CATEGORY_COLOR[cat] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
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

// ── Name list row ────────────────────────────────────────────────────────────
function NameRow({
  name,
  sub,
  count,
  isMe,
  onClick,
}: {
  name: string;
  sub: string;
  count: number;
  isMe: boolean;
  onClick: () => void;
}) {
  const initial = name.charAt(0);
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-emerald-100 text-emerald-600',
    'bg-rose-100 text-rose-600',
    'bg-amber-100 text-amber-600',
  ];
  const colorClass = isMe
    ? 'bg-primary-100 text-primary-600'
    : colors[name.charCodeAt(0) % colors.length];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors text-left"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${colorClass}`}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {count > 0 ? (
          <span className="text-xs font-medium text-gray-500">{count}곳</span>
        ) : (
          <span className="text-xs text-gray-300">없음</span>
        )}
        <ChevronRight size={15} className="text-gray-300" />
      </div>
    </button>
  );
}

// ── Restaurant item in detail view ───────────────────────────────────────────
function PlaceRow({ item, ownerName }: { item: FavoritePlace; ownerName: string }) {
  const navigate = useNavigate();
  const store = stores.find((s) => s.id === item.storeId);
  if (!store) return null;

  const { bg, text } = categoryColor(store.category);

  return (
    <button
      onClick={() => navigate(`/store/${store.id}`)}
      className="w-full flex items-start gap-3.5 px-4 py-4 active:bg-gray-50 transition-colors text-left"
    >
      {/* Category circle */}
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${bg}`}
      >
        <span className={text}>{getCategoryEmoji(store.category)}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-bold text-gray-900 text-sm">{store.name}</span>
          {store.isAffiliated && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">
              제휴
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
          <MapPin size={10} className="flex-shrink-0" />
          {store.distance !== undefined && `${store.distance}m · `}
          {store.address}
        </p>
        {/* 한줄평 */}
        <div className="flex items-start gap-1">
          <Lock size={9} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            <span className="text-amber-500 font-medium">{ownerName}</span>
            {' '}· {item.privateNote}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── Detail view (one person's list) ─────────────────────────────────────────
function DetailView({
  userId,
  isMe,
  onBack,
}: {
  userId: string;
  isMe: boolean;
  onBack: () => void;
}) {
  const list = isMe ? myFavorites : (friendFavorites[userId] ?? []);
  const friend = friends.find((f) => f.id === userId);
  const ownerName = isMe ? '나' : (friend?.name ?? '');
  const title = isMe ? '나의 맛집' : `${ownerName}의 맛집`;
  const sub = isMe
    ? `${currentUser.department}`
    : `${friend?.department ?? ''} · ${list.length}곳`;

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0"
        >
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <div>
          <h2 className="font-bold text-gray-900 text-base">{title}</h2>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-16 text-gray-300">
          <span className="text-4xl mb-2">🍽️</span>
          <p className="text-sm">아직 저장한 맛집이 없어요</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {list.map((item) => (
            <PlaceRow key={item.storeId} item={item} ownerName={ownerName} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Name list view ───────────────────────────────────────────────────────────
function NameListView({ onSelect }: { onSelect: (userId: string, isMe: boolean) => void }) {
  const [query, setQuery] = useState('');

  const filteredFriends = friends.filter(
    (f) => query === '' || f.name.includes(query) || f.department.includes(query),
  );

  return (
    <div className="flex flex-col bg-white min-h-full">
      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="이름으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* 나의 맛집 */}
      {query === '' && (
        <>
          <NameRow
            name="나의 맛집"
            sub={currentUser.department}
            count={myFavorites.length}
            isMe
            onClick={() => onSelect('me', true)}
          />
          <div className="h-px bg-gray-100 mx-4" />
          <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            친구
          </p>
        </>
      )}

      {/* Friend rows */}
      <div className="divide-y divide-gray-100">
        {filteredFriends.map((friend) => (
          <NameRow
            key={friend.id}
            name={friend.name}
            sub={friend.department}
            count={friendFavorites[friend.id]?.length ?? 0}
            isMe={false}
            onClick={() => onSelect(friend.id, false)}
          />
        ))}
      </div>

      {filteredFriends.length === 0 && (
        <p className="text-center text-sm text-gray-300 py-12">검색 결과가 없어요</p>
      )}
    </div>
  );
}

// ── Root export ──────────────────────────────────────────────────────────────
export function FriendListTab() {
  const [view, setView] = useState<View>({ kind: 'names' });

  if (view.kind === 'detail') {
    return (
      <DetailView
        userId={view.userId}
        isMe={view.isMe}
        onBack={() => setView({ kind: 'names' })}
      />
    );
  }

  return (
    <NameListView
      onSelect={(userId, isMe) => setView({ kind: 'detail', userId, isMe })}
    />
  );
}
