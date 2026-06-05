import type { Category } from '../../types';

interface CategoryChipProps {
  category: Category;
  selected: boolean;
  onClick: () => void;
}

export function CategoryChip({ category, selected, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        selected
          ? 'bg-primary-500 text-white'
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {category}
    </button>
  );
}
