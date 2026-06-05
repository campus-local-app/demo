import { useState } from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { schoolEvents, notices } from '../../data/mock';
import type { SchoolEventCategory } from '../../types';

type Filter = '전체' | SchoolEventCategory;

const FILTERS: Filter[] = ['전체', '총학생회', '단과대', '학과'];

const CATEGORY_STYLE: Record<SchoolEventCategory, { bg: string; text: string }> = {
  총학생회: { bg: 'bg-primary-100', text: 'text-primary-700' },
  단과대: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  학과: { bg: 'bg-sky-100', text: 'text-sky-700' },
  주점: { bg: 'bg-amber-100', text: 'text-amber-700' },
  공연: { bg: 'bg-purple-100', text: 'text-purple-700' },
  동아리: { bg: 'bg-rose-100', text: 'text-rose-700' },
};

function dday(dateStr: string): string {
  const today = new Date('2025-05-31');
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-DAY';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function ddayColor(dateStr: string): string {
  const today = new Date('2025-05-31');
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return 'bg-gray-100 text-gray-400';
  if (diff <= 3) return 'bg-red-100 text-red-600';
  if (diff <= 7) return 'bg-amber-100 text-amber-600';
  return 'bg-gray-100 text-gray-500';
}

export function SchoolPage() {
  const [filter, setFilter] = useState<Filter>('전체');

  const highlighted = schoolEvents.find((e) => e.isHighlighted);

  const filtered = schoolEvents
    .filter((e) => !e.isHighlighted)
    .filter((e) => filter === '전체' || e.category === filter);

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">학교 소식</h1>
        <p className="text-sm text-gray-400 mt-0.5">한국외국어대학교</p>
      </div>

      {/* Highlighted event banner */}
      {highlighted && (
        <div className="mx-4 mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/10 rounded-full" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{highlighted.emoji}</span>
              <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                {highlighted.category}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ddayColor(highlighted.date)}`}>
                {dday(highlighted.date)}
              </span>
            </div>
            <h2 className="text-white font-bold text-lg leading-snug mb-2">
              {highlighted.title}
            </h2>
            <p className="text-white/80 text-xs leading-relaxed line-clamp-2 mb-3">
              {highlighted.description}
            </p>
            <div className="flex items-center gap-3 text-white/70 text-xs">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {highlighted.date} {highlighted.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {highlighted.location}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 mb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event feed */}
      <div className="flex flex-col gap-3 px-4 pt-3">
        {filtered.map((event) => {
          const style = CATEGORY_STYLE[event.category];
          return (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {event.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {event.category}
                      </span>
                      {event.college && (
                        <span className="text-xs text-gray-400">{event.college}</span>
                      )}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${ddayColor(event.date)}`}>
                        {dday(event.date)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{event.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                  {event.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {event.date}{event.time ? ` ${event.time}` : ''}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={11} className="flex-shrink-0" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-300">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">해당 카테고리 소식이 없어요</p>
          </div>
        )}
      </div>

      {/* Official notices */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">공지사항</h2>
          <button className="flex items-center gap-0.5 text-xs text-primary-500 font-medium">
            전체보기 <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex flex-col border-t border-gray-100">
          {notices.map((notice) => (
            <div key={notice.id} className="flex items-start gap-2 py-3 border-b border-gray-100">
              {notice.isPinned && (
                <span className="flex-shrink-0 mt-0.5 text-xs font-bold text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded">
                  고정
                </span>
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
      </div>
    </div>
  );
}
