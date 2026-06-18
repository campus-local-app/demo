import type { Store } from '../../types';
import { reviews as mockReviews } from '../../data/mock';

interface StoreDetailHomeProps {
  store: Store;
}

const DEPARTMENTS = ['컴퓨터공학과', '경영학과', '영어학과', '국제학과', '불어학과'];

export function StoreDetailHome({ store }: StoreDetailHomeProps) {
  const deptVisits = DEPARTMENTS.map((dept) => ({
    dept,
    count: Math.floor(Math.random() * 50) + 5,
  })).sort((a, b) => b.count - a.count);
  const maxCount = deptVisits[0]?.count ?? 1;

  const recentReviews = mockReviews
    .filter((r) => r.storeId === store.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      {/* Affiliated departments - 일촌 스타일 */}
      {store.isAffiliated && store.affiliationDepartments.length > 0 && (
        <section className="cy-inset-panel p-3">
          <h3 className="font-bold text-cy-dark-brown font-cyworld text-sm mb-2">🤝 일촌 단과대</h3>
          <div className="flex flex-wrap gap-2">
            {store.affiliationDepartments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center px-2.5 py-1 bg-white text-cy-orange text-xs font-bold font-cyworld rounded-full border border-cy-peach"
              >
                {dept}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 지금 뜨는 소문 - 한줄 인용 리스트 */}
      <section className="cy-inset-panel p-3">
        <h3 className="font-bold text-cy-dark-brown font-cyworld text-sm mb-3">📝 최근 방명록</h3>
        {recentReviews.length === 0 ? (
          <p className="text-xs text-cy-brown font-cyworld text-center py-3">아직 방명록이 없어요</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {recentReviews.map((review) => {
              const snippet = review.content.length > 18
                ? review.content.slice(0, 18) + '...'
                : review.content;
              return (
                <p key={review.id} className="text-xs text-cy-brown font-cyworld">
                  <span className="text-cy-dark-brown">「{snippet}」</span>
                  <span className="text-cy-brown/60"> - {review.userDepartment}</span>
                </p>
              );
            })}
          </div>
        )}
      </section>

      {/* Dept visit stats - 오렌지 프로그레스 바 */}
      <section className="cy-inset-panel p-3">
        <h3 className="font-bold text-cy-dark-brown font-cyworld text-sm mb-3">📊 단과대별 방문 현황</h3>
        <div className="flex flex-col gap-2">
          {deptVisits.map(({ dept, count }) => (
            <div key={dept} className="flex items-center gap-2">
              <span className="text-xs text-cy-brown font-cyworld w-20 flex-shrink-0 truncate">{dept}</span>
              <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden border border-cy-peach">
                <div
                  className="h-full bg-gradient-to-r from-cy-orange to-cy-coral rounded-full"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-cy-brown font-cyworld w-6 text-right font-bold">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
