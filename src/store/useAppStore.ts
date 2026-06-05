import { create } from 'zustand';
import type { Category } from '../types';

interface MapCenter {
  lat: number;
  lng: number;
}

interface AppState {
  selectedCategory: Category;
  mapCenter: MapCenter;
  mapZoom: number;
  isBottomSheetExpanded: boolean;
  selectedStoreId: string | null;
  setCategory: (category: Category) => void;
  setMapCenter: (center: MapCenter) => void;
  setMapZoom: (zoom: number) => void;
  setBottomSheetExpanded: (expanded: boolean) => void;
  setSelectedStoreId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCategory: '전체',
  mapCenter: { lat: 37.5974, lng: 127.058 },
  mapZoom: 16,
  isBottomSheetExpanded: false,
  selectedStoreId: null,
  setCategory: (category) => set({ selectedCategory: category }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setBottomSheetExpanded: (expanded) => set({ isBottomSheetExpanded: expanded }),
  setSelectedStoreId: (id) => set({ selectedStoreId: id }),
}));
