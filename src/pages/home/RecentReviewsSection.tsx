import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, Star, ThumbsUp } from 'lucide-react';
import { reviews, stores } from '../../data/mock';

const recentReviews = [...reviews]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 8);

export function RecentReviewsSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section>
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-1.5">
          <MessageSquareText size={16} className="text-orange-500" />
          <h2 className="font-bold text-gray-900 text-[15px]">최근 리뷰</h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="pl-5 shrink-0" />
        {recentReviews.map((review) => {
          const store = stores.find((s) => s.id === review.storeId);
          if (!store) return null;
          return (
            <button
              key={review.id}
              onClick={() => navigate(`/store/${store.id}`)}
              className="shrink-0 w-56 bg-white rounded-2xl border border-gray-100 p-3.5 text-left shadow-sm"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  {review.userName.startsWith('익명 부#') ? '부' : review.userName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {review.userName}
                  </p>
                  <p className="text-[10px] text-gray-400">{review.userDepartment}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }
                  />
                ))}
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                {review.content}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-primary-500 font-medium truncate">
                  {store.name}
                </p>
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <ThumbsUp size={9} />
                  {review.likes}
                </span>
              </div>
            </button>
          );
        })}
        <div className="pr-5 shrink-0" />
      </div>
    </section>
  );
}
