import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { stores } from '../../data/mock';
import { MapView } from './MapView';
import { SearchBar } from './SearchBar';
import { MapBottomSheet } from './MapBottomSheet';

export function MapPage() {
  const { selectedCategory, mapCenter, mapZoom } = useAppStore();

  const filteredStores = useMemo(() => {
    if (selectedCategory === '전체') return stores;
    if (selectedCategory === '제휴') return stores.filter((s) => s.isAffiliated);
    return stores.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const sortedStores = useMemo(
    () => [...filteredStores].sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)),
    [filteredStores],
  );

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      <MapView
        stores={filteredStores}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
      />
      <SearchBar />
      <MapBottomSheet stores={sortedStores} />
    </div>
  );
}
