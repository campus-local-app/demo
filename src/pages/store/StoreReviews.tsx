import { useState, useEffect } from 'react';
import type { Store, Review } from '../../types';
import { reviews as mockReviews } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';
import { StarRating } from '../../components/ui/StarRating';
import { ThumbsUp, Pen, X, Star, CheckCircle2 } from 'lucide-react';
import { useAppStore, type AddStampResult } from '../../store/useAppStore';

interface StoreReviewsProps {
  store: Store;
}

type SortKey = 'recent' | 'rating';

const REVIEW_TAGS = ['가성비', '양많음', '맛있음', '친절함', '분위기좋음', '웨이팅', '깔끔함', '혼밥가능'];

export function StoreReviews({ store }: StoreReviewsProps) {
  const [sort, setSort] = useState<SortKey>('recent');
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [stampResult, setStampResult] = useState<AddStampResult | null>(null);
  const addStamp = useAppStore((s) => s.addStamp);

  const storeReviews = [
    ...mockReviews.filter((r) => r.storeId === store.id),
    ...localReviews,
  ];

  const sorted = [...storeReviews].sort((a, b) =>
    sort === 'recent'
      ? b.date.localeCompare(a.date)
      : b.rating - a.rating,
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
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 shadow-xl animate-in fade-in zoom-in mx-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${stampResult.completed ? 'bg-amber-100' : 'bg-emerald-100'}`}>
              <CheckCircle2 size={36} className={stampResult.completed ? 'text-amber-500' : 'text-emerald-500'} />
            </div>
            <p className="text-lg font-bold text-gray-900">
              {stampResult.completed ? '보상 획득!' : '스탬프 적립!'}
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {stampResult.newCount}/{stampResult.goal}
            </p>
            {stampResult.completed && (
              <p className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                {stampResult.reward}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="px-4 py-4 flex flex-col gap-4 pb-20">
        <div className="flex gap-2">
          <button
            onClick={() => setSort('recent')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${sort === 'recent' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('rating')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${sort === 'rating' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            별점순
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">아직 리뷰가 없어요</p>
        ) : (
          sorted.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-start gap-3">
                <Avatar name={review.userName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{review.userName}</span>
                    <span className="text-xs text-gray-400">{review.userDepartment}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-gray-400">{review.date}</span>
                    {review.visitCount && (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        {review.visitCount}번째 방문
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{review.content}</p>
                  {review.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {review.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <ThumbsUp size={12} />
                    <span>{review.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors z-30"
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
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const canSubmit = department.trim() && rating > 0 && content.trim();

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
      rating,
      content: content.trim(),
      tags: selectedTags,
      date: today,
      likes: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-[430px] rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">리뷰 작성</h3>
          <button onClick={onClose} className="p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Anonymous label */}
        <div className="mb-3 bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-sm text-gray-500">익명 부#으로 자동 게시됩니다</p>
        </div>

        {/* Department */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700 mb-1 block">학과</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="학과를 입력하세요"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
          />
        </div>

        {/* Rating */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700 mb-1 block">별점</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>
                <Star
                  size={28}
                  className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700 mb-1 block">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰를 작성해주세요"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 resize-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">태그 선택</label>
          <div className="flex flex-wrap gap-2">
            {REVIEW_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600'
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
          className="w-full py-3 rounded-xl text-sm font-bold bg-primary-500 text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
