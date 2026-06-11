import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, ChevronRight } from 'lucide-react';
import { editorPicks, stores } from '../../data/mock';

export function EditorPicksSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  // pickId → storeId 로 투표 기록
  const [votedMap, setVotedMap] = useState<Record<string, string>>({});

  const handleVote = (pickId: string, storeId: string) => {
    if (votedMap[pickId]) return;
    setVotedMap((prev) => ({ ...prev, [pickId]: storeId }));
  };

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-1.5">
          <Vote size={16} className="text-blue-500" />
          <h2 className="font-bold text-gray-900 text-[15px]">이번 주 투표</h2>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', paddingLeft: 20, paddingRight: 20 }}
      >
        {editorPicks.map((pick) => {
          const myVote = votedMap[pick.id] ?? null;
          const adjustedTotal = pick.totalVotes + (myVote ? 1 : 0);

          return (
            <div
              key={pick.id}
              className="flex-shrink-0 w-[65vw] max-w-64 rounded-2xl overflow-hidden shadow-sm"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* 상단 컬러 카드 */}
              <div
                className={`bg-gradient-to-br ${pick.bgColor} p-4 pb-5 text-white relative`}
              >
                <span className="text-3xl absolute top-3 right-3 opacity-40">
                  {pick.emoji}
                </span>
                <p className="text-[10px] font-medium opacity-75 mb-0.5">
                  {pick.week}
                </p>
                <h3 className="text-[15px] font-bold leading-snug whitespace-pre-line">
                  {pick.title}
                </h3>
                <p className="text-[11px] opacity-80 mt-1">{pick.subtitle}</p>
              </div>

              {/* 가게 목록 = 투표 선택지 */}
              <div className="bg-white">
                {pick.stores.map((opt, i) => {
                  const store = stores.find((s) => s.id === opt.storeId);
                  if (!store) return null;

                  const votes = opt.votes + (myVote === opt.storeId ? 1 : 0);
                  const pct =
                    adjustedTotal > 0
                      ? Math.round((votes / adjustedTotal) * 100)
                      : 0;
                  const isMyVote = myVote === opt.storeId;
                  const showResults = !!myVote;

                  return (
                    <button
                      key={opt.storeId}
                      onClick={() => handleVote(pick.id, opt.storeId)}
                      className={`relative w-full text-left transition-all ${
                        i < pick.stores.length - 1
                          ? 'border-b border-gray-50'
                          : ''
                      } ${isMyVote ? 'ring-1 ring-inset ring-blue-300' : ''}`}
                    >
                      {/* 투표 결과 바 */}
                      {showResults && (
                        <div
                          className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out ${
                            isMyVote ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}

                      <div className="relative flex items-center gap-2.5 px-4 py-3">
                        <span className="text-sm font-medium text-gray-400 w-4">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {store.name}
                            </p>
                            {isMyVote && (
                              <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                                투표함
                              </span>
                            )}
                          </div>
                          {!showResults && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {store.distance}m · {store.category}
                            </p>
                          )}
                        </div>
                        {showResults ? (
                          <span className="text-sm font-bold text-gray-600">
                            {pct}%
                          </span>
                        ) : (
                          <ChevronRight size={14} className="text-gray-300" />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* 하단 참여자 수 + 가게 보기 */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50">
                  <span className="text-[11px] text-gray-400">
                    {adjustedTotal.toLocaleString()}명 참여
                  </span>
                  {myVote && (
                    <button
                      onClick={() => navigate(`/store/${myVote}`)}
                      className="text-[11px] text-blue-500 font-medium flex items-center gap-0.5"
                    >
                      가게 보기
                      <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
