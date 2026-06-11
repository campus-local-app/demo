import L from 'leaflet';
import { Marker } from 'react-leaflet';
import type { Store } from '../../types';
import { useAppStore } from '../../store/useAppStore';

function createStoreIcon(isAffiliated: boolean, isSelected: boolean) {
  const bg = isSelected ? '#F59E0B' : isAffiliated ? '#3B6CF4' : '#6B7280';
  const size = isSelected ? 34 : 28;
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${bg};
      width:${size}px;height:${size}px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

interface StoreMarkerProps {
  store: Store;
}

export function StoreMarker({ store }: StoreMarkerProps) {
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const setSelectedStoreId = useAppStore((s) => s.setSelectedStoreId);

  const isSelected = selectedStoreId === store.id;

  function handleClick() {
    setSelectedStoreId(isSelected ? null : store.id);
  }

  return (
    <Marker
      position={[store.lat, store.lng]}
      icon={createStoreIcon(store.isAffiliated, isSelected)}
      eventHandlers={{ click: handleClick }}
    />
  );
}
