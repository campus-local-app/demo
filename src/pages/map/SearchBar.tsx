import { Search } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CategoryChip } from '../../components/ui/CategoryChip';
import type { Category } from '../../types';

const CATEGORIES: Category[] = ['전체', '카페', '식당', '주점', '생활'];

export function SearchBar() {
    const { selectedCategory, setCategory, searchQuery, setSearchQuery } = useAppStore();

    return (
        <div className="absolute top-0 left-0 right-0 z-[1000] px-3 pt-3 pb-2 flex flex-col gap-2 pointer-events-none">
            <div className="pointer-events-auto bg-white rounded-xl shadow-md flex items-center px-3 py-2.5 gap-2">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="가게명을 검색해주세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm outline-none placeholder-gray-400"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-gray-400 text-xs flex-shrink-0"
                    >
                        ✕
                    </button>
                )}
            </div>
            <div className="pointer-events-auto flex gap-2 overflow-x-auto scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <CategoryChip
                        key={cat}
                        category={cat}
                        selected={selectedCategory === cat}
                        onClick={() => setCategory(cat)}
                    />
                ))}
            </div>
        </div>
    );
}
