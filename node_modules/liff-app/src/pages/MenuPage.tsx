import { useState } from 'react';
import { categories, menuItems, getMenuByCategory } from '../data/menu';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Search } from 'lucide-react';

interface MenuPageProps {
  onSelectProduct: (product: Product) => void;
}

export function MenuPage({ onSelectProduct }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by category
  let filteredItems = activeCategory === 'all' 
    ? menuItems 
    : getMenuByCategory(activeCategory);

  // Filter by search
  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
        />
        <input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🍽️</div>
          <p className="text-slate-500">ไม่พบเมนูที่ค้นหา</p>
        </div>
      )}

      {/* Category Header (sticky) */}
      {activeCategory !== 'all' && (
        <div className="text-center text-slate-500 text-sm py-2">
          แสดง {filteredItems.length} รายการ
        </div>
      )}
    </div>
  );
}
