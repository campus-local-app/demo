import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Ticket, Share2 } from 'lucide-react';
import { stores, benefits } from '../../data/mock';
import { AffiliationBadge } from '../../components/ui/AffiliationBadge';
import { StoreDetailHome } from './StoreDetailHome';
import { StoreReviews } from './StoreReviews';
import { StoreMenu } from './StoreMenu';
import { StoreInfo } from './StoreInfo';

type Tab = 'home' | 'reviews' | 'menu' | 'info';

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'reviews', label: '리뷰' },
  { id: 'menu', label: '메뉴' },
  { id: 'info', label: '정보' },
];

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const store = stores.find((s) => s.id === id);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500">가게를 찾을 수 없어요</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-500 font-medium">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto">
      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
        <span className="text-6xl">{getCategoryEmoji(store.category)}</span>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-800" />
        </button>

        {/* Share & Favorite */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={async () => {
              const text = `📍 ${store.name}\n${store.category} · ⭐ ${store.rating} (리뷰 ${store.reviewCount}개)\n${store.description}`;
              await navigator.clipboard.writeText(text);
              setShareCopied(true);
              setTimeout(() => setShareCopied(false), 1500);
            }}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
          >
            {shareCopied ? (
              <span className="text-xs">✅</span>
            ) : (
              <Share2 size={16} className="text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setIsFavorite((f) => !f)}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart
              size={18}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
              {store.isAffiliated && <AffiliationBadge />}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{store.category}</span>
              <span>·</span>
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>{store.rating.toFixed(1)}</span>
              <span className="text-gray-400">({store.reviewCount})</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{store.description}</p>

        {/* Benefits */}
        {(() => {
          const storeBenefits = benefits.filter((b) => b.storeId === store.id);
          if (storeBenefits.length === 0) return null;
          return (
            <div className="mt-3 flex flex-col gap-2">
              {storeBenefits.map((b) => (
                <div key={b.id} className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                  <Ticket size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-amber-700">{b.discount}</span>
                      <span className="text-xs text-gray-500">{b.condition}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{b.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">~{b.validUntil}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <StoreDetailHome store={store} />}
        {activeTab === 'reviews' && <StoreReviews store={store} />}
        {activeTab === 'menu' && <StoreMenu store={store} />}
        {activeTab === 'info' && <StoreInfo store={store} />}
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
