import { useState, useEffect } from 'react';
import type { Store, Review } from '../../types';
import { reviews as mockReviews } from '../../data/mock';
import { ThumbsUp, Pen, X, CheckCircle2 } from 'lucide-react';
import { useAppStore, type AddStampResult } from '../../store/useAppStore';

interface StoreReviewsProps {
  store: Store;
}

const REVIEW_TAGS = ['가성비', '양많음', '맛있음', '친절함', '분위기좋음', '웨이팅', '깔끔함', '혼밥가능'];

const NOTE_DECORATIONS = [
  { type: 'tape-left' as const },
  { type: 'clip' as const },
  { type: 'tape-right' as const },
  { type: 'pin' as const },
] as const;

const NOTE_ROTATIONS = ['0.4deg', '-0.3deg', '0.2deg', '-0.5deg', '0.3deg', '-0.2deg'];

export function StoreReviews({ store }: StoreReviewsProps) {
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [stampResult, setStampResult] = useState<AddStampResult | null>(null);
  const addStamp = useAppStore((s) => s.addStamp);

  const storeReviews = [
    ...mockReviews.filter((r) => r.storeId === store.id),
    ...localReviews,
  ];

  const sorted = [...storeReviews].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const handleSubmitReview = (review: Review) => {
    const result = addStamp(store.id);
    setLocalReviews((prev) => [...prev, { ...review, visitCount: result.newCount }]);
    setShowModal(false);
    setStampResult(result);
  };

  useEffect(() => {
    if (!stampResult) return;
    const timer = setTimeout(() => setStampResult(null), 2000);
    return () => clearTimeout(timer);
  }, [stampResult]);

  return (
    <div className="relative">
      {/* Stamp celebration overlay */}
      {stampResult && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-cy-orange rounded-xl p-8 flex flex-col items-center gap-3 shadow-cy-window animate-in fade-in zoom-in mx-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${stampResult.completed ? 'bg-cy-skin' : 'bg-cy-skin'}`}>
              <CheckCircle2 size={36} className={stampResult.completed ? 'text-cy-orange' : 'text-cy-coral'} />
            </div>
            <p className="text-lg font-bold text-cy-dark-brown font-cyworld">
              {stampResult.completed ? '보상 획득!' : '스탬프 적립!'}
            </p>
            <p className="text-2xl font-bold text-cy-orange font-cyworld">
              {stampResult.newCount}/{stampResult.goal}
            </p>
            {stampResult.completed && (
              <p className="text-sm font-bold text-cy-orange bg-cy-skin px-3 py-1 rounded-full border border-cy-peach font-cyworld">
                {stampResult.reward}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="px-4 py-4 pb-20">
        {sorted.length === 0 ? (
          <p className="text-sm text-cy-brown text-center py-8 font-cyworld">아직 방명록이 없어요 ✏️</p>
        ) : (
          <div className="relative ml-3">
            {/* Timeline line */}
            <div className="absolute left-0 top-2 bottom-2 w-px border-l border-dashed border-cy-peach" />

            {sorted.map((review, idx) => {
              const deco = NOTE_DECORATIONS[idx % NOTE_DECORATIONS.length];
              const rotation = NOTE_ROTATIONS[idx % NOTE_ROTATIONS.length];
              return (
                <div key={review.id} className="relative pl-6 pb-6 last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-3 w-2.5 h-2.5 rounded-full bg-cy-orange border-2 border-cy-cream -translate-x-[5px] z-10" />

                  {/* Date label */}
                  <p className="text-[10px] text-cy-brown/50 font-cyworld mb-1.5 pl-1">{review.date}</p>

                  {/* Note card */}
                  <div
                    className="cy-note"
                    style={{ transform: `rotate(${rotation})` }}
                  >
                    {/* Decoration */}
                    {deco.type === 'tape-left' && <div className="cy-note-tape cy-note-tape-left" />}
                    {deco.type === 'tape-right' && <div className="cy-note-tape cy-note-tape-right" />}
                    {deco.type === 'clip' && <span className="cy-note-clip">📎</span>}
                    {deco.type === 'pin' && <span className="cy-note-pin">📌</span>}

                    {/* Author line */}
                    <p className="text-[10px] text-cy-brown/60 font-cyworld mb-2">
                      {review.userName} · {review.userDepartment}
                      {review.visitCount ? ` · ${review.visitCount}번째 방문` : ''}
                    </p>

                    {/* Content - handwritten feel */}
                    <p className="text-sm text-cy-dark-brown font-cyworld leading-[24px]">
                      {review.content}
                    </p>

                    {/* Tags + Likes */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {review.tags.length > 0 &&
                        review.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-cy-orange/80 font-cyworld">
                            #{tag}
                          </span>
                        ))}
                      <button className="flex items-center gap-0.5 text-[10px] text-cy-brown/40 font-cyworld ml-auto hover:text-cy-orange transition-colors">
                        <ThumbsUp size={9} />
                        {review.likes}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-cy-orange text-white rounded-full shadow-cy-window flex items-center justify-center hover:bg-cy-coral transition-colors z-30"
      >
        <Pen size={20} />
      </button>

      {/* Review Modal */}
      {showModal && (
        <ReviewModal
          storeId={store.id}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}

function ReviewModal({
  storeId,
  onClose,
  onSubmit,
}: {
  storeId: string;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}) {
  const [department, setDepartment] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const canSubmit = department.trim() && content.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    const today = new Date().toISOString().slice(0, 10);
    const anonNumber = Math.floor(Math.random() * 9000) + 1000;
    onSubmit({
      id: `local-${Date.now()}`,
      storeId,
      userId: 'local-user',
      userName: `익명 부#${anonNumber}`,
      userDepartment: department.trim(),
      rating: 0,
      content: content.trim(),
      tags: selectedTags,
      date: today,
      likes: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-[430px] rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto border-t-2 border-x-2 border-cy-orange">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cy-dark-brown font-cyworld">✏️ 방명록 작성</h3>
          <button onClick={onClose} className="p-1 text-cy-brown hover:text-cy-orange">
            <X size={20} />
          </button>
        </div>

        {/* Anonymous label */}
        <div className="mb-3 cy-inset-panel px-3 py-2">
          <p className="text-xs text-cy-brown font-cyworld">익명 부#으로 자동 게시됩니다</p>
        </div>

        {/* Department */}
        <div className="mb-3">
          <label className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1 block">학과</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="학과를 입력하세요"
            className="w-full border-2 border-cy-peach bg-white rounded-md px-3 py-2 text-sm font-cyworld text-cy-brown focus:outline-none focus:border-cy-orange"
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1 block">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="방명록을 작성해주세요"
            rows={3}
            className="w-full border-2 border-cy-peach bg-white rounded-md px-3 py-2 text-sm font-cyworld text-cy-brown focus:outline-none focus:border-cy-orange resize-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1 block">태그 선택</label>
          <div className="flex flex-wrap gap-2">
            {REVIEW_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-cyworld border ${
                  selectedTags.includes(tag)
                    ? 'bg-cy-orange text-white border-cy-orange'
                    : 'bg-white text-cy-brown border-cy-peach'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-3 rounded-lg text-sm font-bold font-cyworld bg-cy-orange text-white disabled:bg-cy-peach disabled:text-cy-brown/40 transition-colors border-2 border-cy-coral disabled:border-cy-peach"
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
