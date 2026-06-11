import { create } from 'zustand';
import type { Category, StampCard } from '../types';
import { myStampCards } from '../data/mock';

export type BottomSheetState = 'collapsed' | 'preview' | 'expanded';
export type SubCategory = '카페' | '식당' | '주점' | '생활';

interface MapCenter {
  lat: number;
  lng: number;
}

export interface AddStampResult {
  newCount: number;
  goal: number;
  completed: boolean;
  reward: string;
}

interface AppState {
  selectedCategory: Category;
  subCategory: SubCategory | null;
  mapCenter: MapCenter;
  mapZoom: number;
  bottomSheetState: BottomSheetState;
  selectedStoreId: string | null;
  searchQuery: string;
  stampCards: StampCard[];
  setCategory: (category: Category) => void;
  setSubCategory: (sub: SubCategory | null) => void;
  setMapCenter: (center: MapCenter) => void;
  setMapZoom: (zoom: number) => void;
  setBottomSheetState: (state: BottomSheetState) => void;
  setSelectedStoreId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  addStamp: (storeId: string) => AddStampResult;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedCategory: '전체',
  subCategory: null,
  mapCenter: { lat: 37.5974, lng: 127.058 },
  mapZoom: 16,
  bottomSheetState: 'preview',
  selectedStoreId: null,
  searchQuery: '',
  stampCards: myStampCards,
  setCategory: (category) => set({ selectedCategory: category, subCategory: null }),
  setSubCategory: (sub) => set({ subCategory: sub }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setBottomSheetState: (state) => set({ bottomSheetState: state }),
  setSelectedStoreId: (id) => set({ selectedStoreId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addStamp: (storeId) => {
    const cards = get().stampCards;
    const existing = cards.find((c) => c.storeId === storeId);

    if (existing) {
      const newCount = existing.current + 1;
      const completed = newCount >= existing.goal;
      set({
        stampCards: cards.map((c) =>
          c.storeId === storeId ? { ...c, current: newCount } : c,
        ),
      });
      return { newCount, goal: existing.goal, completed, reward: existing.reward };
    }

    const newCard: StampCard = {
      id: `sc-${Date.now()}`,
      storeId,
      current: 1,
      goal: 10,
      reward: '무료 메뉴 1개',
    };
    set({ stampCards: [...cards, newCard] });
    return { newCount: 1, goal: 10, completed: false, reward: newCard.reward };
  },
}));
