import { stores, events, notices } from '../../data/mock';
import { Pin, CalendarDays } from 'lucide-react';

const affiliatedCount = stores.filter((s) => s.isAffiliated).length;

export function CouncilPage() {
  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-xl font-bold text-gray-900">학생회 포털</h1>
        <p className="text-sm text-gray-500 mt-0.5">한국외국어대학교 총학생회</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-5">
        <div className="bg-primary-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary-700">{affiliatedCount}</p>
          <p className="text-xs text-primary-500 mt-0.5">제휴 업체</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{events.length}</p>
          <p className="text-xs text-emerald-500 mt-0.5">진행 이벤트</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{stores.length}</p>
          <p className="text-xs text-amber-500 mt-0.5">등록 가게</p>
        </div>
      </div>

      {/* Events */}
      <section className="px-4 mb-5">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CalendarDays size={16} className="text-primary-500" />
          진행 중인 이벤트
        </h2>
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <CalendarDays size={11} />
                <span>{event.startDate} ~ {event.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notices */}
      <section className="px-4 mb-5">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Pin size={16} className="text-primary-500" />
          공지사항
        </h2>
        <div className="flex flex-col border-t border-gray-100">
          {notices.map((notice) => (
            <div key={notice.id} className="flex items-start gap-2 py-3 border-b border-gray-100">
              {notice.isPinned && (
                <Pin size={13} className="text-primary-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${notice.isPinned ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {notice.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{notice.author} · {notice.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliation status */}
      <section className="px-4">
        <h2 className="font-bold text-gray-900 mb-3">제휴 현황</h2>
        <div className="flex flex-col gap-2">
          {stores
            .filter((s) => s.isAffiliated)
            .map((store) => (
              <div key={store.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{store.name}</p>
                  <p className="text-xs text-gray-400">{store.category} · {store.address}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full">
                  승인완료
                </span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
