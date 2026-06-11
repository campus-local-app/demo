import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { currentUser, stores, reviews } from '../../data/mock';
import { StarRating } from '../../components/ui/StarRating';

export function MyReviewsPage() {
  const navigate = useNavigate();
  const myReviews = reviews.filter((r) => r.userId === currentUser.id);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-900">내 리뷰</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {myReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">작성한 리뷰가 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myReviews.map((review) => {
              const store = stores.find((s) => s.id === review.storeId);
              return (
                <button
                  key={review.id}
                  onClick={() => navigate(`/store/${review.storeId}`)}
                  className="flex flex-col gap-1.5 bg-white rounded-2xl px-5 py-4 text-left shadow-sm active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{store?.name ?? '가게'}</span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600">{review.content}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
