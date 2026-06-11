import { Clock, MapPin, Phone, MessageSquare } from 'lucide-react';
import type { Store } from '../../types';

interface StoreInfoProps {
  store: Store;
}

export function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {/* Introduction */}
      {store.introduction && (
        <div className="flex items-start gap-3">
          <MessageSquare size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">인사말</p>
            <p className="text-sm text-gray-600 leading-relaxed">{store.introduction}</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">영업시간</p>
          <p className="text-sm text-gray-600">평일 {store.hours.weekday}</p>
          <p className="text-sm text-gray-600">주말 {store.hours.weekend}</p>
          {store.hours.holiday && (
            <p className="text-sm text-gray-600">공휴일 {store.hours.holiday}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">주소</p>
          <p className="text-sm text-gray-600">{store.address}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">전화번호</p>
          <a href={`tel:${store.phone}`} className="text-sm text-primary-500 font-medium">
            {store.phone}
          </a>
        </div>
      </div>

      {store.tags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">태그</p>
          <div className="flex flex-wrap gap-2">
            {store.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
