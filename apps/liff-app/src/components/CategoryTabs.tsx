import { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 py-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
            activeCategory === 'all'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          ทั้งหมด
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
