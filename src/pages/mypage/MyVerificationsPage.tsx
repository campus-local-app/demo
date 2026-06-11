import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Pen, Star } from 'lucide-react';
import { verificationHistory, stores, reviews, currentUser } from '../../data/mock';

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    카페: '☕',
    식당: '🍽️',
    주점: '🍺',
    생활: '🛒',
  };
  return map[category] ?? '🏪';
}

/** 해당 가게에 내가 리뷰를 작성했는지 */
function hasMyReview(storeId: string): boolean {
  return reviews.some((r) => r.storeId === storeId && r.userId === currentUser.id);
}

export function MyVerificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-900">인증 이력</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {verificationHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">인증 이력이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {verificationHistory.map((item) => {
              const store = stores.find((s) => s.id === item.storeId);
              if (!store) return null;
              const reviewed = hasMyReview(store.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* 가게 정보 행 */}
                  <button
                    onClick={() => navigate(`/store/${store.id}`)}
                    className="w-full flex items-center gap-3.5 px-5 py-4 text-left active:bg-gray-50 transition-colors"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{getCategoryEmoji(store.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-gray-900">{store.name}</span>
                        {store.isAffiliated && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">
                            제휴
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">{item.date}</p>
                        {store.isAffiliated ? (
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full">
                            단골 적립 가능
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-300">적립 불가</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 bg-primary-50 rounded-full px-2.5 py-1">
                      <Shield size={11} className="text-primary-500" />
                      <span className="text-xs font-bold text-primary-600">{item.discount}</span>
                    </div>
                  </button>

                  {/* 리뷰 유도 영역 */}
                  {!reviewed ? (
                    <div className="mx-4 mb-4">
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Pen size={15} className="text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-gray-800 mb-0.5">
                              {store.name} 어떠셨나요?
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              방문 경험을 나눠주시면 다른 학우들에게 도움이 돼요
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/store/${store.id}`)}
                          className="w-full mt-3 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-500 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
                        >
                          <Star size={14} className="fill-white" />
                          리뷰 쓰기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-4 mb-4">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-emerald-500 font-semibold">리뷰 작성 완료</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
