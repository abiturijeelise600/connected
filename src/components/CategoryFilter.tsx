import React from 'react';
import { Category } from '../types';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalProducts,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
      
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategoryId === null
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Categories ({totalProducts})
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500 font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs sm:text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 text-slate-700 cursor-pointer shadow-sm"
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

    </div>
  );
};
