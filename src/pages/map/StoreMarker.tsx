import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Store } from '../../types';
import { useAppStore } from '../../store/useAppStore';

function createStoreIcon(isAffiliated: boolean) {
  const bg = isAffiliated ? '#3B6CF4' : '#6B7280';
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${bg};
      width:28px;height:28px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

interface StoreMarkerProps {
  store: Store;
}

export function StoreMarker({ store }: StoreMarkerProps) {
  const navigate = useNavigate();
  const setSelectedStoreId = useAppStore((s) => s.setSelectedStoreId);
  const setBottomSheetExpanded = useAppStore((s) => s.setBottomSheetExpanded);

  function handleClick() {
    setSelectedStoreId(store.id);
    setBottomSheetExpanded(true);
    navigate(`/store/${store.id}`);
  }

  return (
    <Marker
      position={[store.lat, store.lng]}
      icon={createStoreIcon(store.isAffiliated)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <div style={{ minWidth: 120 }}>
          <p style={{ fontWeight: 600, marginBottom: 2 }}>{store.name}</p>
          <p style={{ fontSize: 12, color: '#6B7280' }}>{store.category}</p>
          {store.isAffiliated && (
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>제휴</span>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
