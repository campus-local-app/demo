import type { Store } from '../../types';

interface StoreDetailHomeProps {
  store: Store;
}

const DEPARTMENTS = ['컴퓨터공학과', '경영학과', '영어학과', '국제학과', '불어학과'];

export function StoreDetailHome({ store }: StoreDetailHomeProps) {
  // Mock department visit counts
  const deptVisits = DEPARTMENTS.map((dept) => ({
    dept,
    count: Math.floor(Math.random() * 50) + 5,
  })).sort((a, b) => b.count - a.count);
  const maxCount = deptVisits[0]?.count ?? 1;

  return (
    <div className="px-4 py-4 flex flex-col gap-6">
      {/* Affiliated departments */}
      {store.isAffiliated && store.affiliationDepartments.length > 0 && (
        <section>
          <h3 className="font-bold text-gray-900 mb-3">제휴 단과대</h3>
          <div className="flex flex-wrap gap-2">
            {store.affiliationDepartments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200"
              >
                {dept}
              </span>
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
