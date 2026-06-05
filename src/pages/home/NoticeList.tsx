import { Pin } from 'lucide-react';
import { notices } from '../../data/mock';

export function NoticeList() {
  return (
    <section>
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="font-bold text-gray-900">공지사항</h2>
        <button className="text-xs text-primary-500 font-medium">전체보기</button>
      </div>
      <div className="flex flex-col px-4 gap-0 border-t border-gray-100">
        {notices.map((notice) => (
          <div key={notice.id} className="flex items-start gap-2 py-3 border-b border-gray-100">
            {notice.isPinned && (
              <Pin size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${notice.isPinned ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {notice.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {notice.author} · {notice.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
