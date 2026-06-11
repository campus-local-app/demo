import { UserPlus } from 'lucide-react';
import { FriendListTab } from './FriendListTab';

export function FriendsPage() {
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

      {/* Content */}
      <div className="flex-1">
        <FriendListTab />
      </div>
    </div>
  );
}
