import { useState } from 'react';
import { Settings, ChevronRight, ChevronLeft, MapPin, X, QrCode, ScanLine, CheckCircle2 } from 'lucide-react';
import { currentUser, stores, benefits } from '../../data/mock';
import type { Store } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { MyStampCards } from '../home/MyStampCards';

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = { 카페: '☕', 식당: '🍽️', 주점: '🍺', 생활: '🛒' };
  return map[category] ?? '🏪';
}

// ── 할인 사용 모달 ─────────────────────────────────────────────────────────────
function DiscountUsageModal({
  initialStore,
  onClose,
}: {
  initialStore?: Store;
  onClose: () => void;
}) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(initialStore ?? null);
  const [used, setUsed] = useState(false);

  const nearbyStores = stores
    .filter((s) => s.isAffiliated && s.distance !== undefined)
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));

  const benefit = selectedStore ? benefits.find((b) => b.storeId === selectedStore.id) : null;

  function handleUse() {
    setUsed(true);
    setTimeout(onClose, 1800);
  }

  /* 사용 완료 화면 */
  if (used) {
    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </div>
        <p className="font-bold text-gray-900 text-xl">할인 사용 완료!</p>
        <p className="text-sm text-gray-400">{selectedStore?.name}에서 할인이 적용됐어요</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-14 pb-4">
        {selectedStore && !initialStore && (
          <button onClick={() => setSelectedStore(null)} className="text-gray-400 -ml-1">
            <ChevronLeft size={22} />
          </button>
        )}
        <h3 className="font-bold text-gray-900 text-lg flex-1">학생증 제시</h3>
        <button onClick={onClose}>
          <X size={22} className="text-gray-400" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* 학생 인증 카드 */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 mb-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white/60 text-xs mb-1">{currentUser.university}</p>
              <p className="text-white font-bold text-2xl leading-tight">{currentUser.name}</p>
              <p className="text-white/80 text-sm mt-1">{currentUser.department}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs mb-1">학번</p>
              <p className="text-white font-mono font-semibold">{currentUser.studentId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 w-fit">
            <CheckCircle2 size={14} className="text-emerald-300" />
            <span className="text-white text-sm font-medium">재학생 인증완료</span>
          </div>
        </div>

        {selectedStore ? (
          /* 선택된 가게 — 할인 정보 */
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                {getCategoryEmoji(selectedStore.category)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">{selectedStore.name}</p>
                <p className="text-xs text-gray-400">{selectedStore.distance}m · {selectedStore.category}</p>
              </div>
            </div>
            {benefit && (
              <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 flex-1 pr-3">{benefit.description}</span>
                  <span className="font-bold text-primary-600 text-2xl flex-shrink-0">{benefit.discount}</span>
                </div>
                <p className="text-xs text-gray-400">조건: {benefit.condition}</p>
              </div>
            )}
          </div>
        ) : (
          /* 가게 선택 */
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">사용할 가게 선택</p>
            <div className="flex flex-col gap-2">
              {nearbyStores.map((store) => {
                const storeBenefit = benefits.find((b) => b.storeId === store.id);
                if (!storeBenefit) return null;
                return (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5 text-left active:bg-gray-100 transition-colors"
                  >
                    <span className="text-xl">{getCategoryEmoji(store.category)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{store.name}</p>
                      <p className="text-xs text-gray-400">{store.distance}m · {storeBenefit.discount}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 사용완료 버튼 — 가게 선택됐을 때만 */}
      {selectedStore && (
        <div className="px-6 pb-10 pt-2 border-t border-gray-100">
          <button
            onClick={handleUse}
            className="w-full bg-primary-500 text-white rounded-2xl py-4 font-bold text-base"
          >
            사용완료
          </button>
        </div>
      )}
    </div>
  );
}

// ── 제휴 할인 카드 ─────────────────────────────────────────────────────────────
function StudentQRCard({
  onShowId,
  onUseAtStore,
}: {
  onShowId: () => void;
  onUseAtStore: (store: Store) => void;
}) {
  const [alertDismissed, setAlertDismissed] = useState(false);

  const detectedStore = stores.find((s) => s.id === 's1')!;
  const detectedBenefit = benefits.find((b) => b.storeId === detectedStore.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <QrCode size={15} className="text-primary-500" />
          <h3 className="font-bold text-gray-900">제휴 할인</h3>
        </div>
        <button onClick={onShowId} className="text-xs text-primary-500 font-medium">
          학생증 보기
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-3">QR을 직원에게 보여주면 즉시 할인 적용</p>

      {/* 위치 기반 알림 */}
      {!alertDismissed && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs font-bold text-primary-600">근처 제휴 가게 감지됨</p>
                <span className="text-[10px] bg-primary-100 text-primary-500 px-1.5 py-0.5 rounded-full font-medium">
                  {detectedStore.distance}m
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{detectedStore.name}</p>
              {detectedBenefit && (
                <p className="text-xs text-gray-500">{detectedBenefit.description}</p>
              )}
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="flex-shrink-0 text-gray-300 hover:text-gray-400"
            >
              <X size={14} />
            </button>
          </div>
          <button
            onClick={() => onUseAtStore(detectedStore)}
            className="mt-2.5 w-full bg-primary-500 text-white rounded-lg py-2 text-xs font-semibold"
          >
            사용하기
          </button>
        </div>
      )}

      {/* 학생증 표시 단축 버튼 */}
      <button
        onClick={onShowId}
        className="w-full bg-primary-500 text-white rounded-xl py-3 text-sm font-semibold"
      >
        학생증 제시하기
      </button>
    </div>
  );
}

// ── 매장 QR 스캔 (도장 적립용) ────────────────────────────────────────────────
type ScanState = 'idle' | 'scanning' | 'done';

function StampScanCard() {
  const [scanState, setScanState] = useState<ScanState>('idle');

  function handleScan() {
    setScanState('scanning');
    setTimeout(() => setScanState('done'), 1500);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <ScanLine size={15} className="text-amber-500" />
        <h3 className="font-bold text-gray-900">도장 적립</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">매장에 있는 QR을 스캔하면 도장이 쌓여요</p>

      {scanState === 'idle' && (
        <button
          onClick={handleScan}
          className="w-full flex flex-col items-center justify-center h-28 bg-amber-50 rounded-xl border-2 border-dashed border-amber-200 gap-2"
        >
          <ScanLine size={28} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-600">매장 QR 스캔하기</span>
        </button>
      )}

      {scanState === 'scanning' && (
        <div className="flex flex-col items-center justify-center h-28 bg-amber-50 rounded-xl gap-2">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 rounded-tl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 rounded-br" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-0.5 bg-amber-400 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-amber-600 font-medium animate-pulse">스캔 중...</p>
        </div>
      )}

      {scanState === 'done' && (
        <div className="flex flex-col items-center h-28 justify-center gap-2 bg-emerald-50 rounded-xl">
          <CheckCircle2 size={32} className="text-emerald-500" />
          <p className="text-sm font-bold text-emerald-700">도장 적립 완료!</p>
          <button onClick={() => setScanState('idle')} className="text-xs text-gray-400 underline">
            다시 스캔
          </button>
        </div>
      )}
    </div>
  );
}

// ── MyPage ────────────────────────────────────────────────────────────────────
export function MyPage() {
  const [modalStore, setModalStore] = useState<Store | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  function openWithStore(store: Store) {
    setModalStore(store);
    setShowModal(true);
  }

  function openWithoutStore() {
    setModalStore(undefined);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

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

      {/* 제휴 할인 + 도장 스캔 */}
      <div className="mx-4 flex flex-col gap-3 mb-4">
        <StudentQRCard onShowId={openWithoutStore} onUseAtStore={openWithStore} />
        <StampScanCard />
      </div>

      {/* 단골 스탬프 */}
      <div className="mb-4">
        <MyStampCards />
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

      {showModal && (
        <DiscountUsageModal initialStore={modalStore} onClose={closeModal} />
      )}
    </div>
  );
}
