import { useState } from 'react';
import { UserPlus, Rss, BookMarked } from 'lucide-react';
import { FriendFeed } from './FriendFeed';
import { FriendListTab } from './FriendListTab';

type Tab = 'feed' | 'list';

export function FriendsPage() {
  const [tab, setTab] = useState<Tab>('feed');

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">친구</h1>
        <button className="flex items-center gap-1.5 bg-primary-500 text-white text-sm font-medium px-3 py-1.5 rounded-full">
          <UserPlus size={15} />
          친구 추가
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 px-4">
        <button
          onClick={() => setTab('feed')}
          className={`flex items-center gap-1.5 pb-2.5 mr-6 text-sm font-medium border-b-2 transition-colors ${
            tab === 'feed'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-400'
          }`}
        >
          <Rss size={15} />
          친구 소식
        </button>
        <button
          onClick={() => setTab('list')}
          className={`flex items-center gap-1.5 pb-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'list'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-400'
          }`}
        >
          <BookMarked size={15} />
          친구 맛집
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {tab === 'feed' ? <FriendFeed /> : <FriendListTab />}
      </div>
    </div>
  );
}
