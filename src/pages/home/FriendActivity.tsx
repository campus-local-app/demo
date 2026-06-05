import { friends } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';

export function FriendActivity() {
  const withActivity = friends.filter((f) => f.lastVisited);

  return (
    <section>
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="font-bold text-gray-900">친구 최근 방문</h2>
      </div>
      <div className="flex flex-col gap-3 px-4">
        {withActivity.map((friend) => (
          <div key={friend.id} className="flex items-center gap-3">
            <Avatar name={friend.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                <span className="font-bold">{friend.name}</span>
                <span className="text-gray-500">님이 방문했어요</span>
              </p>
              <p className="text-xs text-gray-400">
                {friend.lastVisited?.storeName} · {friend.lastVisited?.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
