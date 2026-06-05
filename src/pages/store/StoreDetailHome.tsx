import type { Store } from '../../types';
import { reviews } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';
import { StarRating } from '../../components/ui/StarRating';

interface StoreDetailHomeProps {
  store: Store;
}

const DEPARTMENTS = ['컴퓨터공학과', '경영학과', '영어학과', '국제학과', '불어학과'];

export function StoreDetailHome({ store }: StoreDetailHomeProps) {
  const storeReviews = reviews.filter((r) => r.storeId === store.id);
  const friendReviews = storeReviews.filter((r) => r.isFriend);

  // Mock department visit counts
  const deptVisits = DEPARTMENTS.map((dept) => ({
    dept,
    count: Math.floor(Math.random() * 50) + 5,
  })).sort((a, b) => b.count - a.count);
  const maxCount = deptVisits[0]?.count ?? 1;

  return (
    <div className="px-4 py-4 flex flex-col gap-6">
      {/* Friend reviews */}
      {friendReviews.length > 0 && (
        <section>
          <h3 className="font-bold text-gray-900 mb-3">친구들의 리뷰</h3>
          <div className="flex flex-col gap-3">
            {friendReviews.map((review) => (
              <div key={review.id} className="flex gap-3">
                <Avatar name={review.userName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{review.userName}</span>
                    <span className="text-xs text-gray-400">{review.userDepartment}</span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dept visit stats */}
      <section>
        <h3 className="font-bold text-gray-900 mb-3">단과대별 방문 현황</h3>
        <div className="flex flex-col gap-2">
          {deptVisits.map(({ dept, count }) => (
            <div key={dept} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-24 flex-shrink-0">{dept}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
