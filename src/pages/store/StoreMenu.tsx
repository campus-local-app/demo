import type { Store } from '../../types';

interface StoreMenuProps {
  store: Store;
}

export function StoreMenu({ store }: StoreMenuProps) {
  if (store.menuItems.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-gray-400">
        메뉴 정보가 없어요
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {store.menuItems.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-3 py-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{item.name}</p>
            {item.description && (
              <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
            )}
          </div>
          <span className="font-bold text-primary-600 flex-shrink-0">
            {item.price.toLocaleString()}원
          </span>
        </div>
      ))}
    </div>
  );
}
