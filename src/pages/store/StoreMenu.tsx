import type { Store } from '../../types';

interface StoreMenuProps {
  store: Store;
}

export function StoreMenu({ store }: StoreMenuProps) {
  if (store.menuItems.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-cy-brown font-cyworld">
        메뉴가 없어요
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-2">
      {store.menuItems.map((item) => (
        <div key={item.id} className="cy-inset-panel px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-cy-dark-brown font-cyworld text-xs truncate">{item.name}</p>
            {item.description && (
              <p className="text-[10px] text-cy-brown mt-0.5 truncate">{item.description}</p>
            )}
          </div>
          <span className="text-xs font-bold text-cy-orange font-cyworld flex-shrink-0">
            {item.price.toLocaleString()}원
          </span>
        </div>
      ))}
    </div>
  );
}
