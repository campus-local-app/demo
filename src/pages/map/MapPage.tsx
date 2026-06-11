import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { stores } from '../../data/mock';
import { MapView } from './MapView';
import { SearchBar } from './SearchBar';
import { MapBottomSheet } from './MapBottomSheet';

export function MapPage() {
  const { selectedCategory, subCategory, mapCenter, mapZoom, searchQuery, selectedStoreId } = useAppStore();

  const filteredStores = useMemo(() => {
    let result = stores;

    // Category filter
    if (selectedCategory === '제휴') {
      result = result.filter((s) => s.isAffiliated);
      // Sub-category filter within 제휴
      if (subCategory) {
        result = result.filter((s) => s.category === subCategory);
      }
    } else if (selectedCategory !== '전체') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
    }

    return result;
  }, [selectedCategory, subCategory, searchQuery]);

  const sortedStores = useMemo(
    () => [...filteredStores].sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)),
    [filteredStores],
  );

  const selectedStore = selectedStoreId
    ? stores.find((s) => s.id === selectedStoreId) ?? null
    : null;

  return (
    <div className="relative w-full isolate" style={{ height: 'calc(100vh - 64px)' }}>
      <MapView
        stores={filteredStores}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
      />
      <SearchBar />
      <MapBottomSheet stores={sortedStores} selectedStore={selectedStore} />
    </div>
  );
}
