import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Ticket, Share2 } from 'lucide-react';
import { stores, benefits } from '../../data/mock';
import { AffiliationBadge } from '../../components/ui/AffiliationBadge';
import { StoreDetailHome } from './StoreDetailHome';
import { StoreReviews } from './StoreReviews';
import { StoreMenu } from './StoreMenu';
import { StoreInfo } from './StoreInfo';

type Tab = 'home' | 'reviews' | 'menu' | 'info';

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'reviews', label: '방명록' },
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
        <button onClick={() => navigate(-1)} className="mt-4 text-cy-orange font-medium font-cyworld">
          돌아가기
        </button>
      </div>
    );
  }

  const regularCount = Math.floor(store.reviewCount * 0.4);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto">
      {/* ===== Profile Header ===== */}
      <div className="bg-cy-skin px-4 py-3 border-b-2 border-cy-peach flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold text-cy-dark-brown font-cyworld truncate">{store.name}</h1>
              {store.isAffiliated && <AffiliationBadge />}
            </div>
            <div className="flex items-center gap-2 text-xs text-cy-brown font-cyworld">
              <span>{store.category}</span>
              <span className="text-cy-peach">|</span>
              <span>단골 <strong className="text-cy-orange">{regularCount}</strong>명</span>
            </div>
          </div>
          {/* Favorite & Share */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={async () => {
                const text = `📍 ${store.name}\n${store.category} · 리뷰 ${store.reviewCount}개\n${store.description}`;
                await navigator.clipboard.writeText(text);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 1500);
              }}
              className="w-8 h-8 rounded-full border-2 border-cy-peach bg-white flex items-center justify-center hover:bg-white"
            >
              {shareCopied ? (
                <span className="text-xs">✅</span>
              ) : (
                <Share2 size={14} className="text-cy-brown" />
              )}
            </button>
            <button
              onClick={() => setIsFavorite((f) => !f)}
              className="w-8 h-8 rounded-full border-2 border-cy-peach bg-white flex items-center justify-center hover:bg-white"
            >
              <Heart
                size={15}
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-cy-brown'}
              />
            </button>
          </div>
        </div>
        {/* Status message */}
        <p className="mt-2 text-sm text-cy-brown font-cyworld text-center italic">
          "{store.description}"
          <span className="cy-blink ml-1 text-cy-orange">|</span>
        </p>

        {/* Benefits */}
        {(() => {
          const storeBenefits = benefits.filter((b) => b.storeId === store.id);
          if (storeBenefits.length === 0) return null;
          return (
            <div className="mt-2 flex flex-col gap-1.5">
              {storeBenefits.map((b) => (
                <div key={b.id} className="flex items-start gap-2 bg-white/60 border border-cy-peach rounded-md px-2.5 py-2">
                  <Ticket size={14} className="text-cy-orange mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cy-orange font-cyworld">{b.discount}</span>
                      <span className="text-[10px] text-cy-brown">{b.condition}</span>
                    </div>
                    <p className="text-[10px] text-cy-brown mt-0.5">{b.description}</p>
                    <p className="text-[10px] text-cy-brown/60 mt-0.5">~{b.validUntil}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* ===== Cyworld-style Tab Nav ===== */}
      <div className="flex border-b-2 border-cy-peach bg-white flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-cyworld font-bold transition-colors border-r last:border-r-0 border-cy-peach ${
              activeTab === tab.id
                ? 'bg-cy-orange text-white'
                : 'text-cy-brown hover:bg-cy-skin'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Tab Content ===== */}
      <div className="flex-1 overflow-y-auto cy-scroll bg-white">
        {activeTab === 'home' && <StoreDetailHome store={store} />}
        {activeTab === 'reviews' && <StoreReviews store={store} />}
        {activeTab === 'menu' && <StoreMenu store={store} />}
        {activeTab === 'info' && <StoreInfo store={store} />}
      </div>
    </div>
  );
}
