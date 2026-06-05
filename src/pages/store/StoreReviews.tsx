import { useState } from 'react';
import type { Store } from '../../types';
import { reviews } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';
import { StarRating } from '../../components/ui/StarRating';
import { ThumbsUp } from 'lucide-react';

interface StoreReviewsProps {
  store: Store;
}

type SortKey = 'recent' | 'rating';

export function StoreReviews({ store }: StoreReviewsProps) {
  const [sort, setSort] = useState<SortKey>('recent');
  const storeReviews = reviews.filter((r) => r.storeId === store.id);

  const sorted = [...storeReviews].sort((a, b) =>
    sort === 'recent'
      ? b.date.localeCompare(a.date)
      : b.rating - a.rating,
  );

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
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
  );
}
