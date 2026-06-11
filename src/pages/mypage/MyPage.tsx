import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, MessageSquare, X, CheckCircle2, Shield, ChevronLeft, Stamp } from 'lucide-react';
import { currentUser, stores, reviews, benefits } from '../../data/mock';
import type { Store } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { useAppStore } from '../../store/useAppStore';

function getCategoryEmoji(category: string): string {
  switch (category) {
    case '카페': return '☕';
    case '식당': return '🍽️';
    case '주점': return '🍺';
    case '생활': return '🛒';
    default: return '🏪';
  }
}

// ── 인증 전체화면 모달 ──────────────────────────────────────────────────────────
function VerificationModal({ onClose }: { onClose: () => void }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [used, setUsed] = useState(false);

  const nearbyStores = stores
    .filter((s) => s.isAffiliated && benefits.some((b) => b.storeId === s.id))
    .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

  useEffect(() => {
    if (used) {
      const timer = setTimeout(() => onClose(), 1800);
      return () => clearTimeout(timer);
    }
  }, [used, onClose]);

  // ── 인증 완료 화면 ──
  if (used) {
    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={44} className="text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">인증 완료!</p>
          <p className="text-sm text-gray-500">할인이 적용됩니다</p>
        </div>
      </div>
    );
  }

  const benefit = selectedStore
    ? benefits.find((b) => b.storeId === selectedStore.id)
    : null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        {selectedStore ? (
          <button onClick={() => setSelectedStore(null)} className="flex items-center gap-1 text-gray-600">
            <ChevronLeft size={20} />
            <span className="text-sm">뒤로</span>
          </button>
        ) : (
          <h3 className="font-bold text-gray-900 text-lg">앱 인증 화면 제시</h3>
        )}
        <button onClick={onClose}>
          <X size={22} className="text-gray-400" />
        </button>
      </div>

      {/* 인증 카드 */}
      <div className="px-6">
        <div className="w-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Shield size={32} className="text-white" />
            </div>
            <p className="text-white/60 text-sm mb-0.5">{currentUser.university}</p>
            <p className="text-white font-bold text-2xl mb-0.5">{currentUser.name}</p>
            <p className="text-white/80 text-sm">{currentUser.department}</p>
          </div>

          <div className="bg-white/15 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">학번</p>
                <p className="text-white font-mono font-bold text-lg">{currentUser.studentId}</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-400/30 rounded-full px-4 py-2">
                <CheckCircle2 size={18} className="text-emerald-300" />
                <span className="text-white font-bold text-sm">재학생 인증완료</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단: 가게 목록 or 선택된 가게 할인 정보 */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {selectedStore && benefit ? (
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{getCategoryEmoji(selectedStore.category)}</span>
                <div>
                  <p className="font-bold text-gray-900">{selectedStore.name}</p>
                  <p className="text-xs text-gray-500">{selectedStore.distance}m</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="font-bold text-primary-600 text-lg mb-1">{benefit.discount} 할인</p>
                <p className="text-sm text-gray-700 mb-2">{benefit.description}</p>
                <p className="text-xs text-gray-400">조건: {benefit.condition}</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">이 화면을 직원에게 보여주세요</p>

            <button
              onClick={() => setUsed(true)}
              className="w-full bg-primary-500 text-white font-bold py-4 rounded-2xl active:bg-primary-600 transition-colors"
            >
              인증 완료
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 mb-3">근처 제휴 가게를 선택하세요</p>
            <div className="flex flex-col gap-2">
              {nearbyStores.map((store) => {
                const b = benefits.find((bn) => bn.storeId === store.id);
                return (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 text-left active:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">{getCategoryEmoji(store.category)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                      <p className="text-xs text-gray-400">{store.distance}m</p>
                    </div>
                    <span className="text-xs font-bold text-primary-500 shrink-0">{b?.discount}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 인증 카드 (탭하면 모달) ─────────────────────────────────────────────────────
function VerificationCard({ onTap }: { onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="w-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-white/80" />
          <h3 className="font-bold text-white">제휴 인증</h3>
        </div>
        <ChevronRight size={16} className="text-white/50" />
      </div>

      <div className="flex items-center gap-3">
        <div>
          <p className="text-white/60 text-xs">{currentUser.university}</p>
          <p className="text-white font-bold text-lg">{currentUser.name}</p>
          <p className="text-white/80 text-sm">{currentUser.department}</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <CheckCircle2 size={12} className="text-emerald-300" />
            <span className="text-white text-xs font-medium">재학생 인증완료</span>
          </div>
        </div>
      </div>

      <p className="text-white/50 text-xs mt-3">탭하여 직원에게 보여주세요</p>
    </button>
  );
}

// ── MyPage ────────────────────────────────────────────────────────────────────
export function MyPage() {
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const stampCards = useAppStore((s) => s.stampCards);

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
          <Settings size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Profile */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar name={currentUser.name} size="lg" />
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{currentUser.name}</h2>
            <p className="text-sm text-gray-500">{currentUser.department}</p>
            <p className="text-xs text-gray-400">{currentUser.university}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="text-center">
            <p className="font-bold text-gray-900 text-sm">{currentUser.studentId}</p>
            <p className="text-xs text-gray-400">학번</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-emerald-600 text-sm">인증완료</p>
            <p className="text-xs text-gray-400">재학생 인증</p>
          </div>
        </div>
      </div>

      {/* 제휴 인증 카드 */}
      <div className="mx-4 mb-4">
        <VerificationCard onTap={() => setShowVerification(true)} />
      </div>

      {/* 내 리뷰 · 단골 스탬프 링크 */}
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => navigate('/my/reviews')}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare size={16} className="text-primary-500" />
            <span className="text-sm font-semibold text-gray-900">내 리뷰</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{reviews.filter((r) => r.userId === currentUser.id).length}개</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </button>
        <button
          onClick={() => navigate('/my/stamps')}
          className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Stamp size={16} className="text-emerald-500" />
            <span className="text-sm font-semibold text-gray-900">단골 스탬프</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{stampCards.length}개</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </button>
      </div>

      {/* Settings */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        {['알림 설정', '개인정보 처리방침', '이용약관', '앱 버전 1.0.0'].map((item) => (
          <button
            key={item}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-b-0"
          >
            <span className="text-sm text-gray-700">{item}</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <VerificationModal onClose={() => setShowVerification(false)} />
      )}
    </div>
  );
}
