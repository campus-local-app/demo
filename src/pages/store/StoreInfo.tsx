import type { Store } from '../../types';

interface StoreInfoProps {
  store: Store;
}

export function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {/* Introduction */}
      {store.introduction && (
        <div className="cy-inset-panel p-3">
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">💬</span>
            <div>
              <p className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1">인사말</p>
              <p className="text-xs text-cy-brown font-cyworld leading-relaxed">{store.introduction}</p>
            </div>
          </div>
        </div>
      )}

      <div className="cy-inset-panel p-3">
        <div className="flex items-start gap-2">
          <span className="text-base flex-shrink-0">🕐</span>
          <div>
            <p className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1">영업시간</p>
            <p className="text-xs text-cy-brown font-cyworld">평일 {store.hours.weekday}</p>
            <p className="text-xs text-cy-brown font-cyworld">주말 {store.hours.weekend}</p>
            {store.hours.holiday && (
              <p className="text-xs text-cy-brown font-cyworld">공휴일 {store.hours.holiday}</p>
            )}
          </div>
        </div>
      </div>

      <div className="cy-inset-panel p-3">
        <div className="flex items-start gap-2">
          <span className="text-base flex-shrink-0">📍</span>
          <div>
            <p className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1">주소</p>
            <p className="text-xs text-cy-brown font-cyworld">{store.address}</p>
          </div>
        </div>
      </div>

      <div className="cy-inset-panel p-3">
        <div className="flex items-start gap-2">
          <span className="text-base flex-shrink-0">📞</span>
          <div>
            <p className="text-xs font-bold text-cy-dark-brown font-cyworld mb-1">전화번호</p>
            <a href={`tel:${store.phone}`} className="text-xs text-cy-orange font-bold font-cyworld">
              {store.phone}
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
